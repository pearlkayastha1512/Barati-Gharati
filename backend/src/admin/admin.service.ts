import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  BookingStatus,
  Role,
  VendorBadge,
  VendorStatus,
  PaymentStatus,
} from '@prisma/client';
import { MailService } from '../mail/mail.service';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class AdminService {
 constructor(
  private readonly prisma: PrismaService,
  private readonly mailService: MailService,
  private readonly notificationsService: NotificationsService,
) {}

  async getDashboard() {
    const [
      totalUsers,
      totalCustomers,
      totalVendors,
      totalPackages,
      totalBookings,
      totalCategories,
      pendingVendorApprovals,
      pendingBookings,
      confirmedBookings,
      cancelledBookings,
      revenue,
    ] = await this.prisma.$transaction([
      this.prisma.user.count(),
      this.prisma.user.count({
        where: { role: Role.USER },
      }),
      this.prisma.vendor.count(),
      this.prisma.package.count(),
      this.prisma.booking.count(),
      this.prisma.category.count(),
      this.prisma.vendor.count({
        where: { status: VendorStatus.PENDING },
      }),
      this.prisma.booking.count({
        where: { status: BookingStatus.PENDING },
      }),
      this.prisma.booking.count({
        where: { status: BookingStatus.CONFIRMED },
      }),
      this.prisma.booking.count({
        where: { status: BookingStatus.CANCELLED },
      }),
      this.prisma.booking.aggregate({
        _sum: { amountPaid: true },
      }),
    ]);

    return {
      success: true,
      data: {
        totalUsers,
        totalCustomers,
        totalVendors,
        totalPackages,
        totalBookings,
        totalCategories,
        totalRevenue: Number(
          revenue._sum.amountPaid ?? 0,
        ),
        pendingVendorApprovals,
        pendingBookings,
        confirmedBookings,
        cancelledBookings,
      },
    };
  }

  async getAllUsers() {
  const users = await this.prisma.user.findMany({
    orderBy: {
      createdAt: 'desc',
    },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      isVerified: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return {
    success: true,
    count: users.length,
    data: users,
  };
}

async getUserById(id: string) {
  const user = await this.prisma.user.findUnique({
    where: { id },
    include: {
      vendor: true,
      bookings: true,
    },
  });

  if (!user) {
    throw new NotFoundException(
      'User not found',
    );
  }

  return {
    success: true,
    data: user,
  };
}

async deleteUser(id: string) {
  const user = await this.prisma.user.findUnique({
    where: { id },
  });

  if (!user) {
    throw new NotFoundException(
      'User not found',
    );
  }

  await this.prisma.user.delete({
    where: { id },
  });

  return {
    success: true,
    message: 'User deleted successfully',
  };
}

async getAllVendors() {
  const { start, end } = this.getCurrentMonthRange();

  const vendors = await this.prisma.vendor.findMany({
    include: {
      user: true,
      category: true,
      gallery: true,
      _count: {
        select: {
          bookings: {
            where: {
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
          },
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return {
    success: true,
    count: vendors.length,
    data: vendors.map((vendor) => ({
      // ===========================
      // IDs
      // ===========================
      id: vendor.id,
      userId: vendor.userId,

      // ===========================
      // Account
      // ===========================
      ownerName: vendor.user.name,
      email: vendor.user.email,
      phone: vendor.user.phone ?? '',

      // Frontend still expects these
      password: '',
      confirmPassword: '',

      // ===========================
      // Business
      // ===========================
      businessName: vendor.businessName,

      category: vendor.category?.name ?? '',

      city: vendor.city ?? '',

      address: vendor.address ?? '',

      description: vendor.description ?? '',

      // ===========================
      // Images
      // ===========================
      profileImage: vendor.logoUrl ?? '',

      coverImage: vendor.coverImage ?? '',

      portfolioImages: vendor.gallery.map(
        (image) => image.imageUrl,
      ),

      // ===========================
      // Social
      // ===========================
      website: vendor.website ?? '',

      instagram: vendor.instagram ?? '',

      facebook: vendor.facebook ?? '',

      youtube: vendor.youtube ?? '',

      linkedin: vendor.linkedin ?? '',

      // ===========================
      // Business Info
      // ===========================
      experience: vendor.experience ?? '',

      gstNumber: vendor.gstNumber ?? '',

      // ===========================
      // Verification
      // ===========================
      businessVerified:
        vendor.businessVerified,

      gstVerified:
        vendor.gstVerified,

      bankVerified:
        vendor.bankVerified,

      documentsUploaded:
        vendor.documentsUploaded,

      // ===========================
      // Approval
      // ===========================
      approvalStatus:
        vendor.status.toLowerCase(),

      badge:
        vendor.badge.toLowerCase(),

      monthlyBookingLimit:
        vendor.monthlyBookingLimit,

      currentMonthBookings:
        vendor._count.bookings,

      badgePurchasedAt:
        vendor.badgePurchasedAt,

      isActive:
        vendor.isActive,

      // ===========================
      // Settings
      // Frontend requires this object
      // ===========================
      settings: {
        business: {
          acceptNewBookings: true,
          displayPricingPublicly: false,
          showAvailabilityCalendar: true,
        },

        notifications: {
          newBookingNotifications: true,
          paymentAlerts: true,
          customerMessages: true,
          marketingEmails: false,
        },

        security: {
          loginAlerts: true,
          twoFactorAuthentication: false,
        },
      },

      // ===========================
      // Dates
      // ===========================
      createdAt: vendor.createdAt,

      updatedAt: vendor.updatedAt,
    })),
  };
}


async getVendorById(id: string) {
  const { start, end } = this.getCurrentMonthRange();

  const vendor = await this.prisma.vendor.findUnique({
    where: {
      id,
    },
    include: {
      user: true,
      category: true,
      gallery: true,
      packages: true,
      _count: {
        select: {
          bookings: {
            where: {
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
          },
        },
      },
    },
  });

  if (!vendor) {
    throw new NotFoundException(
      'Vendor not found',
    );
  }

  return {
    success: true,
    data: {
      // ===========================
      // IDs
      // ===========================
      id: vendor.id,

      userId: vendor.userId,

      // ===========================
      // Account
      // ===========================
      ownerName: vendor.user.name,

      email: vendor.user.email,

      phone: vendor.user.phone ?? '',

      password: '',

      confirmPassword: '',

      // ===========================
      // Business
      // ===========================
      businessName: vendor.businessName,

      category: vendor.category?.name ?? '',

      city: vendor.city ?? '',

      address: vendor.address ?? '',

      description: vendor.description ?? '',

      // ===========================
      // Images
      // ===========================
      profileImage: vendor.logoUrl ?? '',

      coverImage: vendor.coverImage ?? '',

      portfolioImages: vendor.gallery.map(
        (image) => image.imageUrl,
      ),

      // ===========================
      // Social Links
      // ===========================
      website: vendor.website ?? '',

      instagram: vendor.instagram ?? '',

      facebook: vendor.facebook ?? '',

      youtube: vendor.youtube ?? '',

      linkedin: vendor.linkedin ?? '',

      // ===========================
      // Business Info
      // ===========================
      experience: vendor.experience ?? '',

      gstNumber: vendor.gstNumber ?? '',

      // ===========================
      // Verification
      // ===========================
      businessVerified:
        vendor.businessVerified,

      gstVerified:
        vendor.gstVerified,

      bankVerified:
        vendor.bankVerified,

      documentsUploaded:
        vendor.documentsUploaded,

      // ===========================
      // Approval
      // ===========================
      approvalStatus:
        vendor.status.toLowerCase(),

      badge:
        vendor.badge.toLowerCase(),

      monthlyBookingLimit:
        vendor.monthlyBookingLimit,

      currentMonthBookings:
        vendor._count.bookings,

      badgePurchasedAt:
        vendor.badgePurchasedAt,

      isActive:
        vendor.isActive,

      // ===========================
      // Packages
      // ===========================
      packages: vendor.packages,

      // ===========================
      // Settings
      // ===========================
      settings: {
        business: {
          acceptNewBookings: true,
          displayPricingPublicly: false,
          showAvailabilityCalendar: true,
        },

        notifications: {
          newBookingNotifications: true,
          paymentAlerts: true,
          customerMessages: true,
          marketingEmails: false,
        },

        security: {
          loginAlerts: true,
          twoFactorAuthentication: false,
        },
      },

      // ===========================
      // Dates
      // ===========================
      createdAt: vendor.createdAt,

      updatedAt: vendor.updatedAt,
    },
  };
}

async updateVendorBadge(
  id: string,
  badge: VendorBadge,
) {
  const limits: Record<VendorBadge, number> = {
    [VendorBadge.BRONZE]: 5,
    [VendorBadge.SILVER]: 15,
    [VendorBadge.GOLD]: 50,
  };

  if (!Object.values(VendorBadge).includes(badge)) {
    throw new BadRequestException('Invalid vendor badge');
  }

  const vendor = await this.prisma.vendor.findUnique({
    where: { id },
    include: {
      user: true,
    },
  });

  if (!vendor) {
    throw new NotFoundException('Vendor not found');
  }

  const updated = await this.prisma.vendor.update({
    where: { id },
    data: {
      badge,
      monthlyBookingLimit: limits[badge],
      badgePurchasedAt: new Date(),
    },
    include: {
      user: true,
      category: true,
      gallery: true,
    },
  });

  await this.notificationsService.create(vendor.userId, {
    title: 'Vendor Badge Updated',
    message: `Your vendor badge is now ${badge}. You can receive up to ${limits[badge]} bookings per month.`,
  });

  return {
    success: true,
    message: 'Vendor badge updated successfully',
    data: {
      id: updated.id,
      badge: updated.badge.toLowerCase(),
      monthlyBookingLimit: updated.monthlyBookingLimit,
      badgePurchasedAt: updated.badgePurchasedAt,
    },
  };
}
async approveVendor(id: string) {
  const vendor = await this.prisma.vendor.findUnique({
    where: {
      id,
    },
    include: {
      user: true,
    },
  });

  if (!vendor) {
    throw new NotFoundException(
      'Vendor not found',
    );
  }

  const updatedVendor = await this.prisma.$transaction(
    async (tx) => {
      const maxPublicId =
        await tx.vendor.aggregate({
          _max: {
            frontendVendorId: true,
          },
        });

      // Approve vendor
      const updated = await tx.vendor.update({
        where: {
          id,
        },
        data: {
          status: VendorStatus.APPROVED,
          approvedAt: new Date(),
          frontendVendorId:
            vendor.frontendVendorId ??
            (maxPublicId._max.frontendVendorId ??
              0) +
              1,

          businessVerified: true,

          isActive: true,
        },
        include: {
          user: true,
        },
      });

      // Ensure role is Vendor
      await tx.user.update({
        where: {
          id: vendor.userId,
        },
        data: {
          role: Role.VENDOR,
        },
      });

      // Notification
      await tx.notification.create({
        data: {
          userId: vendor.userId,
          title: 'Vendor Approved',
          message:
            'Congratulations! Your vendor account has been approved. You can now receive bookings.',
        },
      });

      return updated;
    },
  );

  // Send Email
  await this.mailService.sendVendorApprovedEmail(
    updatedVendor.user.email,
    updatedVendor.user.name,
  );

  return {
    success: true,
    message: 'Vendor approved successfully.',

    data: {
      id: updatedVendor.id,

      approvalStatus: 'approved',

      businessVerified: true,

      isActive: true,

      approvedAt: updatedVendor.approvedAt,
    },
  };
}

async rejectVendor(id: string) {
  const vendor = await this.prisma.vendor.findUnique({
    where: {
      id,
    },
    include: {
      user: true,
    },
  });

  if (!vendor) {
    throw new NotFoundException(
      'Vendor not found',
    );
  }

  const updatedVendor = await this.prisma.$transaction(
    async (tx) => {
      const updated = await tx.vendor.update({
        where: {
          id,
        },
        data: {
          status: VendorStatus.REJECTED,

          businessVerified: false,

          isActive: false,
        },
        include: {
          user: true,
        },
      });

      await tx.notification.create({
        data: {
          userId: vendor.userId,
          title: 'Vendor Registration Rejected',
          message:
            'Unfortunately your vendor registration has been rejected. Please contact support for more information.',
        },
      });

      return updated;
    },
  );

  await this.mailService.sendVendorRejectedEmail(
    updatedVendor.user.email,
    updatedVendor.user.name,
  );

  return {
    success: true,
    message: 'Vendor rejected successfully.',

    data: {
      id: updatedVendor.id,

      approvalStatus: 'rejected',

      businessVerified: false,

      isActive: false,
    },
  };
}






async deleteVendor(id: string) {
  const vendor = await this.prisma.vendor.findUnique({
    where: { id },
  });

  if (!vendor) {
    throw new NotFoundException('Vendor not found');
  }

  await this.prisma.vendor.delete({
    where: { id },
  });

  return {
    success: true,
    message: 'Vendor deleted successfully',
  };
}







async getAllBookings() {
  const bookings = await this.prisma.booking.findMany({
    include: {
      user: {
        select: {
          name: true,
          email: true,
          phone: true,
        },
      },
      vendor: {
        select: {
          businessName: true,
          frontendVendorId: true,
        },
      },
      package: {
        include: {
          category: true,
        },
      },
      review: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return {
    success: true,
    count: bookings.length,
    data: bookings.map((booking) =>
      this.mapBooking(booking),
    ),
  };
}

async getBookingById(id: string) {
  const booking = await this.prisma.booking.findUnique({
    where: { id },
    include: {
      user: true,
      vendor: true,
      package: true,
      review: true,
    },
  });

  if (!booking) {
    throw new NotFoundException('Booking not found');
  }

  return {
    success: true,
    data: this.mapBooking(booking),
  };
}

async updateBookingStatus(
  id: string,
  status: BookingStatus,
) {
  const booking = await this.prisma.booking.findUnique({
    where: { id },
  });

  if (!booking) {
    throw new NotFoundException('Booking not found');
  }

  const updated = await this.prisma.booking.update({
    where: { id },
    data: {
      status,
    },
  });

  return {
    success: true,
    message: 'Booking status updated successfully',
    data: updated,
  };
}

async approveBooking(id: string) {
  const booking = await this.prisma.booking.findUnique({
    where: { id },
    include: {
      user: true,
      vendor: true,
      package: true,
    },
  });

  if (!booking) {
    throw new NotFoundException('Booking not found');
  }

  const requiredAdvance = this.getAdvanceAmount(
    booking.totalAmount,
  );
  const advanceRate = this.getAdvanceRate(
    booking.totalAmount,
  );

  if (Number(booking.amountPaid) < requiredAdvance) {
    throw new BadRequestException(
      `The ${advanceRate}% advance must be paid before approval`,
    );
  }

  if (booking.adminApproved) {
    return {
      success: true,
      message: 'Booking is already approved',
      data: this.mapBooking(booking),
    };
  }

  const updated = await this.prisma.booking.update({
    where: { id },
    data: {
      adminApproved: true,
      adminApprovedAt: new Date(),
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

  await Promise.all([
    this.notificationsService.create(booking.userId, {
      title: 'Booking Approved',
      message: `Booking ${booking.bookingNumber} was approved. You can now message ${booking.vendor.businessName}.`,
    }),
    this.notificationsService.create(booking.vendor.userId, {
      title: 'New Approved Booking',
      message: 'You have a new approved booking.',
    }),
  ]);

  return {
    success: true,
    message: 'Booking approved and conversation unlocked',
    data: this.mapBooking(updated),
  };
}

async approveBookingPayment(id: string) {
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
      review: true,
    },
  });

  if (!booking) {
    throw new NotFoundException('Booking not found');
  }

  if (booking.status !== BookingStatus.AWAITING_ADMIN_REVIEW) {
    throw new BadRequestException(
      'Booking must be awaiting admin review before payment approval',
    );
  }

  const updated = await this.prisma.booking.update({
    where: { id },
    data: {
      status: BookingStatus.PAYMENT_APPROVED,
    },
    include: {
      user: true,
      vendor: true,
      package: {
        include: {
          category: true,
        },
      },
      review: true,
    },
  });

  await this.notificationsService.create(booking.userId, {
    title: 'Complete Remaining Payment',
    message:
      'Your booking has been approved. Please complete the remaining payment.',
  });

  return {
    success: true,
    message: 'Payment approved. Customer can now pay the remaining amount.',
    data: this.mapBooking(updated),
  };
}

async holdBookingPayment(id: string) {
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
      review: true,
    },
  });

  if (!booking) {
    throw new NotFoundException('Booking not found');
  }

  if (booking.status !== BookingStatus.AWAITING_ADMIN_REVIEW) {
    throw new BadRequestException(
      'Booking must be awaiting admin review before payment can be held',
    );
  }

  const updated = await this.prisma.booking.update({
    where: { id },
    data: {
      status: BookingStatus.PAYMENT_HELD,
    },
    include: {
      user: true,
      vendor: true,
      package: {
        include: {
          category: true,
        },
      },
      review: true,
    },
  });

  await Promise.all([
    this.notificationsService.create(booking.userId, {
      title: 'Payment On Hold',
      message: `Payment for booking ${booking.bookingNumber} is on hold while admin reviews the issue.`,
    }),
    this.notificationsService.create(booking.vendor.userId, {
      title: 'Payment On Hold',
      message: `Payment for booking ${booking.bookingNumber} is on hold while admin reviews the issue.`,
    }),
  ]);

  return {
    success: true,
    message: 'Payment held for admin review',
    data: this.mapBooking(updated),
  };
}

private mapBooking(booking: any) {
  const totalAmount = Number(booking.totalAmount);
  const platformCommission =
    Math.round(totalAmount * 10) / 100;

  return {
    id: booking.id,
    bookingNumber: booking.bookingNumber,
    customerId: booking.userId,
    vendorId:
      booking.vendor?.frontendVendorId ?? 0,
    customerName:
      booking.customerName ??
      booking.user?.name ??
      '',
    customerEmail:
      booking.customerEmail ??
      booking.user?.email ??
      '',
    customerPhone:
      booking.customerPhone ??
      booking.user?.phone ??
      '',
    partnerName: booking.partnerName ?? '',
    partnerEmail: booking.partnerEmail ?? '',
    partnerPhone: booking.partnerPhone ?? '',
    partnerOccupation:
      booking.partnerOccupation ?? '',
    vendorName:
      booking.vendor?.businessName ?? '',
    category:
      booking.package?.category?.name ?? '',
    packageName:
      booking.package?.title ?? '',
    eventType: booking.eventType ?? '',
    eventDate: booking.eventDate,
    eventTime: booking.eventTime ?? '',
    venue: booking.venue ?? '',
    city: booking.city ?? '',
    contactAddress:
      booking.contactAddress ?? '',
    contactState:
      booking.contactState ?? '',
    contactCountry:
      booking.contactCountry ?? '',
    weddingTheme:
      booking.weddingTheme ?? '',
    eventTitle: booking.eventTitle ?? '',
    primaryPersonName:
      booking.primaryPersonName ?? '',
    primaryPersonAge:
      booking.primaryPersonAge ?? null,
    eventTheme:
      booking.eventTheme ??
      booking.weddingTheme ??
      '',
    guests: booking.guests ?? 0,
    brideName: booking.brideName ?? '',
    groomName: booking.groomName ?? '',
    specialRequirements:
      booking.specialRequirements ?? '',
    amount: Number(booking.totalAmount),
    advancePaid: Number(booking.amountPaid),
    remainingAmount: Number(
      booking.remainingAmount,
    ),
    paymentStatus: this.mapPaymentStatus(
      booking.paymentStatus,
    ),
    adminApproved: booking.adminApproved,
    adminApprovedAt:
      booking.adminApprovedAt,
    review: booking.review
      ? {
          id: booking.review.id,
          rating: booking.review.rating,
          comment: booking.review.comment ?? '',
          complaint: booking.review.complaint ?? '',
          proofImages: booking.review.proofImages ?? [],
          vendorDispute:
            booking.review.vendorReply ?? '',
          createdAt: booking.review.createdAt,
        }
      : null,
    settlement:
      booking.paymentStatus === PaymentStatus.SUCCESS
        ? {
            totalAmount,
            platformCommissionRate: 10,
            platformCommission,
            vendorReceives:
              totalAmount - platformCommission,
          }
        : null,
    bookingStatus: this.mapBookingStatus(
      booking.status,
    ),
    createdAt: booking.createdAt,
    updatedAt: booking.updatedAt,
  };
}

private getAdvanceRate(totalAmount: unknown) {
  const total = Number(totalAmount);

  if (total <= 50000) {
    return 2;
  }

  if (total <= 250000) {
    return 5;
  }

  return 10;
}

private getAdvanceAmount(totalAmount: unknown) {
  const total = Number(totalAmount);
  const rate = this.getAdvanceRate(total);

  return Math.round(total * rate) / 100;
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

private getCurrentMonthRange() {
  const now = new Date();
  const start = new Date(
    Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      1,
    ),
  );
  const end = new Date(
    Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth() + 1,
      1,
    ),
  );

  return {
    start,
    end,
  };
}

async getAnalytics() {
  const bookings = await this.prisma.booking.findMany({
    where: {
      paymentStatus: PaymentStatus.SUCCESS,
    },
    select: {
      totalAmount: true,
    },
  });

  const revenue = bookings.reduce(
    (sum, booking) => sum + Number(booking.totalAmount),
    0,
  );

  const users = await this.prisma.user.count();
  const vendors = await this.prisma.vendor.count();
  const packages = await this.prisma.package.count();
  const categories = await this.prisma.category.count();

  return {
    success: true,
    data: {
      revenue,
      users,
      vendors,
      packages,
      categories,
    },
  };
}

async getEmailLogs() {
  const emails = await this.prisma.emailLog.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  });

  return {
    success: true,
    count: emails.length,
    data: emails.map((email) => ({
      id: email.id,
      to: email.to,
      subject: email.subject,
      message: email.message,
      status: email.status,
      createdAt: email.createdAt,
    })),
  };
}

async getNotifications() {
  const notifications =
    await this.prisma.notification.findMany({
      include: {
        user: {
          select: {
            name: true,
            email: true,
            role: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 100,
    });

  return {
    success: true,
    count: notifications.length,
    data: notifications.map((notification) => ({
      id: notification.id,
      userId: notification.userId,
      recipientName:
        notification.user?.name ?? '',
      recipientEmail:
        notification.user?.email ?? '',
      recipientRole:
        notification.user?.role ?? '',
      title: notification.title,
      message: notification.message,
      isRead: notification.isRead,
      createdAt: notification.createdAt,
    })),
  };
}

async getPlatformSettings() {
  const settings =
    await this.prisma.platformSettings.upsert({
      where: {
        id: 'platform',
      },
      update: {},
      create: {
        id: 'platform',
      },
    });

  return {
    success: true,
    data: settings,
  };
}

async updatePlatformSettings(dto: {
  allowVendorRegistration?: boolean;
  allowCustomerRegistration?: boolean;
  enableReviews?: boolean;
  enablePayments?: boolean;
  maintenanceMode?: boolean;
}) {
  const settings =
    await this.prisma.platformSettings.upsert({
      where: {
        id: 'platform',
      },
      update: {
        ...(typeof dto.allowVendorRegistration ===
        'boolean'
          ? {
              allowVendorRegistration:
                dto.allowVendorRegistration,
            }
          : {}),
        ...(typeof dto.allowCustomerRegistration ===
        'boolean'
          ? {
              allowCustomerRegistration:
                dto.allowCustomerRegistration,
            }
          : {}),
        ...(typeof dto.enableReviews === 'boolean'
          ? {
              enableReviews: dto.enableReviews,
            }
          : {}),
        ...(typeof dto.enablePayments === 'boolean'
          ? {
              enablePayments: dto.enablePayments,
            }
          : {}),
        ...(typeof dto.maintenanceMode === 'boolean'
          ? {
              maintenanceMode: dto.maintenanceMode,
            }
          : {}),
      },
      create: {
        id: 'platform',
        allowVendorRegistration:
          dto.allowVendorRegistration ?? true,
        allowCustomerRegistration:
          dto.allowCustomerRegistration ?? true,
        enableReviews:
          dto.enableReviews ?? true,
        enablePayments:
          dto.enablePayments ?? true,
        maintenanceMode:
          dto.maintenanceMode ?? false,
      },
    });

  return {
    success: true,
    message:
      'Platform settings updated successfully',
    data: settings,
  };
}

async searchUsers(name: string) {
  const users = await this.prisma.user.findMany({
    where: {
      name: {
        contains: name,
        mode: 'insensitive',
      },
    },
  });

  return {
    success: true,
    data: users,
  };
}

async searchVendors(name: string) {
  const vendors = await this.prisma.vendor.findMany({
    where: {
      businessName: {
        contains: name,
        mode: 'insensitive',
      },
    },
    include: {
      category: true,
    },
  });

  return {
    success: true,
    data: vendors,
  };
}
}
