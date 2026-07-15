import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { VerifyPaymentDto } from './dto/verify-payment.dto';
import { PaymentStatus } from '@prisma/client';
import Razorpay from 'razorpay';
import * as crypto from 'crypto';
import { InvoiceService } from '../invoice/invoice.service';
import { MailService } from '../mail/mail.service';
import { NotificationsService } from '../notifications/notifications.service';
import {
  BookingStatus,
  Role,
  VendorBadge,
  VendorStatus,
} from '@prisma/client';
import { PayoutsService } from '../payouts/payouts.service';

@Injectable()
export class PaymentService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly invoiceService: InvoiceService,
    private readonly mailService: MailService,
    private readonly notificationsService: NotificationsService,
    private readonly payoutsService: PayoutsService,
  ) {}

  private getRazorpay() {
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      throw new BadRequestException(
        'Payment gateway is not configured',
      );
    }

    return new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });
  }

  private getAdvanceRate(totalAmount: unknown) {
    const total = Number(totalAmount);

    if (total <= 20000) {
      return 50;
    }

    if (total <= 50000) {
      return 40;
    }

    if (total <= 100000) {
      return 30;
    }

    if (total <= 300000) {
      return 25;
    }

    if (total <= 500000) {
      return 20;
    }

    return 15;
  }

  private getAdvanceAmount(totalAmount: unknown) {
    const total = Number(totalAmount);
    const rate = this.getAdvanceRate(total);

    return Math.round((total * rate) / 100);
  }

  private getSettlement(totalAmount: unknown) {
    const total = Number(totalAmount);
    const platformCommission = Math.round(total * 10) / 100;

    return {
      totalAmount: total,
      platformCommissionRate: 10,
      platformCommission,
      vendorReceives: total - platformCommission,
    };
  }

  private readonly badgePrices: Record<VendorBadge, number> = {
    [VendorBadge.BRONZE]: 0,
    [VendorBadge.SILVER]: 999,
    [VendorBadge.GOLD]: 1999,
  };

  private readonly badgeLimits: Record<VendorBadge, number> = {
    [VendorBadge.BRONZE]: 5,
    [VendorBadge.SILVER]: 15,
    [VendorBadge.GOLD]: 50,
  };

  private readonly badgeRank: Record<VendorBadge, number> = {
    [VendorBadge.BRONZE]: 1,
    [VendorBadge.SILVER]: 2,
    [VendorBadge.GOLD]: 3,
  };

  private verifySignature(
    orderId: string,
    paymentId: string,
    signature: string,
  ) {
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keySecret) {
      throw new BadRequestException(
        'Payment gateway is not configured',
      );
    }

    const expectedSignature = crypto
      .createHmac('sha256', keySecret)
      .update(orderId + '|' + paymentId)
      .digest('hex');

    const providedSignature = Buffer.from(signature);
    const calculatedSignature = Buffer.from(expectedSignature);

    if (
      providedSignature.length !== calculatedSignature.length ||
      !crypto.timingSafeEqual(
        providedSignature,
        calculatedSignature,
      )
    ) {
      throw new BadRequestException(
        'Invalid payment signature',
      );
    }
  }

  async createVendorBadgeOrder(
    userId: string,
    badge: VendorBadge,
  ) {
    if (!Object.values(VendorBadge).includes(badge)) {
      throw new BadRequestException('Invalid badge plan');
    }

    const vendor = await this.prisma.vendor.findUnique({
      where: { userId },
    });

    if (!vendor) {
      throw new NotFoundException('Vendor profile not found');
    }

    if (vendor.status !== VendorStatus.APPROVED) {
      throw new ForbiddenException(
        'Vendor account must be approved before upgrading badge',
      );
    }

    if (this.badgeRank[badge] <= this.badgeRank[vendor.badge]) {
      throw new BadRequestException(
        'Please select a higher badge plan to upgrade',
      );
    }

    const amount = this.badgePrices[badge];

    const order = await this.getRazorpay().orders.create({
      amount: Math.round(amount * 100),
      currency: 'INR',
      receipt: `badge_${vendor.id}_${Date.now()}`.slice(0, 40),
      notes: {
        vendorId: vendor.id,
        badge,
        paymentType: 'VENDOR_BADGE_UPGRADE',
      },
    });

    await this.prisma.vendor.update({
      where: { id: vendor.id },
      data: {
        badgePaymentOrderId: order.id,
      },
    });

    return {
      success: true,
      message: 'Badge upgrade order created successfully',
      data: {
        vendorId: vendor.id,
        badge: badge.toLowerCase(),
        orderId: order.id,
        keyId: process.env.RAZORPAY_KEY_ID,
        amount,
        amountInPaise: order.amount,
        currency: 'INR',
        monthlyBookingLimit: this.badgeLimits[badge],
      },
    };
  }

  async createVendorRegistrationBadgeOrder(
    badge: VendorBadge,
  ) {
    if (!Object.values(VendorBadge).includes(badge)) {
      throw new BadRequestException('Invalid badge plan');
    }

    if (badge === VendorBadge.BRONZE) {
      throw new BadRequestException(
        'Please select a paid badge plan to register as a vendor',
      );
    }

    const amount = this.badgePrices[badge];

    const order = await this.getRazorpay().orders.create({
      amount: Math.round(amount * 100),
      currency: 'INR',
      receipt: `vendor_reg_${Date.now()}`.slice(0, 40),
      notes: {
        badge,
        paymentType: 'VENDOR_REGISTRATION_BADGE',
      },
    });

    return {
      success: true,
      message:
        'Vendor registration badge order created successfully',
      data: {
        badge: badge.toLowerCase(),
        orderId: order.id,
        keyId: process.env.RAZORPAY_KEY_ID,
        amount,
        amountInPaise: order.amount,
        currency: 'INR',
        monthlyBookingLimit: this.badgeLimits[badge],
      },
    };
  }

  async verifyVendorBadgePayment(
    userId: string,
    badge: VendorBadge,
    dto: VerifyPaymentDto,
  ) {
    if (!Object.values(VendorBadge).includes(badge)) {
      throw new BadRequestException('Invalid badge plan');
    }

    const vendor = await this.prisma.vendor.findUnique({
      where: { userId },
    });

    if (!vendor) {
      throw new NotFoundException('Vendor profile not found');
    }

    if (
      !vendor.badgePaymentOrderId ||
      dto.orderId !== vendor.badgePaymentOrderId
    ) {
      throw new BadRequestException(
        'Payment order does not match this badge upgrade',
      );
    }

    this.verifySignature(
      dto.orderId,
      dto.paymentId,
      dto.signature,
    );

    const updatedVendor = await this.prisma.vendor.update({
      where: { id: vendor.id },
      data: {
        badge,
        monthlyBookingLimit: this.badgeLimits[badge],
        badgePurchasedAt: new Date(),
        badgePaymentId: dto.paymentId,
        badgePaymentOrderId: null,
        badgePaymentRefundId: null,
        badgePaymentRefundedAt: null,
      },
    });

    const admins = await this.prisma.user.findMany({
      where: { role: Role.ADMIN },
      select: { id: true },
    });

    await Promise.all([
      this.notificationsService.create(userId, {
        title: 'Badge Upgraded',
        message: `Your vendor badge is now ${badge}. You can receive up to ${this.badgeLimits[badge]} bookings per month.`,
      }),
      ...admins.map((admin) =>
        this.notificationsService.create(admin.id, {
          title: 'Vendor Badge Purchased',
          message: `${updatedVendor.businessName} upgraded to ${badge}.`,
        }),
      ),
    ]);

    return {
      success: true,
      message: 'Badge upgraded successfully',
      data: {
        badge: updatedVendor.badge.toLowerCase(),
        monthlyBookingLimit:
          updatedVendor.monthlyBookingLimit,
        badgePurchasedAt:
          updatedVendor.badgePurchasedAt,
      },
    };
  }

  // ===============================
  // CREATE ORDER
  // ===============================
  async createOrder(
    userId: string,
    dto: CreateOrderDto,
  ) {
    const booking = await this.prisma.booking.findUnique({
      where: {
        id: dto.bookingId,
      },
      include: {
        package: true,
        vendor: true,
      },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    if (booking.userId !== userId) {
      throw new ForbiddenException(
        'You are not allowed to access this booking',
      );
    }

    const requiredAdvance = this.getAdvanceAmount(
      booking.totalAmount,
    );
    const advanceRate = this.getAdvanceRate(
      booking.totalAmount,
    );

    if (
      Number(booking.amountPaid) >= requiredAdvance
    ) {
      throw new BadRequestException(
        'Required advance is already paid',
      );
    }

    const order = await this.getRazorpay().orders.create({
      amount: Math.round(requiredAdvance * 100),
      currency: 'INR',
      receipt: `advance_${booking.bookingNumber}`.slice(0, 40),
      notes: {
        bookingId: booking.id,
        paymentType: 'BOOKING_ADVANCE',
      },
    });

    await this.prisma.booking.update({
      where: { id: booking.id },
      data: {
        advancePaymentOrderId: order.id,
        paymentStatus: PaymentStatus.PROCESSING,
      },
    });

    return {
      success: true,
      message: 'Order created successfully',
      data: {
        bookingId: booking.id,
        orderId: order.id,
        keyId: process.env.RAZORPAY_KEY_ID,
        amount: requiredAdvance,
        advancePercentage: advanceRate,
        amountInPaise: order.amount,
        totalAmount: Number(booking.totalAmount),
        paymentStatus: PaymentStatus.PROCESSING,
        currency: 'INR',
      },
    };
  }

  async createRemainingOrder(
    userId: string,
    dto: CreateOrderDto,
  ) {
    const booking = await this.prisma.booking.findUnique({
      where: {
        id: dto.bookingId,
      },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    if (booking.userId !== userId) {
      throw new ForbiddenException(
        'You are not allowed to access this booking',
      );
    }

    if (booking.status !== BookingStatus.PAYMENT_APPROVED) {
      throw new BadRequestException(
        'Admin approval is required before completing the remaining payment',
      );
    }

    if (booking.paymentStatus === PaymentStatus.SUCCESS) {
      throw new BadRequestException('Payment already completed');
    }

    const remainingAmount = Number(booking.remainingAmount);

    if (remainingAmount <= 0) {
      throw new BadRequestException('No remaining payment is due');
    }

    const order = await this.getRazorpay().orders.create({
      amount: Math.round(remainingAmount * 100),
      currency: 'INR',
      receipt: `remaining_${booking.bookingNumber}`.slice(0, 40),
      notes: {
        bookingId: booking.id,
        paymentType: 'BOOKING_REMAINING',
      },
    });

    await this.prisma.booking.update({
      where: { id: booking.id },
      data: {
        finalPaymentOrderId: order.id,
        paymentStatus: PaymentStatus.PROCESSING,
      },
    });

    return {
      success: true,
      message: 'Remaining payment order created successfully',
      data: {
        bookingId: booking.id,
        orderId: order.id,
        keyId: process.env.RAZORPAY_KEY_ID,
        amount: remainingAmount,
        amountInPaise: order.amount,
        totalAmount: Number(booking.totalAmount),
        paymentStatus: PaymentStatus.PROCESSING,
        currency: 'INR',
      },
    };
  }

  // ===============================
  // VERIFY PAYMENT
  // ===============================
  async verifyPayment(
    userId: string,
    bookingId: string,
    dto: VerifyPaymentDto,
  ) {
    const booking = await this.prisma.booking.findUnique({
      where: {
        id: bookingId,
      },
      include: {
    user: true,
    vendor: true,
    package: {
      include: {
        category: true,
      },
    },
  },
    });

    if (!booking) {
      throw new NotFoundException(
        'Booking not found',
      );
    }

    if (booking.userId !== userId) {
      throw new ForbiddenException(
        'Access denied',
      );
    }

    const requiredAdvance = this.getAdvanceAmount(
      booking.totalAmount,
    );
    const advanceRate = this.getAdvanceRate(
      booking.totalAmount,
    );

    if (
      Number(booking.amountPaid) >= requiredAdvance
    ) {
      throw new BadRequestException(
        'Payment already verified',
      );
    }

    if (
      !booking.advancePaymentOrderId ||
      dto.orderId !== booking.advancePaymentOrderId
    ) {
      throw new BadRequestException(
        'Payment order does not match this booking',
      );
    }

    this.verifySignature(
      dto.orderId,
      dto.paymentId,
      dto.signature,
    );

    await this.prisma.booking.update({
  where: {
    id: booking.id,
  },
  data: {
  paymentStatus: PaymentStatus.PARTIAL,
  amountPaid: requiredAdvance,
  remainingAmount:
    Number(booking.totalAmount) - requiredAdvance,
  status: BookingStatus.ADVANCE_PAID,
}
});

await this.payoutsService.ensureAdvancePayout(
  booking.id,
  requiredAdvance,
  dto.paymentId,
);

// Fetch complete booking details for invoice
const completedBooking =
  await this.prisma.booking.findUnique({
    where: {
      id: booking.id,
    },
    include: {
      user: true,
      vendor: true,
      package: {
        include: {
          category: true,
        },
      },
      payout: true,
    },
  });

if (!completedBooking) {
  throw new NotFoundException(
    'Booking not found',
  );
}

// Generate Invoice PDF
try {
  const invoicePath =
    await this.invoiceService.generateInvoice(
      completedBooking,
    );

  await this.mailService.sendBookingInvoice(
    completedBooking.user.email,
    completedBooking.user.name,
    invoicePath,
  );
} catch {
  // Payment remains valid even if email delivery is temporarily unavailable.
}

const admins = await this.prisma.user.findMany({
  where: { role: Role.ADMIN },
  select: { id: true },
});

await Promise.all(
  admins.map((admin) =>
    this.notificationsService.create(admin.id, {
      title: 'Booking Awaiting Approval',
      message: `${completedBooking.user.name} paid the ${advanceRate}% advance for booking ${completedBooking.bookingNumber}.`,
    }),
  ),
);

await this.notificationsService.create(completedBooking.userId, {
  title: 'Advance Payment Received',
  message: `Your ${advanceRate}% advance for booking ${completedBooking.bookingNumber} was received. Admin review is pending.`,
});

return {
  success: true,
  message:
    'Advance payment verified. Booking is awaiting admin approval.',
  data: completedBooking,
};
  }

  async verifyRemainingPayment(
    userId: string,
    bookingId: string,
    dto: VerifyPaymentDto,
  ) {
    const booking = await this.prisma.booking.findUnique({
      where: {
        id: bookingId,
      },
      include: {
        user: true,
        vendor: true,
        package: {
          include: {
            category: true,
          },
        },
      },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    if (booking.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    if (booking.status !== BookingStatus.PAYMENT_APPROVED) {
      throw new BadRequestException(
        'Admin approval is required before completing the remaining payment',
      );
    }

    if (booking.paymentStatus === PaymentStatus.SUCCESS) {
      throw new BadRequestException('Payment already verified');
    }

    if (
      !booking.finalPaymentOrderId ||
      dto.orderId !== booking.finalPaymentOrderId
    ) {
      throw new BadRequestException(
        'Payment order does not match this booking',
      );
    }

    this.verifySignature(
      dto.orderId,
      dto.paymentId,
      dto.signature,
    );

    const totalAmount = Number(booking.totalAmount);
    const updatedBooking = await this.prisma.booking.update({
      where: {
        id: booking.id,
      },
      data: {
        amountPaid: totalAmount,
        remainingAmount: 0,
        paymentStatus: PaymentStatus.SUCCESS,
        status: BookingStatus.CONFIRMED,
        finalPaymentOrderId: null,
      },
      include: {
        user: true,
        vendor: true,
        package: {
          include: {
            category: true,
          },
        },
      },
    });

    const settlement = this.getSettlement(totalAmount);

    await Promise.all([
      this.notificationsService.create(updatedBooking.vendor.userId, {
        title: 'Payment Ready for Settlement',
        message: `Full payment for booking ${updatedBooking.bookingNumber} is complete. Vendor settlement amount is ₹${settlement.vendorReceives.toLocaleString('en-IN')}.`,
      }),
      this.notificationsService.create(updatedBooking.userId, {
        title: 'Payment Completed',
        message: `Your remaining payment for booking ${updatedBooking.bookingNumber} was received.`,
      }),
    ]);

    return {
      success: true,
      message: 'Remaining payment verified successfully',
      data: {
        ...updatedBooking,
        settlement,
      },
    };
  }

  // ===============================
  // PAYMENT HISTORY
  // ===============================
  async paymentHistory(userId: string) {
    const payments =
      await this.prisma.booking.findMany({
        where: {
          userId,
          paymentStatus: {
            in: [
              PaymentStatus.PARTIAL,
              PaymentStatus.SUCCESS,
            ],
          },
        },
        include: {
          package: true,
          vendor: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

    return {
      success: true,
      count: payments.length,
      data: payments,
    };
  }

  // ===============================
  // SINGLE PAYMENT
  // ===============================
  async getPayment(
    userId: string,
    bookingId: string,
  ) {
    const booking =
      await this.prisma.booking.findUnique({
        where: {
          id: bookingId,
        },
        include: {
          package: true,
          vendor: true,
          user: true,
        },
      });

    if (!booking) {
      throw new NotFoundException(
        'Booking not found',
      );
    }

    if (booking.userId !== userId) {
      throw new ForbiddenException(
        'Access denied',
      );
    }

    return {
      success: true,
      data: booking,
    };
  }
}
