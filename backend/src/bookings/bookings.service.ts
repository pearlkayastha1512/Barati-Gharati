import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { CancelBookingDto } from './dto/cancel-booking.dto';
import { UpdateBookingPaymentDto } from './dto/update-booking-payment.dto';
import { Role, BookingStatus } from '@prisma/client';
import { PaymentStatus } from '@prisma/client';
import { VendorStatus } from '@prisma/client';

@Injectable()
export class BookingsService {
  constructor(
    private prisma: PrismaService,
    private notificationsService: NotificationsService,
  ) {}

  async create(userId: string, dto: CreateBookingDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        isSuspended: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.isSuspended) {
      throw new ForbiddenException(
        'Your account has been suspended.',
      );
    }

    // Find vendor using frontend numeric ID
    const vendor = await this.prisma.vendor.findUnique({
      where: {
        frontendVendorId: dto.vendorId,
      },
    });

    if (!vendor) {
      throw new NotFoundException('Vendor not found');
    }

    if (vendor.status !== VendorStatus.APPROVED) {
      throw new ForbiddenException('Vendor is not approved by admin');
    }

    await this.ensureVendorBookingCapacity(vendor);

    // Find package by vendor + package title
    const pkg = await this.prisma.package.findFirst({
      where: {
        vendorId: vendor.id,
        title: dto.packageName,
      },
      include: {
        category: true,
      },
    });

    if (!pkg) {
      throw new NotFoundException('Package not found');
    }

    const eventDate = new Date(dto.eventDate);

    await this.ensureVendorAvailable(vendor.id, eventDate);

