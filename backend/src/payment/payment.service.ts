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
  VendorBadgeBillingCycle,
  VendorStatus,
  PremiumPlanningStatus,
  VendorAssignmentRole,
  VendorAssignmentStatus,
  CustomerMembership,
} from '@prisma/client';
import { PayoutsService } from '../payouts/payouts.service';
import { CUSTOMER_PREMIUM_PRICE } from '../premium-planning/premium-planning.constants';
import {
  getVendorBadgeExpiry,
  VENDOR_BADGE_LIMITS,
  VENDOR_BADGE_PRICES,
} from './vendor-badge.constants';

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

  private getSettlement(
    totalAmount: unknown,
    platformCommissionValue: unknown,
  ) {
    const total = Number(totalAmount);
    const platformCommission = Math.max(
      0,
      Number(platformCommissionValue) || 0,
    );
    const platformCommissionRate =
      total > 0
        ? Math.round((platformCommission / total) * 10_000) / 100
        : 0;

    return {
      totalAmount: total,
      platformCommissionRate,
      platformCommission,
      vendorReceives:
        this.payoutsService.calculateVendorNetCollected(
          total,
          platformCommission,
        ),
    };
  }

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
    billingCycle: VendorBadgeBillingCycle,
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

    if (!Object.values(VendorBadgeBillingCycle).includes(billingCycle)) {
      throw new BadRequestException('Invalid badge billing cycle');
    }

    if (this.badgeRank[badge] < this.badgeRank[vendor.badge]) {
      throw new BadRequestException(
        'Please select a higher badge plan to upgrade',
      );
    }

    const amount = VENDOR_BADGE_PRICES[billingCycle][badge];

    const order = await this.getRazorpay().orders.create({
      amount: Math.round(amount * 100),
      currency: 'INR',
      receipt: `badge_${vendor.id}_${Date.now()}`.slice(0, 40),
      notes: {
        vendorId: vendor.id,
        badge,
        billingCycle,
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
        billingCycle: billingCycle.toLowerCase(),
        orderId: order.id,
        keyId: process.env.RAZORPAY_KEY_ID,
        amount,
        amountInPaise: order.amount,
        currency: 'INR',
        monthlyBookingLimit: VENDOR_BADGE_LIMITS[badge],
      },
    };
  }

  async createVendorRegistrationBadgeOrder(
    badge: VendorBadge,
    billingCycle: VendorBadgeBillingCycle,
    registrationVerificationId: string,
  ) {
    if (!Object.values(VendorBadge).includes(badge)) {
      throw new BadRequestException('Invalid badge plan');
    }

    if (badge === VendorBadge.BRONZE) {
      throw new BadRequestException(
        'Please select a paid badge plan to register as a vendor',
      );
    }

    if (!Object.values(VendorBadgeBillingCycle).includes(billingCycle)) {
      throw new BadRequestException('Invalid badge billing cycle');
    }

    const verification =
      await this.prisma.vendorRegistrationVerification.findUnique({
        where: { id: registrationVerificationId },
      });
    if (
      !verification ||
      !verification.verifiedAt ||
      verification.usedAt ||
      verification.expiresAt < new Date()
    ) {
      throw new BadRequestException(
        'Please verify your business email before starting badge payment.',
      );
    }

    await this.prisma.vendorRegistrationVerification.update({
      where: { id: registrationVerificationId },
      data: { expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) },
    });

    const amount = VENDOR_BADGE_PRICES[billingCycle][badge];

    const order = await this.getRazorpay().orders.create({
      amount: Math.round(amount * 100),
      currency: 'INR',
      receipt: `vendor_reg_${Date.now()}`.slice(0, 40),
      notes: {
        badge,
        billingCycle,
        registrationVerificationId,
        paymentType: 'VENDOR_REGISTRATION_BADGE',
      },
    });

    return {
      success: true,
      message:
        'Vendor registration badge order created successfully',
      data: {
        badge: badge.toLowerCase(),
        billingCycle: billingCycle.toLowerCase(),
        orderId: order.id,
        keyId: process.env.RAZORPAY_KEY_ID,
        amount,
        amountInPaise: order.amount,
        currency: 'INR',
        monthlyBookingLimit: VENDOR_BADGE_LIMITS[badge],
      },
    };
  }

  async createCustomerPremiumRegistrationOrder() {
    const order = await this.getRazorpay().orders.create({
      amount: CUSTOMER_PREMIUM_PRICE * 100,
      currency: 'INR',
      receipt: `customer_premium_${Date.now()}`.slice(0, 40),
      notes: { paymentType: 'CUSTOMER_PREMIUM_REGISTRATION' },
    });

    return {
      success: true,
      message: 'Premium membership order created successfully',
      data: {
        membership: 'PREMIUM',
        orderId: order.id,
        keyId: process.env.RAZORPAY_KEY_ID,
        amount: CUSTOMER_PREMIUM_PRICE,
        amountInPaise: order.amount,
        currency: 'INR',
      },
    };
  }

  async verifyCustomerPremiumUpgrade(
    userId: string,
    dto: VerifyPaymentDto,
  ) {
    this.verifySignature(
      dto.orderId,
      dto.paymentId,
      dto.signature,
    );

    const user = await this.prisma.user.update({
      where: { id: userId },
      data: {
        membership: CustomerMembership.PREMIUM,
        membershipActivatedAt: new Date(),
        membershipPaymentOrderId: dto.orderId,
        membershipPaymentId: dto.paymentId,
      },
    });

    return {
      success: true,
      message: 'Congratulations! You are now a Premium Member.',
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        membership: user.membership,
      },
    };
  }

  async verifyVendorBadgePayment(
    userId: string,
    badge: VendorBadge,
    billingCycle: VendorBadgeBillingCycle,
    dto: VerifyPaymentDto,
  ) {
    if (!Object.values(VendorBadge).includes(badge)) {
      throw new BadRequestException('Invalid badge plan');
    }
    if (!Object.values(VendorBadgeBillingCycle).includes(billingCycle)) {
      throw new BadRequestException('Invalid badge billing cycle');
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

    const order = await this.getRazorpay().orders.fetch(dto.orderId);
    const expectedAmount = VENDOR_BADGE_PRICES[billingCycle][badge] * 100;
    if (
      Number(order.amount) !== expectedAmount ||
      order.notes?.paymentType !== 'VENDOR_BADGE_UPGRADE' ||
      order.notes?.vendorId !== vendor.id ||
      order.notes?.badge !== badge ||
      order.notes?.billingCycle !== billingCycle
    ) {
      throw new BadRequestException('Payment order does not match selected badge plan');
    }

    const now = new Date();
    const renewalBase =
      badge === vendor.badge && vendor.badgeExpiresAt && vendor.badgeExpiresAt > now
        ? vendor.badgeExpiresAt
        : now;

    const updatedVendor = await this.prisma.vendor.update({
      where: { id: vendor.id },
      data: {
        badge,
        badgeBillingCycle: billingCycle,
        monthlyBookingLimit: VENDOR_BADGE_LIMITS[badge],
        badgePurchasedAt: new Date(),
        badgeExpiresAt: getVendorBadgeExpiry(billingCycle, renewalBase),
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
        message: `Your ${billingCycle.toLowerCase()} ${badge} badge is active. You can receive up to ${VENDOR_BADGE_LIMITS[badge]} bookings per month.`,
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
        billingCycle: updatedVendor.badgeBillingCycle.toLowerCase(),
        badgeExpiresAt: updatedVendor.badgeExpiresAt,
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
  lastPaymentAt: new Date(),
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
        payout: true,
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
        lastPaymentAt: new Date(),
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
        payout: true,
      },
    });

    const settlement = this.getSettlement(
      totalAmount,
      updatedBooking.payout?.platformCommission,
    );

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

  // ═══════════════════════════════════════════════════════════════════════════
  // PREMIUM PLANNING ADVANCE — Create Razorpay Order
  // ═══════════════════════════════════════════════════════════════════════════

  async createPremiumAdvanceOrder(userId: string, planningRequestId: string) {
    const request = await this.prisma.premiumPlanningRequest.findUnique({
      where: { id: planningRequestId },
    });

    if (!request) throw new NotFoundException('Planning request not found');
    if (request.userId !== userId) throw new ForbiddenException('Access denied');
    if (request.status !== PremiumPlanningStatus.ACCEPTED) {
      throw new BadRequestException('You must accept the quotation before paying advance');
    }

    const details = (request.quotationDetails ?? {}) as Record<string, any>;
    const totalAmount = Number(request.quotationAmount) || 0;
    const advancePercentage = details.advancePercentage ?? 50;
    const advanceAmount = details.advanceAmount ?? Math.round((totalAmount * advancePercentage) / 100);

    const order = await this.getRazorpay().orders.create({
      amount: Math.round(advanceAmount * 100),
      currency: 'INR',
      receipt: `prem_adv_${planningRequestId}`.slice(0, 40),
      notes: {
        planningRequestId,
        paymentType: 'PREMIUM_PLANNING_ADVANCE',
      },
    });

    return {
      success: true,
      message: 'Premium advance order created',
      data: {
        planningRequestId,
        orderId: order.id,
        keyId: process.env.RAZORPAY_KEY_ID,
        amount: advanceAmount,
        advancePercentage,
        amountInPaise: order.amount,
        totalAmount,
        currency: 'INR',
      },
    };
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // PREMIUM PLANNING ADVANCE — Verify Razorpay & Create Bookings
  // ═══════════════════════════════════════════════════════════════════════════

  async verifyPremiumAdvancePayment(
    userId: string,
    planningRequestId: string,
    dto: { orderId: string; paymentId: string; signature: string },
  ) {
    // 1. Verify signature
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keySecret) throw new BadRequestException('Payment gateway not configured');

    const expectedSignature = require('crypto')
      .createHmac('sha256', keySecret)
      .update(`${dto.orderId}|${dto.paymentId}`)
      .digest('hex');

    if (expectedSignature !== dto.signature) {
      throw new BadRequestException('Payment verification failed — invalid signature');
    }

    // 2. Load the planning request
    const request = await this.prisma.premiumPlanningRequest.findUnique({
      where: { id: planningRequestId },
    });

    if (!request) throw new NotFoundException('Planning request not found');
    if (request.userId !== userId) throw new ForbiddenException('Access denied');
    if (request.status !== PremiumPlanningStatus.ACCEPTED) {
      throw new BadRequestException('Quotation must be accepted');
    }

    const details = (request.quotationDetails ?? {}) as Record<string, any>;
    const totalAmount = Number(request.quotationAmount) || 0;
    const advancePercentage = details.advancePercentage ?? 50;
    const totalAdvancePaid = details.advanceAmount ?? Math.round((totalAmount * advancePercentage) / 100);

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { name: true, email: true, phone: true },
    });

    // 3. Mark planning request as BOOKED
    const updatedRequest = await this.prisma.premiumPlanningRequest.update({
      where: { id: planningRequestId },
      data: {
        status: PremiumPlanningStatus.BOOKED,
        bookedAt: new Date(),
      },
    });

    // 4. Auto-create Booking records for all assigned vendors
    const assignedVendorIds = request.assignedVendorIds || [];
    const createdBookings: any[] = [];
    const breakdown = (details.vendorBreakdown as Array<{ vendorId?: string; vendorName: string; category: string; cost: number }>) || [];

    for (let i = 0; i < assignedVendorIds.length; i++) {
      const vendorId = assignedVendorIds[i];
      const vendor = await this.prisma.vendor.findUnique({
        where: { id: vendorId },
        include: { packages: true },
      });

      if (!vendor) continue;

      const itemCost = breakdown.find((b) => b.vendorId === vendorId)?.cost;
      const vendorTotalAmount = itemCost && itemCost > 0 ? itemCost : Math.round(totalAmount / (assignedVendorIds.length || 1));
      const vendorAdvancePaid = Math.round((vendorTotalAmount * advancePercentage) / 100);

      const packageId = vendor.packages?.[0]?.id;
      if (!packageId) continue;

      const bookingNumber = `BG-PREM-${Date.now().toString(36).toUpperCase()}-${i + 1}`;

      const createdBooking = await this.prisma.booking.create({
        data: {
          bookingNumber,
          userId,
          vendorId,
          packageId,
          eventType: request.weddingType ?? 'Wedding',
          eventDate: request.createdAt ? new Date(request.createdAt) : new Date(),
          city: request.city ?? vendor.city ?? 'Noida',
          guests: request.guestCount ?? 100,
          customerName: user?.name ?? 'Customer',
          customerEmail: user?.email ?? '',
          customerPhone: user?.phone ?? '',
          eventTitle: `${request.weddingType} (${vendor.businessName})`,
          totalAmount: vendorTotalAmount,
          amountPaid: vendorAdvancePaid,
          remainingAmount: vendorTotalAmount - vendorAdvancePaid,
          status: BookingStatus.ADVANCE_PAID,
          paymentStatus: PaymentStatus.PARTIAL,
          lastPaymentAt: new Date(),
          adminApproved: true,
        },
      });

      createdBookings.push(createdBooking);

      await this.payoutsService.ensureAdvancePayout(
        createdBooking.id,
        vendorAdvancePaid,
        dto.paymentId,
      );
      await this.payoutsService.releaseAdvancePayout(createdBooking.id);

      await this.prisma.bookingVendorAssignment.create({
        data: {
          bookingId: createdBooking.id,
          vendorId,
          role: VendorAssignmentRole.PRIMARY,
          priority: 1,
          score: 100,
          status: VendorAssignmentStatus.ACCEPTED,
          respondedAt: new Date(),
        },
      });

      await this.notificationsService.create(vendor.userId, {
        title: '🎉 New Confirmed Booking (Advance Paid)!',
        message: `Your booking for ${request.weddingType} in ${request.city} is confirmed with Advance Paid of ₹${vendorAdvancePaid.toLocaleString('en-IN')}.`,
      });
    }

    await this.notificationsService.create(userId, {
      title: '🎉 Premium Wedding Plan Booked!',
      message: `Your advance payment of ₹${totalAdvancePaid.toLocaleString('en-IN')} was received. ${createdBookings.length} vendor bookings have been confirmed.`,
    });

    return {
      success: true,
      message: 'Payment verified & bookings confirmed!',
      data: updatedRequest,
      bookings: createdBookings,
    };
  }
}
