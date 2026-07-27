import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import Razorpay from 'razorpay';
import { PrismaService } from '../prisma/prisma.service';
import {
  AdminVerificationStatus,
  BookingStatus,
  Role,
  VendorBadge,
  VendorBadgeBillingCycle,
  VendorStatus,
  PaymentStatus,
  PayoutStatus,
} from '@prisma/client';
import { MailService } from '../mail/mail.service';
import { NotificationsService } from '../notifications/notifications.service';
import { PayoutsService } from '../payouts/payouts.service';
import { getVendorBadgeExpiry } from '../payment/vendor-badge.constants';
import { VENDOR_BADGE_LIMITS } from '../payment/vendor-badge.constants';
import { CreateVendorByAdminDto } from './dto/create-vendor-by-admin.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AdminService {
 constructor(
  private readonly prisma: PrismaService,
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

  private async findBadgePaymentId(vendor: {
    badgePaymentId: string | null;
    badgePaymentOrderId: string | null;
  }) {
    if (vendor.badgePaymentId) {
      return vendor.badgePaymentId;
    }

    if (!vendor.badgePaymentOrderId) {
      return null;
    }

    const payments =
      await this.getRazorpay().orders.fetchPayments(
        vendor.badgePaymentOrderId,
      );

    const payment = payments.items?.find(
      (item: { status?: string }) =>
        item.status === 'captured' ||
        item.status === 'authorized',
    );

    return payment?.id ?? null;
  }

  private async refundVendorBadgePayment(vendor: {
    id: string;
    badgePaymentId: string | null;
    badgePaymentOrderId: string | null;
    badgePaymentRefundId: string | null;
    badgePaymentRefundedAt: Date | null;
  }) {
    if (
      vendor.badgePaymentRefundId ||
      vendor.badgePaymentRefundedAt
    ) {
      return null;
    }

    const paymentId =
      await this.findBadgePaymentId(vendor);

    if (!paymentId) {
      return null;
    }

    const refund =
      await this.getRazorpay().payments.refund(
        paymentId,
        {
          notes: {
            vendorId: vendor.id,
            reason: 'VENDOR_REGISTRATION_REJECTED',
          },
        },
      );

    await this.prisma.vendor.update({
      where: {
        id: vendor.id,
      },
      data: {
        badgePaymentId: paymentId,
        badgePaymentRefundId: refund.id,
        badgePaymentRefundedAt: new Date(),
      },
    });

    return refund;
  }

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
      this.prisma.bookingPayout.aggregate({
        _sum: { platformCommission: true },
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
          revenue._sum.platformCommission ?? 0,
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
      membership: true,
      membershipActivatedAt: true,
      adminVerificationStatus: true,
      adminVerifiedAt: true,
      adminRejectionReason: true,
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

private async getCustomerForVerification(id: string) {
  const user = await this.prisma.user.findUnique({ where: { id } });
  if (!user || user.role !== Role.USER) {
    throw new NotFoundException('Customer not found');
  }
  return user;
}

async approveCustomer(id: string) {
  const user = await this.getCustomerForVerification(id);
  if (!user.isVerified) {
    throw new BadRequestException('Customer must verify their email OTP before admin approval');
  }
  const data = await this.prisma.user.update({
    where: { id },
    data: {
      adminVerificationStatus: AdminVerificationStatus.APPROVED,
      adminVerifiedAt: new Date(),
      adminRejectionReason: null,
    },
  });
  await this.notificationsService.create(id, {
    title: 'Account approved',
    message: 'Your customer account has been approved. You can now log in.',
  });
  await this.mailService.sendCustomerVerificationDecision(user.email, user.name, true);
  return { success: true, message: 'Customer approved successfully', data };
}

async rejectCustomer(id: string, reason?: string) {
  const user = await this.getCustomerForVerification(id);
  const data = await this.prisma.user.update({
    where: { id },
    data: {
      adminVerificationStatus: AdminVerificationStatus.REJECTED,
      adminVerifiedAt: null,
      adminRejectionReason: reason?.trim() || 'Registration details could not be verified.',
    },
  });
  await this.notificationsService.create(id, {
    title: 'Account verification rejected',
    message: data.adminRejectionReason ?? 'Please contact support for more information.',
  });
  await this.mailService.sendCustomerVerificationDecision(
    user.email,
    user.name,
    false,
    data.adminRejectionReason ?? undefined,
  );
  return { success: true, message: 'Customer verification rejected', data };
}

async reverifyCustomer(id: string) {
  const user = await this.getCustomerForVerification(id);
  const data = await this.prisma.user.update({
    where: { id },
    data: {
      adminVerificationStatus: AdminVerificationStatus.PENDING,
      adminVerifiedAt: null,
      adminRejectionReason: null,
    },
  });
  await this.notificationsService.create(id, {
    title: 'Account re-verification required',
    message: 'Your account is under admin review again. Login will be available after approval.',
  });
  await this.mailService.sendReverificationNotice(user.email, user.name, 'Customer');
  return { success: true, message: 'Customer moved to re-verification', data };
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

      badgeBillingCycle:
        vendor.badgeBillingCycle.toLowerCase(),

      badgeExpiresAt:
        vendor.badgeExpiresAt,

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

async createVendorByAdmin(dto: CreateVendorByAdminDto) {
  const email = dto.email.trim().toLowerCase();
  const phone = dto.phone.trim();
  const [emailExists, phoneExists] = await Promise.all([
    this.prisma.user.findUnique({ where: { email } }),
    this.prisma.user.findUnique({ where: { phone } }),
  ]);
  if (emailExists) throw new BadRequestException('Email already registered');
  if (phoneExists) throw new BadRequestException('Phone number already registered');

  let category = await this.prisma.category.findFirst({
    where: { name: { equals: dto.category.trim(), mode: 'insensitive' } },
  });
  if (!category) {
    category = await this.prisma.category.create({
      data: { name: dto.category.trim() },
    });
  }

  const lastVendor = await this.prisma.vendor.findFirst({
    where: { frontendVendorId: { not: null } },
    orderBy: { frontendVendorId: 'desc' },
    select: { frontendVendorId: true },
  });
  const badge = dto.badge ?? VendorBadge.BRONZE;
  const billingCycle =
    dto.badgeBillingCycle ?? VendorBadgeBillingCycle.MONTHLY;
  const now = new Date();

  const user = await this.prisma.user.create({
    data: {
      name: dto.ownerName.trim(),
      email,
      phone,
      password: await bcrypt.hash(dto.password, 10),
      role: Role.VENDOR,
      isVerified: true,
      adminVerificationStatus: AdminVerificationStatus.APPROVED,
      adminVerifiedAt: now,
      mustChangePassword: false,
      vendor: {
        create: {
          frontendVendorId: (lastVendor?.frontendVendorId ?? 0) + 1,
          businessName: dto.businessName.trim(),
          categoryId: category.id,
          city: dto.city.trim(),
          address: dto.address?.trim(),
          description: dto.description?.trim(),
          status: VendorStatus.APPROVED,
          approvedAt: now,
          businessVerified: true,
          isActive: true,
          badge,
          badgeBillingCycle: billingCycle,
          monthlyBookingLimit: VENDOR_BADGE_LIMITS[badge],
          badgePurchasedAt: badge === VendorBadge.BRONZE ? null : now,
          badgeExpiresAt:
            badge === VendorBadge.BRONZE
              ? null
              : getVendorBadgeExpiry(billingCycle, now),
        },
      },
    },
    include: { vendor: { include: { category: true } } },
  });

  let credentialsEmailSent = true;
  try {
    await this.mailService.sendAdminCreatedVendorCredentials(
      email,
      user.name,
      dto.password,
    );
  } catch {
    credentialsEmailSent = false;
  }

  return {
    success: true,
    message: credentialsEmailSent
      ? 'Vendor created, verified and approved successfully. Login credentials were emailed.'
      : 'Vendor created and approved, but the credentials email could not be sent.',
    data: {
      id: user.vendor?.id,
      userId: user.id,
      email: user.email,
      businessName: user.vendor?.businessName,
      badge: user.vendor?.badge.toLowerCase(),
      approvalStatus: 'approved',
      credentialsEmailSent,
    },
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

      badgeBillingCycle:
        vendor.badgeBillingCycle.toLowerCase(),

      badgeExpiresAt:
        vendor.badgeExpiresAt,

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

  if (vendor.status !== VendorStatus.APPROVED) {
    throw new BadRequestException(
      'Vendor must be approved before changing badge',
    );
  }

  const updated = await this.prisma.vendor.update({
    where: { id },
    data: {
      badge,
      badgeBillingCycle: VendorBadgeBillingCycle.MONTHLY,
      monthlyBookingLimit: limits[badge],
      badgePurchasedAt: new Date(),
      badgeExpiresAt:
        badge === VendorBadge.BRONZE
          ? null
          : getVendorBadgeExpiry(VendorBadgeBillingCycle.MONTHLY),
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
      badgeBillingCycle: updated.badgeBillingCycle.toLowerCase(),
      badgeExpiresAt: updated.badgeExpiresAt,
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

  if (!vendor.user.isVerified) {
    throw new BadRequestException('Vendor must verify their email OTP before admin approval');
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
          badge: vendor.badgePurchasedAt
            ? vendor.badge
            : VendorBadge.BRONZE,
          monthlyBookingLimit:
            vendor.badgePurchasedAt
              ? vendor.monthlyBookingLimit
              : 5,
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

async reverifyVendor(id: string) {
  const vendor = await this.prisma.vendor.findUnique({ where: { id }, include: { user: true } });
  if (!vendor) throw new NotFoundException('Vendor not found');
  const data = await this.prisma.vendor.update({
    where: { id },
    data: {
      status: VendorStatus.PENDING,
      approvedAt: null,
      businessVerified: false,
      isActive: false,
    },
  });
  await this.notificationsService.create(vendor.userId, {
    title: 'Vendor re-verification required',
    message: 'Your vendor account is under admin review again.',
  });
  await this.mailService.sendReverificationNotice(vendor.user.email, vendor.user.name, 'Vendor');
  return { success: true, message: 'Vendor moved to re-verification', data };
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

  const refund =
    await this.refundVendorBadgePayment(vendor);

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
            refund
              ? 'Unfortunately your vendor registration has been rejected. Your badge payment refund has been initiated.'
              : 'Unfortunately your vendor registration has been rejected. Please contact support for more information.',
        },
      });

      return updated;
    },
  );

  await this.mailService.sendVendorRejectedEmail(
    updatedVendor.user.email,
    updatedVendor.user.name,
    Boolean(refund),
  );

  return {
    success: true,
    message: refund
      ? 'Vendor rejected successfully. Badge payment refund initiated.'
      : 'Vendor rejected successfully.',

    data: {
      id: updatedVendor.id,

      approvalStatus: 'rejected',

      businessVerified: false,

      isActive: false,

      badgePaymentRefundId:
        refund?.id ?? vendor.badgePaymentRefundId,
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







async getSiteContent() {
  const pages = await this.prisma.siteContent.findMany({
    orderBy: { slug: 'asc' },
  });

  return { success: true, data: pages };
}

async updateSiteContent(
  slug: string,
  dto: { title: string; content: string },
) {
  const page = await this.prisma.siteContent.upsert({
    where: { slug },
    update: {
      title: dto.title.trim(),
      content: dto.content,
    },
    create: {
      slug,
      title: dto.title.trim(),
      content: dto.content,
    },
  });

  return {
    success: true,
    message: 'Site content updated successfully',
    data: page,
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
      payout: true,
      vendorAssignments: {
        include: {
          vendor: true,
        },
        orderBy: {
          createdAt: 'asc',
        },
      },
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
      payout: true,
      vendorAssignments: {
        include: {
          vendor: true,
        },
        orderBy: {
          createdAt: 'asc',
        },
      },
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

async deleteBooking(id: string) {
  const booking = await this.prisma.booking.findUnique({
    where: { id },
    select: { id: true },
  });

  if (!booking) {
    throw new NotFoundException('Booking not found');
  }

  await this.prisma.$transaction([
    this.prisma.review.deleteMany({
      where: { bookingId: id },
    }),
    this.prisma.booking.delete({
      where: { id },
    }),
  ]);

  return {
    success: true,
    message: 'Booking deleted successfully',
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
      payout: true,
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

  if (
    booking.adminApproved &&
    (booking.payout?.status === PayoutStatus.RELEASED ||
      booking.payout?.status === PayoutStatus.SETTLED)
  ) {
    return {
      success: true,
      message: 'Booking is already approved',
      data: this.mapBooking(booking),
    };
  }

  await this.payoutsService.ensureAdvancePayout(
    booking.id,
    booking.amountPaid,
  );
  const payout = await this.payoutsService.releaseAdvancePayout(
    booking.id,
  );

  const updated = await this.prisma.booking.update({
    where: { id },
    data: {
      adminApproved: true,
      adminApprovedAt: booking.adminApprovedAt ?? new Date(),
      status: booking.adminApproved
        ? booking.status
        : BookingStatus.ADVANCE_PAID,
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

  await Promise.all([
    this.notificationsService.create(booking.userId, {
      title: 'Booking Approved',
      message: `Booking ${booking.bookingNumber} was approved. ${booking.vendor.businessName} will now acknowledge the booking.`,
    }),
    this.notificationsService.create(booking.vendor.userId, {
      title: 'Advance Released - Action Required',
      message: `Booking ${booking.bookingNumber}: advance ₹${Number(payout.grossAdvance).toLocaleString('en-IN')}, platform fee ₹${Number(payout.platformCommission).toLocaleString('en-IN')}, your net ₹${Number(payout.vendorNetAmount).toLocaleString('en-IN')}. Please acknowledge and accept.`,
    }),
  ]);

  return {
    success: true,
    message: 'Advance released to vendor ledger; vendor acknowledgement is pending',
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
  const platformCommission = Number(
    booking.payout?.platformCommission ?? 0,
  );
  const vendorNetAmount =
    this.payoutsService.calculateVendorNetCollected(
      booking.amountPaid,
      platformCommission,
    );
  const platformCommissionRate =
    totalAmount > 0
      ? Math.round(
          (platformCommission / totalAmount) * 10_000,
        ) / 100
      : 0;

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
    vendorImage:
      booking.vendor?.logoUrl ?? '',
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
    platformCommission,
    vendorNetAmount,
    payoutStatus:
      booking.payout?.status?.toLowerCase() ?? null,
    payoutSimulated:
      booking.payout?.simulated ?? true,
    payoutReleasedAt:
      booking.payout?.releasedAt ?? null,
    vendorAcknowledgedAt:
      booking.payout?.vendorAcknowledgedAt ?? null,
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
            platformCommissionRate,
            platformCommission,
            vendorReceives: vendorNetAmount,
          }
        : null,
    bookingStatus: this.mapBookingStatus(
      booking.status,
    ),
    vendorAssignments: (booking.vendorAssignments || []).map((a: any) => ({
      id: a.id,
      vendorId: a.vendorId,
      businessName: a.vendor?.businessName ?? '',
      ownerName: a.vendor?.ownerName ?? '',
      role: a.role,
      priority: a.priority,
      score: a.score,
      status: a.status,
      respondedAt: a.respondedAt,
      promotedAt: a.promotedAt,
      timeoutAt: a.timeoutAt,
      createdAt: a.createdAt,
    })),
    createdAt: booking.createdAt,
    updatedAt: booking.updatedAt,
    lastPaymentAt: booking.lastPaymentAt ?? null,
  };
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

async getChatModerationUsers() {
  const users = await this.prisma.user.findMany({
    where: {
      role: {
        in: [Role.USER, Role.VENDOR],
      },
      OR: [
        {
          warningCount: {
            gt: 0,
          },
        },
        {
          chatMutedUntil: {
            not: null,
          },
        },
        {
          isChatFlagged: true,
        },
        {
          isChatBlocked: true,
        },
        {
          isSuspended: true,
        },
      ],
    },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      warningCount: true,
      chatMutedUntil: true,
      isChatFlagged: true,
      isChatBlocked: true,
      isSuspended: true,
      chatLastViolationAt: true,
      chatViolationReason: true,
      updatedAt: true,
    },
    orderBy: [
      {
        isSuspended: 'desc',
      },
      {
        isChatBlocked: 'desc',
      },
      {
        isChatFlagged: 'desc',
      },
      {
        warningCount: 'desc',
      },
      {
        updatedAt: 'desc',
      },
    ],
  });

  const now = new Date();

  return {
    success: true,
    count: users.length,
    data: users.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone ?? '',
      role:
        user.role === Role.VENDOR
          ? 'vendor'
          : 'customer',
      warningCount: user.warningCount,
      chatMutedUntil: user.chatMutedUntil,
      isChatFlagged: user.isChatFlagged,
      isChatBlocked: user.isChatBlocked,
      isSuspended: user.isSuspended,
      lastViolationTime:
        user.chatLastViolationAt,
      violationReason:
        user.chatViolationReason ?? '',
      status: this.getChatModerationStatus(
        user,
        now,
      ),
    })),
  };
}

async muteChatUser(
  id: string,
  durationMinutes = 30,
) {
  if (!durationMinutes || durationMinutes <= 0) {
    throw new BadRequestException(
      'Mute duration must be greater than zero',
    );
  }

  const mutedUntil = new Date(
    Date.now() + durationMinutes * 60 * 1000,
  );

  const user = await this.prisma.user.update({
    where: {
      id,
    },
    data: {
      chatMutedUntil: mutedUntil,
      isChatFlagged: true,
    },
    select: {
      id: true,
      name: true,
    },
  });

  await this.notificationsService.create(id, {
    title: 'Chat Temporarily Muted',
    message: `Your chat access has been muted until ${mutedUntil.toLocaleString('en-IN')}.`,
  });

  return {
    success: true,
    message: `${user.name} has been muted`,
    data: {
      id: user.id,
      chatMutedUntil: mutedUntil,
    },
  };
}

async blockChatUser(id: string) {
  const user = await this.prisma.user.update({
    where: {
      id,
    },
    data: {
      isChatBlocked: true,
      isChatFlagged: true,
      chatMutedUntil: null,
    },
    select: {
      id: true,
      name: true,
    },
  });

  await this.notificationsService.create(id, {
    title: 'Chat Access Blocked',
    message:
      'Your chat access has been permanently blocked by admin.',
  });

  return {
    success: true,
    message: `${user.name} has been permanently blocked from chat`,
    data: {
      id: user.id,
      isChatBlocked: true,
    },
  };
}

async suspendUser(id: string) {
  const user = await this.prisma.user.update({
    where: {
      id,
    },
    data: {
      isSuspended: true,
      isChatBlocked: true,
      chatMutedUntil: null,
      isChatFlagged: true,
    },
    select: {
      id: true,
      name: true,
    },
  });

  await this.notificationsService.create(id, {
    title: 'Account Suspended',
    message:
      'Your account has been suspended by admin.',
  });

  return {
    success: true,
    message: `${user.name} has been suspended`,
    data: {
      id: user.id,
      isSuspended: true,
    },
  };
}

async resetChatWarnings(id: string) {
  const user = await this.prisma.user.update({
    where: {
      id,
    },
    data: {
      warningCount: 0,
      isChatFlagged: false,
      chatMutedUntil: null,
      chatViolationReason: null,
      chatLastViolationAt: null,
    },
    select: {
      id: true,
      name: true,
    },
  });

  await this.notificationsService.create(id, {
    title: 'Chat Warnings Reset',
    message:
      'Your chat warnings have been reset by admin.',
  });

  return {
    success: true,
    message: `${user.name}'s warnings have been reset`,
    data: {
      id: user.id,
    },
  };
}

private getChatModerationStatus(
  user: {
    isSuspended: boolean;
    isChatBlocked: boolean;
    chatMutedUntil: Date | null;
    isChatFlagged: boolean;
  },
  now: Date,
) {
  if (user.isSuspended) {
    return 'suspended';
  }

  if (user.isChatBlocked) {
    return 'blocked';
  }

  if (
    user.chatMutedUntil &&
    user.chatMutedUntil > now
  ) {
    return 'muted';
  }

  if (user.isChatFlagged) {
    return 'flagged';
  }

  return 'active';
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
