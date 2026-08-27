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
import { RescheduleBookingDto } from './dto/reschedule-booking.dto';
import { Role, BookingStatus } from '@prisma/client';
import { PaymentStatus } from '@prisma/client';
import { VendorStatus } from '@prisma/client';
import { PayoutsService } from '../payouts/payouts.service';
import { BookingEngineService } from '../booking-engine/booking-engine.service';

@Injectable()
export class BookingsService {
  constructor(
    private prisma: PrismaService,
    private notificationsService: NotificationsService,
    private payoutsService: PayoutsService,
    private bookingEngine: BookingEngineService,
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
    const eventDates = Array.isArray(dto.eventDates) && dto.eventDates.length > 0
      ? dto.eventDates
      : [dto.eventDate];

    await this.ensureVendorAvailable(vendor.id, eventDate);

    const booking = await this.prisma.booking.create({
      data: {
        bookingNumber: dto.bookingNumber,
        userId,
        vendorId: vendor.id,
        packageId: pkg.id,
        eventType: dto.eventType,
        eventDate,
        eventDates,
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
        // Always start as PENDING — engine will move it through the workflow
        status: BookingStatus.PENDING,
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

    // ── Trigger Smart Booking Engine asynchronously ──
    // We don't await so the HTTP response returns immediately.
    // The engine runs in the background and updates the booking status.
    this.bookingEngine
      .runMatchingForBooking(booking.id)
      .catch((err) =>
        console.error(`[BookingEngine] Error for booking ${booking.id}:`, err),
      );

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
          OR: [
            { vendorId: vendor.id },
            { vendorAssignments: { some: { vendorId: vendor.id } } },
          ],
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
          vendorAssignments: {
            include: {
              vendor: true,
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
          payout: true,
        },

        orderBy: {
          createdAt: 'desc',
        },
      });
    }

    return {
      success: true,

      data: bookings.map((booking) =>
        this.mapBooking(booking, {
          viewerRole: role,
        }),
      ),
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
        payout: true,
        activities: {
          orderBy: {
            createdAt: 'asc',
          },
        },
        vendorAssignments: {
          include: {
            vendor: true,
          },
          orderBy: {
            priority: 'asc',
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

      data: this.mapBooking(booking, {
        viewerRole: role,
      }),
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

    await this.payoutsService.acknowledgeByVendor(booking.id);

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
        payout: true,
      },
    });

    const existingConversation =
      await this.prisma.conversation.findFirst({
        where: {
          customerId: booking.userId,
          vendorId: booking.vendorId,
        },
      });

    if (!existingConversation) {
      await this.prisma.conversation.create({
        data: {
          customerId: booking.userId,
          vendorId: booking.vendorId,
        },
      });
    }

    const admins = await this.prisma.user.findMany({
      where: { role: Role.ADMIN },
      select: { id: true },
    });

    await this.notificationsService.create(updatedBooking.userId, {
      title: 'Booking Accepted',
      message: `${updatedBooking.vendor.businessName} accepted your booking for ${updatedBooking.package.title}.`,
    });

    await Promise.all(
      admins.map((admin) =>
        this.notificationsService.create(admin.id, {
          title: 'Vendor Acknowledged Advance',
          message: `${updatedBooking.vendor.businessName} acknowledged the advance and accepted booking ${updatedBooking.bookingNumber}.`,
        }),
      ),
    );

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

    const allowedStatuses: BookingStatus[] = [
      BookingStatus.ADVANCE_PAID,
      BookingStatus.ACCEPTED,
      BookingStatus.PRIMARY_ACCEPTED,
      BookingStatus.STANDBY_ACCEPTED,
      BookingStatus.IN_PROGRESS,
      BookingStatus.CONFIRMED,
      BookingStatus.WAITING_PAYMENT,
    ];

    if (!allowedStatuses.includes(booking.status)) {
      throw new BadRequestException(
        'Only active/accepted bookings can be marked as completed',
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

  async reschedule(
    id: string,
    userId: string,
    dto: RescheduleBookingDto,
  ) {
    const booking = await this.prisma.booking.findUnique({
      where: { id },
      include: {
        user: true,
        vendor: true,
        package: {
          include: { category: true },
        },
        payout: true,
      },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    if (booking.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    const unavailableStatuses: BookingStatus[] = [
      BookingStatus.CANCELLED,
      BookingStatus.REJECTED,
      BookingStatus.EVENT_COMPLETED,
      BookingStatus.AWAITING_ADMIN_REVIEW,
      BookingStatus.PAYMENT_HELD,
    ];

    if (unavailableStatuses.includes(booking.status)) {
      throw new BadRequestException(
        'This booking can no longer be rescheduled',
      );
    }

    const newEventDate = new Date(dto.eventDate);
    const tomorrow = new Date();
    tomorrow.setUTCHours(0, 0, 0, 0);
    tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);

    if (newEventDate < tomorrow) {
      throw new BadRequestException(
        'Please select a future event date',
      );
    }

    const oldDateRange = this.getDateRange(booking.eventDate);
    const newDateRange = this.getDateRange(newEventDate);

    if (oldDateRange.start.getTime() === newDateRange.start.getTime()) {
      throw new BadRequestException(
        'Please select a different event date',
      );
    }

    await this.ensureVendorAvailable(
      booking.vendorId,
      newEventDate,
      booking.id,
    );

    const updatedBooking = await this.prisma.booking.update({
      where: { id },
      data: { eventDate: newEventDate },
      include: {
        user: true,
        vendor: true,
        package: {
          include: { category: true },
        },
        payout: true,
      },
    });

    const previousDate = booking.eventDate.toLocaleDateString('en-IN');
    const updatedDate = updatedBooking.eventDate.toLocaleDateString('en-IN');
    const reason = dto.reason?.trim()
      ? ` Reason: ${dto.reason.trim()}`
      : '';

    await this.notificationsService.create(updatedBooking.vendor.userId, {
      title: 'Booking Rescheduled',
      message: `${updatedBooking.customerName ?? updatedBooking.user.name} changed booking ${updatedBooking.bookingNumber} from ${previousDate} to ${updatedDate}.${reason}`,
    });

    const admins = await this.prisma.user.findMany({
      where: { role: Role.ADMIN },
      select: { id: true },
    });

    await Promise.all(
      admins.map((admin) =>
        this.notificationsService.create(admin.id, {
          title: 'Booking Rescheduled',
          message: `Booking ${updatedBooking.bookingNumber} was moved from ${previousDate} to ${updatedDate}.${reason}`,
        }),
      ),
    );

    return {
      success: true,
      message: 'Booking rescheduled successfully',
      data: this.mapBooking(updatedBooking),
    };
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
        lastPaymentAt: new Date(),
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
        payout: true,
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

  // ═══════════════════════════════════════════════════════════
  // Smart Booking Engine — Delegate Methods
  // ═══════════════════════════════════════════════════════════

  async primaryAccept(bookingId: string, userId: string) {
    const vendor = await this.prisma.vendor.findUnique({ where: { userId } });
    if (!vendor) throw new NotFoundException('Vendor profile not found');

    await this.bookingEngine.handlePrimaryAccept(bookingId, vendor.id);
    return { success: true, message: 'Booking accepted. User will be notified to make payment.' };
  }

  async primaryReject(
    bookingId: string,
    userId: string,
    reason?: string,
  ) {
    const vendor = await this.prisma.vendor.findUnique({ where: { userId } });
    if (!vendor) throw new NotFoundException('Vendor profile not found');

    await this.bookingEngine.handlePrimaryReject(bookingId, vendor.id, reason);
    return { success: true, message: 'Booking rejected. Standby vendor will be promoted.' };
  }

  async standbyRespond(
    bookingId: string,
    userId: string,
    response: 'AVAILABLE' | 'NOT_AVAILABLE',
  ) {
    const vendor = await this.prisma.vendor.findUnique({ where: { userId } });
    if (!vendor) throw new NotFoundException('Vendor profile not found');

    await this.bookingEngine.handleStandbyResponse(bookingId, vendor.id, response);
    return { success: true, message: `Response recorded: ${response}` };
  }

  async promotedAccept(bookingId: string, userId: string) {
    const vendor = await this.prisma.vendor.findUnique({ where: { userId } });
    if (!vendor) throw new NotFoundException('Vendor profile not found');

    await this.bookingEngine.handlePromotedAccept(bookingId, vendor.id);
    return { success: true, message: 'Booking accepted as promoted vendor. User notified for payment.' };
  }

  async promotedReject(
    bookingId: string,
    userId: string,
    reason?: string,
  ) {
    const vendor = await this.prisma.vendor.findUnique({ where: { userId } });
    if (!vendor) throw new NotFoundException('Vendor profile not found');

    await this.bookingEngine.handlePromotedReject(bookingId, vendor.id, reason);
    return { success: true, message: 'Booking rejected. Next standby will be promoted.' };
  }

  async getBookingAssignments(bookingId: string, userId: string, role: Role) {
    // Verify access
    const booking = await this.prisma.booking.findUnique({ where: { id: bookingId } });
    if (!booking) throw new NotFoundException('Booking not found');

    if (role === Role.VENDOR) {
      const vendor = await this.prisma.vendor.findUnique({ where: { userId } });
      if (!vendor || booking.vendorId !== vendor.id)
        throw new ForbiddenException('Access denied');
    } else if (role === Role.USER) {
      if (booking.userId !== userId) throw new ForbiddenException('Access denied');
    }

    const assignments = await this.bookingEngine.getBookingAssignments(bookingId);
    return { success: true, data: assignments };
  }

  async getAlternativeVendors(id: string) {
    return this.bookingEngine.getAlternativeVendorsForCustomer(id);
  }

  async customerSelectVendor(id: string, userId: string, vendorId: string) {
    return this.bookingEngine.customerSelectVendor(id, userId, vendorId);
  }

  // ═══════════════════════════════════════════════════════════
  // Private helpers
  // ═══════════════════════════════════════════════════════════

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
              BookingStatus.WAITING_PAYMENT,
              BookingStatus.PRIMARY_ACCEPTED,
              BookingStatus.STANDBY_ACCEPTED,
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
    badgeExpiresAt?: Date | null;
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

    const paidPlanExpired =
      vendor.badge !== 'BRONZE' &&
      (!vendor.badgeExpiresAt || vendor.badgeExpiresAt <= now);
    const effectiveLimit = paidPlanExpired
      ? 5
      : vendor.monthlyBookingLimit;

    if (currentMonthBookings >= effectiveLimit) {
      throw new BadRequestException(
        paidPlanExpired
          ? 'Your paid badge plan has expired. Renew it to receive more bookings.'
          : `${vendor.badge} badge limit reached. Upgrade your plan for further bookings.`,
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

  private mapBooking(
    booking: any,
    options?: {
      viewerRole?: Role;
    },
  ) {
    const hideCustomerContact =
      options?.viewerRole === Role.VENDOR &&
      !booking.adminApproved;

    const platformCommission = Number(
      booking.payout?.platformCommission ?? 0,
    );
    const vendorNetAmount =
      options?.viewerRole === Role.VENDOR
        ? this.payoutsService.calculateRecognizedVendorEarnings(
            booking,
          )
        : this.payoutsService.calculateVendorNetCollected(
            booking.amountPaid,
            platformCommission,
          );

    return {
      id: booking.id,
      bookingNumber: booking.bookingNumber,
      customerId: booking.userId,
      vendorId: booking.vendor.frontendVendorId ?? 0,
      customerName: booking.customerName ?? booking.user.name,
      customerEmail: hideCustomerContact
        ? ''
        : booking.customerEmail ?? booking.user.email,
      customerPhone: hideCustomerContact
        ? ''
        : booking.customerPhone ?? booking.user.phone ?? '',
      vendorName: booking.vendor.businessName,
      vendorImage: booking.vendor.logoUrl ?? '',
      category: booking.package.category?.name ?? '',
      packageName: booking.package.title,
      eventType: booking.eventType ?? '',
      eventDate: booking.eventDate,
      eventDates: booking.eventDates && booking.eventDates.length > 0 ? booking.eventDates : [new Date(booking.eventDate).toISOString().slice(0, 10)],
      eventTime: booking.eventTime ?? '',
      venue: booking.venue ?? '',
      city: booking.city ?? '',
      guests: booking.guests,
      brideName: booking.brideName ?? '',
      groomName: booking.groomName ?? '',
      eventTitle: booking.eventTitle ?? '',
      primaryPersonName: hideCustomerContact ? '' : booking.primaryPersonName ?? '',
      primaryPersonAge: hideCustomerContact ? null : booking.primaryPersonAge ?? null,
      eventTheme: booking.eventTheme ?? booking.weddingTheme ?? '',
      partnerName: hideCustomerContact ? '' : booking.partnerName ?? '',
      partnerEmail: hideCustomerContact ? '' : booking.partnerEmail ?? '',
      partnerPhone: hideCustomerContact ? '' : booking.partnerPhone ?? '',
      partnerOccupation: hideCustomerContact ? '' : booking.partnerOccupation ?? '',
      contactAddress: hideCustomerContact ? '' : booking.contactAddress ?? '',
      contactState: hideCustomerContact ? '' : booking.contactState ?? '',
      contactCountry: hideCustomerContact ? '' : booking.contactCountry ?? '',
      weddingTheme: booking.weddingTheme ?? '',
      specialRequirements: booking.specialRequirements ?? '',
      amount: Number(booking.totalAmount),
      advancePaid: Number(booking.amountPaid),
      platformCommission,
      vendorNetAmount,
      payoutStatus: booking.payout?.status?.toLowerCase() ?? null,
      payoutSimulated: booking.payout?.simulated ?? true,
      payoutReleasedAt: booking.payout?.releasedAt ?? null,
      vendorAcknowledgedAt: booking.payout?.vendorAcknowledgedAt ?? null,
      remainingAmount: Number(booking.remainingAmount),
      paymentStatus: this.mapPaymentStatus(booking.paymentStatus),
      adminApproved: booking.adminApproved,
      adminApprovedAt: booking.adminApprovedAt,
      bookingStatus: this.mapBookingStatus(booking.status),
      // Smart engine fields
      matchedAt: booking.matchedAt ?? null,
      noVendorAvailable: booking.noVendorAvailable ?? false,
      cancellationReason: booking.cancellationReason ?? null,
      vendorAssignments: (booking.vendorAssignments || []).map((a: any) => ({
        id: a.id,
        vendorId: a.vendorId,
        businessName: a.vendor?.businessName ?? '',
        ownerName: a.vendor?.user?.name ?? '',
        role: a.role,
        priority: a.priority,
        score: a.score,
        status: a.status,
        respondedAt: a.respondedAt,
        promotedAt: a.promotedAt,
        timeoutAt: a.timeoutAt,
        createdAt: a.createdAt,
      })),
      activities: (booking.activities || []).map((act: any) => ({
        id: act.id,
        action: act.action,
        title: act.title,
        description: act.description,
        actorType: act.actorType,
        actorId: act.actorId,
        metadata: act.metadata,
        createdAt: act.createdAt,
      })),
      createdAt: booking.createdAt,
      updatedAt: booking.updatedAt,
      lastPaymentAt: booking.lastPaymentAt ?? null,
    };
  }

  private mapPaymentStatus(status: PaymentStatus) {
    if (status === PaymentStatus.SUCCESS) {
      return 'paid';
    }
    return status.toLowerCase();
  }

  private mapBookingStatus(status: BookingStatus) {
    const statusMap: Partial<Record<BookingStatus, string>> = {
      [BookingStatus.CONFIRMED]: 'completed',
      [BookingStatus.ADVANCE_PAID]: 'advance_paid',
      [BookingStatus.EVENT_COMPLETED]: 'event_completed',
      [BookingStatus.AWAITING_ADMIN_REVIEW]: 'awaiting_admin_review',
      [BookingStatus.PAYMENT_APPROVED]: 'payment_approved',
      [BookingStatus.PAYMENT_HELD]: 'payment_held',
      [BookingStatus.MATCHING]: 'matching',
      [BookingStatus.WAITING_PRIMARY_VENDOR]: 'waiting_primary_vendor',
      [BookingStatus.PRIMARY_ACCEPTED]: 'primary_accepted',
      [BookingStatus.WAITING_PAYMENT]: 'waiting_payment',
      [BookingStatus.PRIMARY_REJECTED]: 'primary_rejected',
      [BookingStatus.PROMOTE_STANDBY]: 'promote_standby',
      [BookingStatus.STANDBY_ACCEPTED]: 'standby_accepted',
      [BookingStatus.IN_PROGRESS]: 'in_progress',
      [BookingStatus.COMPLETED]: 'completed',
      [BookingStatus.REVIEW_PENDING]: 'review_pending',
      [BookingStatus.CLOSED]: 'closed',
    };
    return statusMap[status] ?? status.toLowerCase();
  }
}
