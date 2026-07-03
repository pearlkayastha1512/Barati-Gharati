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

@Injectable()
export class PaymentService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly invoiceService: InvoiceService,
    private readonly mailService: MailService,
  ) {}

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

    if (booking.paymentStatus === PaymentStatus.SUCCESS) {
      throw new BadRequestException(
        'Payment already completed',
      );
    }

    // Razorpay order yahin create hoga
    // Abhi dummy response return kar rahe hain

    return {
      success: true,
      message: 'Order created successfully',
      data: {
        bookingId: booking.id,
        amount: booking.totalAmount,
        paymentStatus: booking.paymentStatus,
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

    if (booking.paymentStatus === PaymentStatus.SUCCESS) {
      throw new BadRequestException(
        'Payment already verified',
      );
    }

    const body = dto.orderId + "|" + dto.paymentId;

const expectedSignature = crypto
  .createHmac(
    "sha256",
    process.env.RAZORPAY_KEY_SECRET!,
  )
  .update(body)
  .digest("hex");

// if (expectedSignature !== dto.signature) {
//   throw new BadRequestException(
//     "Invalid payment signature",
//   );
// }

    // Razorpay Signature Verification
    // Baad me yahin hoga

    const updatedBooking =
      await this.prisma.booking.update({
  where: {
    id: booking.id,
  },
  data: {
  paymentStatus: PaymentStatus.SUCCESS,
  amountPaid: booking.totalAmount,
  remainingAmount: 0,
}
});

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
    },
  });

if (!completedBooking) {
  throw new NotFoundException(
    'Booking not found',
  );
}

// Generate Invoice PDF
const invoicePath =
  await this.invoiceService.generateInvoice(
    completedBooking,
  );

// Send Email with Invoice
await this.mailService.sendBookingInvoice(
  completedBooking.user.email,
  completedBooking.user.name,
  invoicePath,
);

return {
  success: true,
  message:
    'Payment verified and invoice sent successfully.',
  data: completedBooking,
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
          paymentStatus: PaymentStatus.SUCCESS,
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