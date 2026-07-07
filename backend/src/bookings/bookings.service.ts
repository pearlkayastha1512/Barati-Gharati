import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { CancelBookingDto } from './dto/cancel-booking.dto';
import { UpdateBookingPaymentDto } from './dto/update-booking-payment.dto';
import { Role, BookingStatus } from '@prisma/client';
import { PaymentStatus } from '@prisma/client';
import { VendorStatus } from '@prisma/client';

@Injectable()
export class BookingsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateBookingDto) {
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

    if (booking.status !== BookingStatus.PENDING)
      throw new BadRequestException('Only PENDING bookings can be accepted');

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

    return this.mapBooking(updatedBooking);
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
            in: [BookingStatus.ACCEPTED, BookingStatus.CONFIRMED],
          },
        },
      }),
    ]);

    if (blocked || booked) {
      throw new BadRequestException('Vendor is unavailable on this date.');
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

    return status.toLowerCase();
  }
}