    const booking = await this.prisma.booking.create({
      data: {
        bookingNumber: dto.bookingNumber,

        userId,

        vendorId: vendor.id,

        packageId: pkg.id,

        eventType: dto.eventType,

        eventDate,

        eventTime: dto.eventTime,

        venue: dto.venue,

        city: dto.city,

        guests: dto.guests,

        customerName: dto.customerName,

        customerEmail: dto.customerEmail,

        customerPhone: dto.customerPhone,

        brideName: dto.brideName,

        groomName: dto.groomName,

        eventTitle: dto.eventTitle,

        primaryPersonName: dto.primaryPersonName,

        primaryPersonAge: dto.primaryPersonAge,

        eventTheme: dto.eventTheme,

        partnerName: dto.partnerName,

        partnerEmail: dto.partnerEmail,

        partnerPhone: dto.partnerPhone,

        partnerOccupation: dto.partnerOccupation,

        contactAddress: dto.contactAddress,

        contactState: dto.contactState,

        contactCountry: dto.contactCountry,

        weddingTheme: dto.weddingTheme,

        specialRequirements: dto.specialRequirements,

        totalAmount: dto.amount,

        amountPaid: dto.advancePaid,

        remainingAmount: dto.remainingAmount,

        paymentStatus: dto.paymentStatus,

        status: dto.bookingStatus,
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

    return this.mapBooking(booking);
  }

  async findMyBookings(userId: string, role: Role) {
    let bookings;

    if (role === Role.VENDOR) {
      const vendor = await this.prisma.vendor.findUnique({
        where: {
          userId,
        },
      });

      if (!vendor) {
        throw new NotFoundException('Vendor profile not found');
      }

      if (vendor.status !== VendorStatus.APPROVED) {
        throw new ForbiddenException('Vendor is not approved by admin');
      }

      bookings = await this.prisma.booking.findMany({
        where: {
          vendorId: vendor.id,
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

        orderBy: {
          createdAt: 'desc',
        },
      });
    } else {
      bookings = await this.prisma.booking.findMany({
        where: {
          userId,
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

        orderBy: {
          createdAt: 'desc',
        },
      });
    }

    return {
      success: true,

      data: bookings.map((booking) => this.mapBooking(booking)),
    };
  }

  async findOne(id: string, userId: string, role: Role) {
    const booking = await this.prisma.booking.findUnique({
      where: {
        id,
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

    if (role === Role.VENDOR) {
      const vendor = await this.prisma.vendor.findUnique({
        where: {
          userId,
        },
      });

      if (!vendor) {
        throw new ForbiddenException('Access denied');
      }

      if (vendor.status !== VendorStatus.APPROVED) {
        throw new ForbiddenException('Vendor is not approved by admin');
      }

      if (booking.vendorId !== vendor.id) {
        throw new ForbiddenException('Access denied');
      }
    } else {
      if (booking.userId !== userId) {
        throw new ForbiddenException('Access denied');
      }
    }

    return {
      success: true,

      data: this.mapBooking(booking),
    };
  }

  async accept(id: string, userId: string) {
    const booking = await this.getVendorBooking(id, userId);

    if (!booking.adminApproved) {
      throw new ForbiddenException(
        'Admin approval is required before the vendor can accept this booking',
      );
    }

    if (
      booking.status !== BookingStatus.PENDING &&
      booking.status !== BookingStatus.ADVANCE_PAID
    )
      throw new BadRequestException(
        'Only pending or advance paid bookings can be accepted',
      );

    await this.ensureVendorAvailable(
      booking.vendorId,
      booking.eventDate,
      booking.id,
    );

    const updatedBooking = await this.prisma.booking.update({
      where: { id },
      data: {
        status: BookingStatus.ACCEPTED,
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

    await this.notificationsService.create(updatedBooking.userId, {
      title: 'Booking Accepted',
      message: `${updatedBooking.vendor.businessName} accepted your booking for ${updatedBooking.package.title}.`,
    });

    return this.mapBooking(updatedBooking);
  }

  async reject(id: string, userId: string, cancellationReason: string) {
    const booking = await this.getVendorBooking(id, userId);

    if (booking.status !== BookingStatus.PENDING)
      throw new BadRequestException('Only PENDING bookings can be rejected');

    const updatedBooking = await this.prisma.booking.update({
      where: { id },
      data: {
        status: BookingStatus.REJECTED,
        cancellationReason,
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

    await this.notificationsService.create(updatedBooking.userId, {
      title: 'Booking Rejected',
      message: `${updatedBooking.vendor.businessName} rejected your booking for ${updatedBooking.package.title}.`,
    });

    return this.mapBooking(updatedBooking);
  }

  async completeEvent(id: string, userId: string) {
    const booking = await this.getVendorBooking(id, userId);

    if (
      booking.status !== BookingStatus.ACCEPTED &&
      booking.status !== BookingStatus.CONFIRMED
    ) {
      throw new BadRequestException(
        'Only accepted bookings can be marked as completed',
      );
    }

    const updatedBooking = await this.prisma.booking.update({
      where: { id },
      data: {
        status: BookingStatus.EVENT_COMPLETED,
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

    await this.notificationsService.create(updatedBooking.userId, {
      title: 'Event Completed',
      message: `${updatedBooking.vendor.businessName} marked your event as completed. Please share your review.`,
    });

    return {
      success: true,
      message: 'Event marked as completed',
      data: this.mapBooking(updatedBooking),
    };
  }

  async confirm(id: string, userId: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id },
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

    if (booking.paymentStatus !== PaymentStatus.SUCCESS) {
      throw new BadRequestException(
        'Payment must be completed before confirmation',
      );
    }

    if (booking.status !== BookingStatus.ACCEPTED) {
      throw new BadRequestException('Only ACCEPTED bookings can be confirmed');
    }

    await this.ensureVendorAvailable(
      booking.vendorId,
      booking.eventDate,
      booking.id,
    );

    const updatedBooking = await this.prisma.booking.update({
      where: { id },
      data: {
        status: BookingStatus.CONFIRMED,
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

    await this.notificationsService.create(updatedBooking.vendor.userId, {
      title: 'Booking Confirmed',
      message: `${updatedBooking.customerName ?? updatedBooking.user.name} confirmed the booking for ${updatedBooking.package.title}.`,
    });

    return this.mapBooking(updatedBooking);
  }

  async cancel(id: string, userId: string, dto: CancelBookingDto) {
    const booking = await this.prisma.booking.findUnique({
      where: { id },
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

    if (!booking) throw new NotFoundException('Booking not found');
    if (booking.userId !== userId)
      throw new ForbiddenException('Access denied');
    if (booking.status === BookingStatus.CANCELLED)
      throw new BadRequestException('Booking is already cancelled');
    if (booking.status === BookingStatus.CONFIRMED)
      throw new BadRequestException('Confirmed bookings cannot be cancelled');

    const updatedBooking = await this.prisma.booking.update({
      where: { id },
      data: {
        status: BookingStatus.CANCELLED,
        cancellationReason: dto.cancellationReason,
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

    await this.notificationsService.create(updatedBooking.vendor.userId, {
      title: 'Booking Cancelled',
      message: `${updatedBooking.customerName ?? updatedBooking.user.name} cancelled the booking for ${updatedBooking.package.title}.`,
    });

    return this.mapBooking(updatedBooking);
  }

  async updatePayment(
    id: string,
    userId: string,
    dto: UpdateBookingPaymentDto,
  ) {
    const booking = await this.prisma.booking.findUnique({
      where: {
        id,
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

    if (booking.status === BookingStatus.CANCELLED) {
      throw new BadRequestException(
        'Cancelled bookings cannot receive payments',
      );
    }

    if (booking.paymentStatus === PaymentStatus.SUCCESS) {
      throw new BadRequestException('Payment already completed');
    }

    const totalAmount = Number(booking.totalAmount);
    const currentPaid = Number(booking.amountPaid);
    const currentRemaining = Number(booking.remainingAmount);

    if (dto.amount > currentRemaining) {
      throw new BadRequestException(
        'Amount exceeds remaining balance',
      );
    }

    const amountPaid = currentPaid + dto.amount;
    const remainingAmount = totalAmount - amountPaid;

    const updatedBooking = await this.prisma.booking.update({
      where: {
        id,
      },
      data: {
        amountPaid,
        remainingAmount,
        paymentStatus:
          remainingAmount <= 0
            ? PaymentStatus.SUCCESS
            : PaymentStatus.PARTIAL,
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

    await this.notificationsService.create(updatedBooking.vendor.userId, {
      title: 'Payment Updated',
      message: `${updatedBooking.customerName ?? updatedBooking.user.name} paid ₹${dto.amount.toLocaleString('en-IN')} for ${updatedBooking.package.title}.`,
    });

    return {
      success: true,
      message: 'Payment updated successfully',
      data: this.mapBooking(updatedBooking),
    };
  }

  private async getVendorBooking(id: string, userId: string) {
    const vendor = await this.prisma.vendor.findUnique({
      where: {
        userId,
      },
    });

    if (!vendor) {
      throw new NotFoundException('Vendor profile not found');
    }

    if (vendor.status !== VendorStatus.APPROVED) {
      throw new ForbiddenException('Vendor is not approved by admin');
    }

    const booking = await this.prisma.booking.findUnique({
      where: {
        id,
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

    if (booking.vendorId !== vendor.id) {
      throw new ForbiddenException('Access denied');
    }

    return booking;
  }

  private async ensureVendorAvailable(
    vendorId: string,
    eventDate: Date,
    excludedBookingId?: string,
  ) {
    const { start, end } = this.getDateRange(eventDate);

    const [blocked, booked] = await Promise.all([
      this.prisma.vendorAvailability.findFirst({
        where: {
          vendorId,
          date: {
            gte: start,
            lt: end,
          },
        },
      }),
      this.prisma.booking.findFirst({
        where: {
          vendorId,
          id: excludedBookingId
            ? {
                not: excludedBookingId,
              }
            : undefined,
          eventDate: {
            gte: start,
            lt: end,
          },
          status: {
            in: [
              BookingStatus.ADVANCE_PAID,
              BookingStatus.ACCEPTED,
              BookingStatus.EVENT_COMPLETED,
              BookingStatus.AWAITING_ADMIN_REVIEW,
              BookingStatus.PAYMENT_APPROVED,
              BookingStatus.CONFIRMED,
            ],
          },
        },
      }),
    ]);

    if (blocked || booked) {
      throw new BadRequestException('Vendor is unavailable on this date.');
    }
  }

  private async ensureVendorBookingCapacity(vendor: {
    id: string;
    badge: string;
    monthlyBookingLimit: number;
  }) {
    const now = new Date();
    const start = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
    const end = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1));

    const currentMonthBookings =
      await this.prisma.booking.count({
        where: {
          vendorId: vendor.id,
          createdAt: {
            gte: start,
            lt: end,
          },
          status: {
            notIn: [
              BookingStatus.CANCELLED,
              BookingStatus.REJECTED,
            ],
          },
        },
      });

    if (currentMonthBookings >= vendor.monthlyBookingLimit) {
      throw new BadRequestException(
        `${vendor.badge} badge limit reached. Upgrade your plan for further bookings.`,
      );
    }
  }

  private getDateRange(date: Date) {
    const start = new Date(date);
    start.setUTCHours(0, 0, 0, 0);

    const end = new Date(start);
    end.setUTCDate(end.getUTCDate() + 1);

    return {
      start,
      end,
    };
  }

  private mapBooking(booking: any) {
    return {
      id: booking.id,

      bookingNumber: booking.bookingNumber,

      customerId: booking.userId,

      vendorId: booking.vendor.frontendVendorId ?? 0,

      customerName: booking.customerName ?? booking.user.name,

      customerEmail: booking.customerEmail ?? booking.user.email,

      customerPhone: booking.customerPhone ?? booking.user.phone ?? '',

      vendorName: booking.vendor.businessName,

      category: booking.package.category?.name ?? '',

      packageName: booking.package.title,

      eventType: booking.eventType ?? '',

      eventDate: booking.eventDate,

      eventTime: booking.eventTime ?? '',

      venue: booking.venue ?? '',

      city: booking.city ?? '',

      guests: booking.guests,

      brideName: booking.brideName ?? '',

      groomName: booking.groomName ?? '',

      eventTitle: booking.eventTitle ?? '',

      primaryPersonName: booking.primaryPersonName ?? '',

      primaryPersonAge: booking.primaryPersonAge ?? null,

      eventTheme: booking.eventTheme ?? booking.weddingTheme ?? '',

      partnerName: booking.partnerName ?? '',

      partnerEmail: booking.partnerEmail ?? '',

      partnerPhone: booking.partnerPhone ?? '',

      partnerOccupation: booking.partnerOccupation ?? '',

      contactAddress: booking.contactAddress ?? '',

      contactState: booking.contactState ?? '',

      contactCountry: booking.contactCountry ?? '',

      weddingTheme: booking.weddingTheme ?? '',

      specialRequirements: booking.specialRequirements ?? '',

      amount: Number(booking.totalAmount),

      advancePaid: Number(booking.amountPaid),

      remainingAmount: Number(booking.remainingAmount),

      paymentStatus: this.mapPaymentStatus(
        booking.paymentStatus,
      ),

      adminApproved: booking.adminApproved,

      adminApprovedAt: booking.adminApprovedAt,

      bookingStatus: this.mapBookingStatus(
        booking.status,
      ),

      createdAt: booking.createdAt,

      updatedAt: booking.updatedAt,
    };
  }

  private mapPaymentStatus(status: PaymentStatus) {
    if (status === PaymentStatus.SUCCESS) {
      return 'paid';
    }

    return status.toLowerCase();
  }

  private mapBookingStatus(status: BookingStatus) {
    if (status === BookingStatus.CONFIRMED) {
      return 'completed';
    }

    if (status === BookingStatus.ADVANCE_PAID) {
      return 'advance_paid';
    }

    if (status === BookingStatus.EVENT_COMPLETED) {
      return 'event_completed';
    }

    if (status === BookingStatus.AWAITING_ADMIN_REVIEW) {
      return 'awaiting_admin_review';
    }

    if (status === BookingStatus.PAYMENT_APPROVED) {
      return 'payment_approved';
    }

    if (status === BookingStatus.PAYMENT_HELD) {
      return 'payment_held';
    }

    return status.toLowerCase();
  }
}
