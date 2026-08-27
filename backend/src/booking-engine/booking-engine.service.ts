import {
  Injectable,
  Logger,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import {
  BookingStatus,
  VendorAssignmentRole,
  VendorAssignmentStatus,
  VendorStatus,
  Role,
} from '@prisma/client';

import { MailService } from '../mail/mail.service';

// ─── Lead allocations per badge plan ─────────────────────────────────────────
const LEAD_ALLOCATIONS: Record<string, number> = {
  BRONZE: 10,
  SILVER: 25,
  GOLD: 50,
};

// ─── Subscription plan score (out of 100) ────────────────────────────────────
const PLAN_SCORE: Record<string, number> = {
  BRONZE: 30,
  SILVER: 60,
  GOLD: 100,
};

// ─── Timeout window in hours ──────────────────────────────────────────────────
const VENDOR_TIMEOUT_HOURS = 2;

@Injectable()
export class BookingEngineService {
  private readonly logger = new Logger(BookingEngineService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly notifications: NotificationsService,
    private readonly mailService: MailService,
  ) {}

  async logActivity(
    bookingId: string,
    action: string,
    title: string,
    description: string,
    actorType?: string,
    actorId?: string,
    metadata?: any,
  ) {
    try {
      await this.prisma.bookingActivity.create({
        data: {
          bookingId,
          action,
          title,
          description,
          actorType: actorType ?? 'SYSTEM',
          actorId,
          metadata: metadata ? JSON.parse(JSON.stringify(metadata)) : undefined,
        },
      });
    } catch (err) {
      this.logger.error(`Failed to log booking activity for ${bookingId}: ${err}`);
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // MAIN ENTRY: Run matching after booking is created
  // ═══════════════════════════════════════════════════════════════════════════

  async runMatchingForBooking(bookingId: string): Promise<void> {
    this.logger.log(`[Engine] Starting matching for booking ${bookingId}`);

    // Step 1: Set status → MATCHING
    const booking = await this.prisma.booking.update({
      where: { id: bookingId },
      data: { status: BookingStatus.MATCHING },
      include: {
        vendor: { include: { user: true } },
        package: { include: { category: true } },
        user: true,
      },
    });

    const primaryVendor = booking.vendor;

    // Log initial creation activity
    await this.logActivity(
      bookingId,
      'REQUEST_CREATED',
      'Booking Request Created',
      `Customer ${booking.customerName || booking.user?.name || 'User'} created booking request for primary vendor ${primaryVendor.businessName}.`,
      'CUSTOMER',
      booking.userId,
    );

    const datesList = booking.eventDates && booking.eventDates.length > 0
      ? booking.eventDates.map((d: string) => new Date(d))
      : [booking.eventDate];

    // Step 2: Validate primary vendor eligibility across ALL requested dates
    const primaryEligibility = await this.checkVendorEligibility(
      primaryVendor.id,
      datesList,
    );

    if (!primaryEligibility.eligible) {
      this.logger.warn(
        `[Engine] Primary vendor ${primaryVendor.id} ineligible: ${primaryEligibility.reason}`,
      );
    }

    // Step 3: Find standby candidates (same category, different vendor, eligible on ALL dates)
    const standbyCandidates = await this.findStandbyCandidates(
      primaryVendor.id,
      booking.package.categoryId,
      datesList,
      booking.city ?? null,
      booking.eventLatitude ? Number(booking.eventLatitude) : null,
      booking.eventLongitude ? Number(booking.eventLongitude) : null,
    );

    // Broadcast request to ALL matching vendors in category/package!
    const broadcastStandbys = standbyCandidates;

    // Step 5: Calculate timeout deadline
    const timeoutAt = new Date();
    timeoutAt.setHours(timeoutAt.getHours() + VENDOR_TIMEOUT_HOURS);

    // Step 6: Create assignment rows (primary + standbys)
    const assignments: Array<{
      bookingId: string;
      vendorId: string;
      role: VendorAssignmentRole;
      priority: number;
      score: number;
      timeoutAt: Date;
    }> = [];

    // Primary assignment
    const primaryScore = primaryEligibility.eligible
      ? await this.calculatePriorityScore(
          primaryVendor,
          booking.eventDate,
          booking.city ?? null,
          booking.eventLatitude ? Number(booking.eventLatitude) : null,
          booking.eventLongitude ? Number(booking.eventLongitude) : null,
        )
      : 0;

    assignments.push({
      bookingId,
      vendorId: primaryVendor.id,
      role: VendorAssignmentRole.PRIMARY,
      priority: 1,
      score: primaryScore,
      timeoutAt,
    });

    // Standby assignments for ALL matching vendors (excluding primary vendor)
    for (let i = 0; i < broadcastStandbys.length; i++) {
      if (broadcastStandbys[i].vendor.id === primaryVendor.id) continue;
      assignments.push({
        bookingId,
        vendorId: broadcastStandbys[i].vendor.id,
        role: VendorAssignmentRole.STANDBY,
        priority: i + 2,
        score: broadcastStandbys[i].score,
        timeoutAt,
      });
    }

    await this.prisma.bookingVendorAssignment.createMany({
      data: assignments,
      skipDuplicates: true,
    });

    // Step 7: Update booking → WAITING_PRIMARY_VENDOR
    await this.prisma.booking.update({
      where: { id: bookingId },
      data: {
        status: BookingStatus.WAITING_PRIMARY_VENDOR,
        matchedAt: new Date(),
        noVendorAvailable:
          !primaryEligibility.eligible && broadcastStandbys.length === 0,
      },
    });

    // Log Broadcast Activity
    await this.logActivity(
      bookingId,
      'BROADCAST_DISPATCHED',
      'Request Broadcasted to Matching Vendors',
      `Booking request sent to primary vendor ${primaryVendor.businessName} and broadcasted to ${broadcastStandbys.length} matching alternative vendor(s) in category "${booking.package?.category?.name || 'Category'}".`,
      'SYSTEM',
    );

    // Step 8: Notify vendors (Primary + Standby vendors)
    await this.notifyVendorsOnMatch(booking, primaryVendor, broadcastStandbys);

    // Step 9: If no eligible vendors at all, alert admins
    if (!primaryEligibility.eligible && broadcastStandbys.length === 0) {
      await this.notifyAdminsNoVendorAvailable(booking);
    }

    this.logger.log(
      `[Engine] Matching complete for ${bookingId}: 1 primary + ${broadcastStandbys.length} broadcasted standby(s)`,
    );
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // PRIMARY VENDOR: Accept
  // ═══════════════════════════════════════════════════════════════════════════

  async handlePrimaryAccept(bookingId: string, vendorId: string): Promise<void> {
    const assignment = await this.getVendorAssignment(
      bookingId,
      vendorId,
      VendorAssignmentRole.PRIMARY,
    );

    if (assignment.status !== VendorAssignmentStatus.PENDING) {
      throw new BadRequestException(
        'This booking request is no longer actionable.',
      );
    }

    // Deduct lead
    await this.deductLead(vendorId, bookingId, assignment.id, 'PRIMARY_ACCEPTED');

    // Update assignment
    await this.prisma.bookingVendorAssignment.update({
      where: { id: assignment.id },
      data: {
        status: VendorAssignmentStatus.ACCEPTED,
        respondedAt: new Date(),
      },
    });

    // Close all standby assignments
    await this.closeStandbyAssignments(bookingId);

    // Update booking status
    await this.prisma.booking.update({
      where: { id: bookingId },
      data: { status: BookingStatus.WAITING_PAYMENT },
    });

    // Notify user to make payment
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: { vendor: true, user: true },
    });

    if (booking) {
      await this.notifications.create(booking.userId, {
        title: '🎉 Vendor Accepted Your Booking!',
        message: `${booking.vendor.businessName} accepted your booking. Please complete the advance payment to confirm.`,
      });

      // Create conversation between user and vendor
      const existing = await this.prisma.conversation.findFirst({
        where: { customerId: booking.userId, vendorId: booking.vendorId },
      });
      if (!existing) {
        await this.prisma.conversation.create({
          data: { customerId: booking.userId, vendorId: booking.vendorId },
        });
      }
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // PRIMARY VENDOR: Reject
  // ═══════════════════════════════════════════════════════════════════════════

  async handlePrimaryReject(
    bookingId: string,
    vendorId: string,
    reason?: string,
  ): Promise<void> {
    const assignment = await this.getVendorAssignment(
      bookingId,
      vendorId,
      VendorAssignmentRole.PRIMARY,
    );

    if (assignment.status !== VendorAssignmentStatus.PENDING) {
      throw new BadRequestException(
        'This booking request is no longer actionable.',
      );
    }

    const cleanReason = reason?.trim();
    if (!cleanReason) {
      throw new BadRequestException('Rejection reason is mandatory.');
    }

    // Deduct lead for rejection
    await this.deductLead(vendorId, bookingId, assignment.id, 'PRIMARY_REJECTED');

    // Update assignment
    await this.prisma.bookingVendorAssignment.update({
      where: { id: assignment.id },
      data: {
        status: VendorAssignmentStatus.REJECTED,
        respondedAt: new Date(),
      },
    });

    // Update booking → PRIMARY_REJECTED
    await this.prisma.booking.update({
      where: { id: bookingId },
      data: {
        status: BookingStatus.PRIMARY_REJECTED,
        cancellationReason: cleanReason,
      },
    });

    // Log Activity for Admin Review
    const primaryVendor = await this.prisma.vendor.findUnique({ where: { id: vendorId } });
    await this.logActivity(
      bookingId,
      'PRIMARY_REJECTED',
      'Primary Vendor Rejected Request',
      `Primary vendor "${primaryVendor?.businessName || 'Vendor'}" rejected booking. Reason: "${cleanReason}".`,
      'VENDOR',
      vendorId,
      { reason: cleanReason },
    );

    // Notify user
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: { vendor: true, user: true },
    });
    if (booking) {
      await this.notifications.create(booking.userId, {
        title: 'Vendor Unavailable',
        message: `${booking.vendor.businessName} is unavailable. We are finding you an alternative vendor.`,
      });

      // Notify admins
      const admins = await this.prisma.user.findMany({
        where: { role: Role.ADMIN },
        select: { id: true },
      });
      for (const admin of admins) {
        await this.notifications.create(admin.id, {
          title: '🚨 Vendor Rejected Booking Request',
          message: `${booking.vendor.businessName} rejected Booking ${booking.bookingNumber}. Standby vendor will be promoted.`,
          type: 'booking',
          link: `/admin/bookings?bookingId=${booking.id}`,
        });
      }
    }

    // Try to promote standby
    await this.promoteStandby(bookingId);
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // STANDBY VENDOR: Respond (Available / Not Available)
  // ═══════════════════════════════════════════════════════════════════════════

  async handleStandbyResponse(
    bookingId: string,
    vendorId: string,
    response: 'AVAILABLE' | 'NOT_AVAILABLE',
  ): Promise<void> {
    let assignment = await this.prisma.bookingVendorAssignment.findUnique({
      where: { bookingId_vendorId: { bookingId, vendorId } },
    });

    if (!assignment) {
      const booking = await this.prisma.booking.findUnique({ where: { id: bookingId } });
      if (!booking) throw new NotFoundException('Booking not found');

      assignment = await this.prisma.bookingVendorAssignment.create({
        data: {
          bookingId,
          vendorId,
          role: VendorAssignmentRole.STANDBY,
          priority: 2,
          status: VendorAssignmentStatus.PENDING,
        },
      });
    }

    if (
      assignment.status === VendorAssignmentStatus.AVAILABLE ||
      assignment.status === VendorAssignmentStatus.NOT_AVAILABLE
    ) {
      throw new BadRequestException(
        'Availability status has already been submitted and cannot be changed.',
      );
    }

    const booking = await this.prisma.booking.findUnique({ where: { id: bookingId } });
    if (!booking) throw new NotFoundException('Booking not found');

    if (response === 'AVAILABLE') {
      const datesList = booking.eventDates && booking.eventDates.length > 0
        ? booking.eventDates.map((d: string) => new Date(d))
        : [booking.eventDate];

      const eligibility = await this.checkVendorEligibility(vendorId, datesList);
      if (!eligibility.eligible) {
        throw new BadRequestException(
          `Cannot mark available: ${eligibility.reason || 'You are blocked or booked on one of the requested event dates.'}`,
        );
      }
    }

    const newStatus =
      response === 'AVAILABLE'
        ? VendorAssignmentStatus.AVAILABLE
        : VendorAssignmentStatus.NOT_AVAILABLE;

    await this.prisma.bookingVendorAssignment.update({
      where: { id: assignment.id },
      data: { status: newStatus, respondedAt: new Date() },
    });

    const vendor = await this.prisma.vendor.findUnique({ where: { id: vendorId }, include: { user: true } });
    if (vendor && booking) {
      // Log Standby Vendor Availability Response Activity
      await this.logActivity(
        bookingId,
        'STANDBY_AVAILABILITY_UPDATED',
        `Standby Vendor Availability: ${response}`,
        `Standby vendor "${vendor.businessName}" indicated availability status: ${response} for Booking ${booking.bookingNumber}.`,
        'VENDOR',
        vendorId,
      );

      const admins = await this.prisma.user.findMany({
        where: { role: Role.ADMIN },
        select: { id: true },
      });
      for (const admin of admins) {
        await this.notifications.create(admin.id, {
          title: '📋 Standby Vendor Indicated Availability',
          message: `Standby ${vendor.businessName} responded: ${response} for Booking ${booking.bookingNumber}.`,
          type: 'booking',
          link: `/admin/bookings?bookingId=${bookingId}`,
        });
      }
    }

    this.logger.log(
      `[Engine] Standby vendor ${vendorId} responded: ${response} for booking ${bookingId}`,
    );
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // PROMOTED VENDOR: Accept (was standby, now promoted to primary)
  // ═══════════════════════════════════════════════════════════════════════════

  async handlePromotedAccept(
    bookingId: string,
    vendorId: string,
  ): Promise<void> {
    const assignment = await this.getAnyAssignment(bookingId, vendorId);

    if (assignment.status !== VendorAssignmentStatus.PROMOTED) {
      throw new BadRequestException(
        'Only promoted vendors can accept at this stage.',
      );
    }

    // Deduct lead for promoted accept
    await this.deductLead(vendorId, bookingId, assignment.id, 'PROMOTED_ACCEPTED');

    // Demote existing primary vendor assignment to standby
    await this.prisma.bookingVendorAssignment.updateMany({
      where: {
        bookingId,
        role: VendorAssignmentRole.PRIMARY,
      },
      data: {
        role: VendorAssignmentRole.STANDBY,
      },
    });

    // Update accepted vendor to PRIMARY role and ACCEPTED status
    await this.prisma.bookingVendorAssignment.update({
      where: { id: assignment.id },
      data: {
        role: VendorAssignmentRole.PRIMARY,
        status: VendorAssignmentStatus.ACCEPTED,
        respondedAt: new Date(),
      },
    });

    // Close remaining standbys
    await this.closeStandbyAssignments(bookingId);

    // Update booking vendorId to the promoted vendor and status
    await this.prisma.booking.update({
      where: { id: bookingId },
      data: {
        vendorId,
        status: BookingStatus.WAITING_PAYMENT,
      },
    });

    // Notify user
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: { user: true },
    });
    const promotedVendor = await this.prisma.vendor.findUnique({
      where: { id: vendorId },
    });
    if (booking && promotedVendor) {
      await this.notifications.create(booking.userId, {
        title: '🎉 New Vendor Confirmed!',
        message: `${promotedVendor.businessName} is now handling your booking. Please complete the advance payment to confirm.`,
      });

      // Notify admins
      const admins = await this.prisma.user.findMany({
        where: { role: Role.ADMIN },
        select: { id: true },
      });
      for (const admin of admins) {
        await this.notifications.create(admin.id, {
          title: '✅ Promoted Vendor Accepted Booking',
          message: `${promotedVendor.businessName} accepted Booking ${booking.bookingNumber}.`,
          type: 'booking',
          link: `/admin/bookings?bookingId=${bookingId}`,
        });
      }
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // PROMOTED VENDOR: Reject
  // ═══════════════════════════════════════════════════════════════════════════

  async handlePromotedReject(
    bookingId: string,
    vendorId: string,
    reason?: string,
  ): Promise<void> {
    const assignment = await this.getAnyAssignment(bookingId, vendorId);

    if (assignment.status !== VendorAssignmentStatus.PROMOTED) {
      throw new BadRequestException(
        'Only promoted vendors can reject at this stage.',
      );
    }

    const cleanReason = reason?.trim();
    if (!cleanReason) {
      throw new BadRequestException('Rejection reason is mandatory.');
    }

    // Deduct lead for promoted reject
    await this.deductLead(vendorId, bookingId, assignment.id, 'PROMOTED_REJECTED');

    await this.prisma.bookingVendorAssignment.update({
      where: { id: assignment.id },
      data: {
        status: VendorAssignmentStatus.REJECTED,
        respondedAt: new Date(),
      },
    });

    await this.prisma.booking.update({
      where: { id: bookingId },
      data: {
        status: BookingStatus.PRIMARY_REJECTED,
        cancellationReason: cleanReason,
      },
    });

    // Log Activity for Admin Review
    const promotedVendor = await this.prisma.vendor.findUnique({ where: { id: vendorId } });
    await this.logActivity(
      bookingId,
      'PROMOTED_REJECTED',
      'Promoted Vendor Rejected Request',
      `Promoted vendor "${promotedVendor?.businessName || 'Vendor'}" rejected booking. Reason: "${cleanReason}".`,
      'VENDOR',
      vendorId,
      { reason: cleanReason },
    );

    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: { vendor: true },
    });
    if (booking) {
      const admins = await this.prisma.user.findMany({
        where: { role: Role.ADMIN },
        select: { id: true },
      });
      for (const admin of admins) {
        await this.notifications.create(admin.id, {
          title: '🚨 Promoted Vendor Rejected Request',
          message: `Promoted ${booking.vendor.businessName} rejected Booking ${booking.bookingNumber}. Next standby will be promoted.`,
          type: 'booking',
          link: `/admin/bookings?bookingId=${bookingId}`,
        });
      }
    }

    // Try next standby
    await this.promoteStandby(bookingId);
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // PROMOTE STANDBY
  // ═══════════════════════════════════════════════════════════════════════════

  async promoteStandby(bookingId: string): Promise<void> {
    // Find first AVAILABLE standby, then fallback to PENDING standbys
    let nextStandby = await this.prisma.bookingVendorAssignment.findFirst({
      where: {
        bookingId,
        role: VendorAssignmentRole.STANDBY,
        status: VendorAssignmentStatus.AVAILABLE,
      },
      orderBy: { priority: 'asc' },
      include: { vendor: { include: { user: true } } },
    });

    if (!nextStandby) {
      nextStandby = await this.prisma.bookingVendorAssignment.findFirst({
        where: {
          bookingId,
          role: VendorAssignmentRole.STANDBY,
          status: VendorAssignmentStatus.PENDING,
        },
        orderBy: { priority: 'asc' },
        include: { vendor: { include: { user: true } } },
      });
    }

    if (!nextStandby) {
      // Dynamic fallback: search candidates if no standby was pre-created
      const booking = await this.prisma.booking.findUnique({
        where: { id: bookingId },
        include: { package: { include: { category: true } } },
      });

      if (booking) {
        const candidates = await this.findStandbyCandidates(
          booking.vendorId,
          booking.package?.categoryId ?? null,
          booking.eventDate,
          booking.city ?? null,
          booking.eventLatitude ? Number(booking.eventLatitude) : null,
          booking.eventLongitude ? Number(booking.eventLongitude) : null,
        );

        if (candidates.length > 0) {
          const topCandidate = candidates[0];
          const newAssignment = await this.prisma.bookingVendorAssignment.create({
            data: {
              bookingId,
              vendorId: topCandidate.vendor.id,
              role: VendorAssignmentRole.STANDBY,
              priority: 2,
              score: topCandidate.score,
              status: VendorAssignmentStatus.PENDING,
            },
            include: { vendor: { include: { user: true } } },
          });
          nextStandby = newAssignment;
        }
      }
    }

    if (!nextStandby) {
      // No standby available — notify admins
      await this.prisma.booking.update({
        where: { id: bookingId },
        data: { noVendorAvailable: true },
      });
      const booking = await this.prisma.booking.findUnique({
        where: { id: bookingId },
        include: { user: true },
      });
      if (booking) await this.notifyAdminsNoVendorAvailable(booking);
      return;
    }


    // Promote: change role to PRIMARY, status to PROMOTED
    const timeoutAt = new Date();
    timeoutAt.setHours(timeoutAt.getHours() + VENDOR_TIMEOUT_HOURS);

    await this.prisma.bookingVendorAssignment.update({
      where: { id: nextStandby.id },
      data: {
        role: VendorAssignmentRole.STANDBY,
        status: VendorAssignmentStatus.PROMOTED,
        promotedAt: new Date(),
        timeoutAt,
      },
    });

    // Update booking vendorId to the promoted vendor and status
    await this.prisma.booking.update({
      where: { id: bookingId },
      data: {
        vendorId: nextStandby.vendorId,
        status: BookingStatus.PROMOTE_STANDBY,
      },
    });


    // Notify the promoted vendor
    await this.notifications.create(nextStandby.vendor.userId, {
      title: "🌟 You've Been Selected!",
      message: `You have been promoted to primary vendor for a booking. Please accept or reject within ${VENDOR_TIMEOUT_HOURS} hours.`,
    });

    // Notify admins
    const admins = await this.prisma.user.findMany({
      where: { role: Role.ADMIN },
      select: { id: true },
    });
    for (const admin of admins) {
      await this.notifications.create(admin.id, {
        title: '📢 Standby Vendor Promoted',
        message: `${nextStandby.vendor.businessName} was promoted to primary for Booking ${bookingId}.`,
        type: 'booking',
        link: `/admin/bookings?bookingId=${bookingId}`,
      });
    }

    this.logger.log(
      `[Engine] Promoted standby ${nextStandby.vendorId} to primary for booking ${bookingId}`,
    );
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // TIMEOUT HANDLER (called by scheduler)
  // ═══════════════════════════════════════════════════════════════════════════

  async handleTimedOutAssignments(): Promise<void> {
    const now = new Date();

    // Primary vendor timeouts
    const primaryTimedOut = await this.prisma.bookingVendorAssignment.findMany({
      where: {
        status: VendorAssignmentStatus.PENDING,
        role: VendorAssignmentRole.PRIMARY,
        timeoutAt: { lte: now },
      },
      include: { booking: true },
    });

    for (const assignment of primaryTimedOut) {
      this.logger.log(
        `[Scheduler] Timing out primary vendor ${assignment.vendorId} for booking ${assignment.bookingId}`,
      );
      try {
        await this.prisma.bookingVendorAssignment.update({
          where: { id: assignment.id },
          data: { status: VendorAssignmentStatus.TIMED_OUT, respondedAt: now },
        });
        await this.deductLead(
          assignment.vendorId,
          assignment.bookingId,
          assignment.id,
          'PRIMARY_TIMED_OUT',
        );
        await this.prisma.booking.update({
          where: { id: assignment.bookingId },
          data: { status: BookingStatus.PRIMARY_REJECTED },
        });
        await this.promoteStandby(assignment.bookingId);
      } catch (err) {
        this.logger.error(
          `[Scheduler] Error handling primary timeout for ${assignment.id}: ${err}`,
        );
      }
    }

    // Promoted vendor timeouts
    const promotedTimedOut = await this.prisma.bookingVendorAssignment.findMany({
      where: {
        status: VendorAssignmentStatus.PROMOTED,
        timeoutAt: { lte: now },
      },
    });

    for (const assignment of promotedTimedOut) {
      this.logger.log(
        `[Scheduler] Timing out promoted vendor ${assignment.vendorId} for booking ${assignment.bookingId}`,
      );
      try {
        await this.prisma.bookingVendorAssignment.update({
          where: { id: assignment.id },
          data: { status: VendorAssignmentStatus.TIMED_OUT, respondedAt: now },
        });
        await this.deductLead(
          assignment.vendorId,
          assignment.bookingId,
          assignment.id,
          'PROMOTED_REJECTED',
        );
        await this.promoteStandby(assignment.bookingId);
      } catch (err) {
        this.logger.error(
          `[Scheduler] Error handling promoted timeout for ${assignment.id}: ${err}`,
        );
      }
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // ADMIN: Manual assignment override
  // ═══════════════════════════════════════════════════════════════════════════

  async adminManualAssign(bookingId: string, vendorId: string): Promise<void> {
    const vendor = await this.prisma.vendor.findUnique({
      where: { id: vendorId },
    });
    if (!vendor) throw new NotFoundException('Vendor not found');
    if (vendor.status !== VendorStatus.APPROVED)
      throw new BadRequestException('Vendor is not approved');

    // Close existing pending assignments
    await this.prisma.bookingVendorAssignment.updateMany({
      where: {
        bookingId,
        status: {
          in: [VendorAssignmentStatus.PENDING, VendorAssignmentStatus.PROMOTED],
        },
      },
      data: { status: VendorAssignmentStatus.CLOSED },
    });

    const timeoutAt = new Date();
    timeoutAt.setHours(timeoutAt.getHours() + VENDOR_TIMEOUT_HOURS);

    // Upsert assignment
    await this.prisma.bookingVendorAssignment.upsert({
      where: { bookingId_vendorId: { bookingId, vendorId } },
      create: {
        bookingId,
        vendorId,
        role: VendorAssignmentRole.PRIMARY,
        priority: 1,
        status: VendorAssignmentStatus.PENDING,
        timeoutAt,
      },
      update: {
        role: VendorAssignmentRole.PRIMARY,
        status: VendorAssignmentStatus.PENDING,
        timeoutAt,
      },
    });

    // Update booking vendor and status
    await this.prisma.booking.update({
      where: { id: bookingId },
      data: {
        vendorId,
        status: BookingStatus.WAITING_PRIMARY_VENDOR,
        noVendorAvailable: false,
      },
    });

    await this.notifications.create(vendor.userId, {
      title: '📋 New Booking Assignment',
      message:
        'Admin has manually assigned a booking to you. Please accept or reject within 2 hours.',
    });
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // LEAD BALANCE: Initialize for a vendor
  // ═══════════════════════════════════════════════════════════════════════════

  async initializeLeadBalance(vendorId: string, badge: string): Promise<void> {
    const planType = badge.toUpperCase();
    const totalLeads = LEAD_ALLOCATIONS[planType] ?? LEAD_ALLOCATIONS.BRONZE;
    const cycleEnd = new Date();
    cycleEnd.setMonth(cycleEnd.getMonth() + 1);

    await this.prisma.vendorLeadBalance.upsert({
      where: { vendorId },
      create: {
        vendorId,
        totalLeads,
        usedLeads: 0,
        remainingLeads: totalLeads,
        planType,
        cycleStartAt: new Date(),
        cycleEndAt: cycleEnd,
      },
      update: {
        totalLeads,
        planType,
      },
    });
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // PRIVATE HELPERS
  // ═══════════════════════════════════════════════════════════════════════════

  private async checkVendorEligibility(
    vendorId: string,
    eventDates: Date[] | Date,
  ): Promise<{ eligible: boolean; reason?: string }> {
    const vendor = await this.prisma.vendor.findUnique({
      where: { id: vendorId },
      include: { leadBalance: true },
    });

    if (!vendor) return { eligible: false, reason: 'Vendor not found' };
    if (!vendor.isActive) return { eligible: false, reason: 'Vendor is inactive' };
    if (vendor.status !== VendorStatus.APPROVED)
      return { eligible: false, reason: 'Vendor not approved' };
    if (!vendor.leadBalance || vendor.leadBalance.remainingLeads <= 0)
      return { eligible: false, reason: 'No lead balance remaining' };

    const datesList = Array.isArray(eventDates)
      ? eventDates
      : [eventDates];

    for (const singleDate of datesList) {
      const { start, end } = this.getDateRange(new Date(singleDate));

      const blocked = await this.prisma.vendorAvailability.findFirst({
        where: { vendorId, date: { gte: start, lt: end } },
      });
      if (blocked) {
        return {
          eligible: false,
          reason: `Vendor blocked date ${new Date(singleDate).toLocaleDateString()}`,
        };
      }

      const dateStr = new Date(singleDate).toISOString().slice(0, 10);
      const booked = await this.prisma.booking.findFirst({
        where: {
          vendorId,
          OR: [
            { eventDate: { gte: start, lt: end } },
            { eventDates: { has: dateStr } },
          ],
          status: {
            in: [
              BookingStatus.ADVANCE_PAID,
              BookingStatus.ACCEPTED,
              BookingStatus.CONFIRMED,
              BookingStatus.WAITING_PAYMENT,
              BookingStatus.PRIMARY_ACCEPTED,
              BookingStatus.STANDBY_ACCEPTED,
            ],
          },
        },
      });
      if (booked) {
        return {
          eligible: false,
          reason: `Vendor already booked on date ${new Date(singleDate).toLocaleDateString()}`,
        };
      }
    }

    return { eligible: true };
  }

  private async findStandbyCandidates(
    excludeVendorId: string,
    categoryId: string | null,
    eventDates: Date[] | Date,
    eventCity: string | null,
    eventLat: number | null,
    eventLng: number | null,
  ): Promise<Array<{ vendor: any; score: number }>> {
    let candidates = await this.prisma.vendor.findMany({
      where: {
        id: { not: excludeVendorId },
        categoryId: categoryId ?? undefined,
        status: VendorStatus.APPROVED,
        isActive: true,
        leadBalance: { remainingLeads: { gt: 0 } },
      },
      include: {
        user: true,
        leadBalance: true,
        reviews: { select: { rating: true } },
        vendorAssignments: { select: { status: true } },
      },
    });

    // Fallback: If no vendors found in exact same category (e.g. test DB), search any active approved vendor
    if (candidates.length === 0) {
      candidates = await this.prisma.vendor.findMany({
        where: {
          id: { not: excludeVendorId },
          status: VendorStatus.APPROVED,
          isActive: true,
          leadBalance: { remainingLeads: { gt: 0 } },
        },
        include: {
          user: true,
          leadBalance: true,
          reviews: { select: { rating: true } },
          vendorAssignments: { select: { status: true } },
        },
      });
    }

    const datesList = Array.isArray(eventDates)
      ? eventDates
      : [eventDates];

    const scored: Array<{ vendor: any; score: number }> = [];

    for (const vendor of candidates) {
      let isAvailableAllDates = true;

      for (const singleDate of datesList) {
        const { start, end } = this.getDateRange(new Date(singleDate));
        const isBlocked = await this.prisma.vendorAvailability.findFirst({
          where: { vendorId: vendor.id, date: { gte: start, lt: end } },
        });
        if (isBlocked) {
          isAvailableAllDates = false;
          break;
        }

        const dateStr = new Date(singleDate).toISOString().slice(0, 10);
        const isBooked = await this.prisma.booking.findFirst({
          where: {
            vendorId: vendor.id,
            OR: [
              { eventDate: { gte: start, lt: end } },
              { eventDates: { has: dateStr } },
            ],
            status: {
              in: [
                BookingStatus.ADVANCE_PAID,
                BookingStatus.ACCEPTED,
                BookingStatus.CONFIRMED,
                BookingStatus.WAITING_PAYMENT,
                BookingStatus.PRIMARY_ACCEPTED,
                BookingStatus.STANDBY_ACCEPTED,
              ],
            },
          },
        });
        if (isBooked) {
          isAvailableAllDates = false;
          break;
        }
      }

      if (!isAvailableAllDates) continue;

      const score = await this.calculatePriorityScore(
        vendor,
        datesList[0] || new Date(),
        eventCity,
        eventLat,
        eventLng,
      );
      scored.push({ vendor, score });
    }

    return scored.sort((a, b) => b.score - a.score);
  }

  async adjustLeadBalance(
    vendorId: string,
    delta: number,
  ): Promise<void> {
    const balance = await this.prisma.vendorLeadBalance.findUnique({
      where: { vendorId },
    });
    if (!balance) throw new NotFoundException('Lead balance not found');

    const newRemaining = Math.max(0, balance.remainingLeads + delta);
    const newTotal =
      delta > 0 ? balance.totalLeads + delta : balance.totalLeads;
    const newUsed = Math.max(0, balance.usedLeads - (delta > 0 ? 0 : -delta));

    await this.prisma.vendorLeadBalance.update({
      where: { vendorId },
      data: {
        totalLeads: newTotal,
        usedLeads: newUsed,
        remainingLeads: newRemaining,
      },
    });
  }

  async getBookingAssignments(bookingId: string) {
    return this.prisma.bookingVendorAssignment.findMany({
      where: { bookingId },
      include: {
        vendor: {
          include: {
            user: { select: { name: true, email: true } },
            leadBalance: true,
          },
        },
      },
      orderBy: { priority: 'asc' },
    });
  }

  private async calculatePriorityScore(
    vendor: any,
    _eventDate: Date,
    eventCity: string | null,
    eventLat: number | null,
    eventLng: number | null,
  ): Promise<number> {
    // 1. Availability (40%) — already confirmed available at this point
    const availabilityScore = 100;

    // 2. Subscription plan (20%)
    const badge = (vendor.badge ?? 'BRONZE').toUpperCase();
    const subscriptionScore = PLAN_SCORE[badge] ?? 30;

    // 3. Vendor rating (15%)
    const reviews = vendor.reviews ?? [];
    const avgRating =
      reviews.length > 0
        ? reviews.reduce((s: number, r: any) => s + r.rating, 0) / reviews.length
        : 3;
    const ratingScore = (avgRating / 5) * 100;

    // 4. Distance (15%)
    const distanceScore = this.calculateDistanceScore(
      vendor,
      eventCity,
      eventLat,
      eventLng,
    );

    // 5. Response rate (10%)
    const allAssignments = vendor.vendorAssignments ?? [];
    const responded = allAssignments.filter((a: any) =>
      [
        VendorAssignmentStatus.ACCEPTED,
        VendorAssignmentStatus.REJECTED,
        VendorAssignmentStatus.AVAILABLE,
      ].includes(a.status),
    ).length;
    const responseRateScore =
      allAssignments.length > 0
        ? (responded / allAssignments.length) * 100
        : 50;

    const score =
      availabilityScore * 0.4 +
      subscriptionScore * 0.2 +
      ratingScore * 0.15 +
      distanceScore * 0.15 +
      responseRateScore * 0.1;

    return Math.round(score * 100) / 100;
  }

  private calculateDistanceScore(
    vendor: any,
    eventCity: string | null,
    eventLat: number | null,
    eventLng: number | null,
  ): number {
    if (
      eventLat !== null &&
      eventLng !== null &&
      vendor.latitude !== null &&
      vendor.longitude !== null
    ) {
      const distKm = this.haversineDistance(
        eventLat,
        eventLng,
        Number(vendor.latitude),
        Number(vendor.longitude),
      );
      if (distKm <= 10) return 100;
      if (distKm <= 50) return 70;
      if (distKm <= 100) return 40;
      return 10;
    }

    if (eventCity && vendor.city) {
      return eventCity.trim().toLowerCase() === vendor.city.trim().toLowerCase()
        ? 100
        : 30;
    }

    return 50;
  }

  private haversineDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
  ): number {
    const R = 6371;
    const dLat = this.toRad(lat2 - lat1);
    const dLon = this.toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) * Math.sin(dLon / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }

  private toRad(deg: number): number {
    return (deg * Math.PI) / 180;
  }

  private async deductLead(
    vendorId: string,
    bookingId: string,
    assignmentId: string,
    reason: string,
  ): Promise<void> {
    const balance = await this.prisma.vendorLeadBalance.findUnique({
      where: { vendorId },
    });

    if (!balance) {
      this.logger.warn(`[Engine] No lead balance for vendor ${vendorId}`);
      return;
    }

    const balanceBefore = balance.remainingLeads;
    const balanceAfter = Math.max(0, balanceBefore - 1);

    await this.prisma.vendorLeadBalance.update({
      where: { vendorId },
      data: {
        usedLeads: { increment: 1 },
        remainingLeads: balanceAfter,
      },
    });

    await this.prisma.leadDeductionLog.create({
      data: {
        vendorId,
        bookingId,
        assignmentId,
        reason,
        deducted: 1,
        balanceBefore,
        balanceAfter,
      },
    });

    this.logger.log(
      `[Engine] Lead deducted vendor=${vendorId} reason=${reason} balance ${balanceBefore}→${balanceAfter}`,
    );
  }

  private async closeStandbyAssignments(bookingId: string): Promise<void> {
    await this.prisma.bookingVendorAssignment.updateMany({
      where: {
        bookingId,
        role: VendorAssignmentRole.STANDBY,
        status: {
          in: [VendorAssignmentStatus.PENDING, VendorAssignmentStatus.AVAILABLE],
        },
      },
      data: { status: VendorAssignmentStatus.CLOSED },
    });
  }

  private async getVendorAssignment(
    bookingId: string,
    vendorId: string,
    role: VendorAssignmentRole,
  ) {
    const a = await this.prisma.bookingVendorAssignment.findUnique({
      where: { bookingId_vendorId: { bookingId, vendorId } },
    });
    if (!a) throw new NotFoundException('Assignment not found');
    if (a.role !== role)
      throw new BadRequestException(`Expected role ${role}, got ${a.role}`);
    return a;
  }

  private async getAnyAssignment(bookingId: string, vendorId: string) {
    const a = await this.prisma.bookingVendorAssignment.findUnique({
      where: { bookingId_vendorId: { bookingId, vendorId } },
    });
    if (!a) throw new NotFoundException('Assignment not found');
    return a;
  }

  private getDateRange(date: Date) {
    const start = new Date(date);
    start.setUTCHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setUTCDate(end.getUTCDate() + 1);
    return { start, end };
  }

  private async notifyVendorsOnMatch(
    booking: any,
    primaryVendor: any,
    standbys: Array<{ vendor: any; score: number }>,
  ) {
    // 1. In-App & Email to Primary Vendor
    await this.notifications.create(primaryVendor.userId, {
      title: '📬 New Booking Request',
      message: `You have a new booking request for ${booking.eventDate.toLocaleDateString('en-IN')}. Please accept or reject within ${VENDOR_TIMEOUT_HOURS} hours.`,
    });

    if (primaryVendor.user?.email) {
      await this.mailService.sendPrimaryBookingRequestEmail(
        primaryVendor.user.email,
        primaryVendor.businessName,
        booking.user?.name || 'Customer',
        booking.bookingNumber,
        new Date(booking.eventDate).toLocaleDateString('en-IN'),
        booking.city || primaryVendor.city || 'Location',
        booking.package?.title || 'Selected Package',
        Number(booking.totalAmount) || 0,
      );
    }

    // 2. In-App & Email to Standby Vendors
    for (const { vendor } of standbys) {
      await this.notifications.create(vendor.userId, {
        title: '📋 Standby Booking Request',
        message: `You have been added as a standby vendor for a booking on ${booking.eventDate.toLocaleDateString('en-IN')}. Please indicate your availability.`,
      });

      if (vendor.user?.email) {
        await this.mailService.sendStandbyBookingBroadcastEmail(
          vendor.user.email,
          vendor.businessName,
          booking.bookingNumber,
          booking.package?.category?.name || 'Category',
          new Date(booking.eventDate).toLocaleDateString('en-IN'),
          booking.city || vendor.city || 'Location',
        );
      }
    }
  }

  private async notifyAdminsNoVendorAvailable(booking: any) {
    const admins = await this.prisma.user.findMany({
      where: { role: Role.ADMIN },
      select: { id: true },
    });
    await Promise.all(
      admins.map((admin) =>
        this.notifications.create(admin.id, {
          title: '⚠️ Manual Assignment Required',
          message: `Booking ${booking.bookingNumber} has no available vendors. Manual assignment required.`,
          type: 'booking',
          link: `/admin/bookings?bookingId=${booking.id}`,
        }),
      ),
    );
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // CUSTOMER ALTERNATIVE VENDOR SELECTION
  // ═══════════════════════════════════════════════════════════════════════════

  async getAlternativeVendorsForCustomer(bookingId: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        vendor: true,
        package: { include: { category: true } },
        vendorAssignments: {
          include: {
            vendor: {
              include: {
                category: true,
                reviews: { select: { rating: true } },
                packages: { select: { price: true } },
              },
            },
          },
          orderBy: { priority: 'asc' },
        },
      },
    });

    if (!booking) throw new NotFoundException('Booking not found');

    // Get all broadcasted vendor assignments (excluding current primary vendor & unavailable/rejected vendors)
    const broadcastedAssignments = booking.vendorAssignments.filter(
      (a) =>
        a.vendorId !== booking.vendorId &&
        a.vendor?.businessName !== booking.vendor?.businessName &&
        a.role !== VendorAssignmentRole.PRIMARY &&
        a.status !== VendorAssignmentStatus.NOT_AVAILABLE &&
        a.status !== VendorAssignmentStatus.REJECTED,
    );

    const result: Array<{
      id: string;
      businessName: string;
      description: string | null;
      profileImage: string | null;
      coverImage: string | null;
      badge: any;
      city: string | null;
      startingPrice: number;
      category: string;
      rating: number;
      score: number;
      assignmentStatus: string;
      respondedAt?: Date | null;
    }> = [];

    for (const assignment of broadcastedAssignments) {
      const v = assignment.vendor;
      if (!v || !v.isActive || v.status !== VendorStatus.APPROVED) continue;

      const ratings = v.reviews.map((r: any) => r.rating);
      const avgRating =
        ratings.length > 0
          ? ratings.reduce((a: number, b: number) => a + b, 0) / ratings.length
          : 4.5;

      const startingPrice = v.packages?.[0]?.price
        ? Number(v.packages[0].price)
        : Number(booking.totalAmount) || 10000;

      result.push({
        id: v.id,
        businessName: v.businessName,
        description: v.description,
        profileImage: v.logoUrl ?? v.coverImage ?? null,
        coverImage: v.coverImage,
        badge: v.badge,
        city: v.city,
        startingPrice,
        category: v.category?.name ?? booking.package?.category?.name ?? 'Vendor',
        rating: Math.round(avgRating * 10) / 10,
        score: assignment.score ?? 50,
        assignmentStatus: assignment.status,
        respondedAt: assignment.respondedAt,
      });
    }

    // Fallback: If no broadcasted assignments found, search vendors in same category
    if (result.length === 0) {
      const candidates = await this.prisma.vendor.findMany({
        where: {
          id: { not: booking.vendorId },
          categoryId: booking.package?.categoryId ?? undefined,
          status: VendorStatus.APPROVED,
          isActive: true,
        },
        include: {
          category: true,
          reviews: { select: { rating: true } },
          packages: { select: { price: true } },
        },
        take: 10,
      });

      for (const v of candidates) {
        const ratings = v.reviews.map((r: any) => r.rating);
        const avgRating =
          ratings.length > 0
            ? ratings.reduce((a: number, b: number) => a + b, 0) / ratings.length
            : 4.5;

        const startingPrice = v.packages?.[0]?.price
          ? Number(v.packages[0].price)
          : Number(booking.totalAmount) || 10000;

        result.push({
          id: v.id,
          businessName: v.businessName,
          description: v.description,
          profileImage: v.logoUrl ?? v.coverImage ?? null,
          coverImage: v.coverImage,
          badge: v.badge,
          city: v.city,
          startingPrice,
          category: v.category?.name ?? 'Vendor',
          rating: Math.round(avgRating * 10) / 10,
          score: 50,
          assignmentStatus: 'PENDING',
        });
      }
    }

    result.sort((a, b) => b.score - a.score);
    return { success: true, data: result };
  }

  async customerSelectVendor(bookingId: string, userId: string, vendorId: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        vendor: { include: { user: true } },
        user: true,
        package: { include: { category: true } },
      },
    });

    if (!booking) throw new NotFoundException('Booking not found');

    const selectedVendor = await this.prisma.vendor.findUnique({
      where: { id: vendorId },
      include: { user: true },
    });

    if (!selectedVendor) throw new NotFoundException('Selected vendor not found');
    if (selectedVendor.status !== VendorStatus.APPROVED)
      throw new BadRequestException('Vendor is not approved');

    const oldVendor = booking.vendor;
    const oldVendorName = oldVendor?.businessName ?? 'Previous Vendor';

    // 1. Demote existing primary assignment to standby and reset status to PENDING
    await this.prisma.bookingVendorAssignment.updateMany({
      where: {
        bookingId,
        role: VendorAssignmentRole.PRIMARY,
      },
      data: {
        role: VendorAssignmentRole.STANDBY,
        status: VendorAssignmentStatus.PENDING,
      },
    });

    // Ensure old primary vendor has a STANDBY assignment row in PENDING status
    if (oldVendor) {
      await this.prisma.bookingVendorAssignment.upsert({
        where: { bookingId_vendorId: { bookingId, vendorId: oldVendor.id } },
        create: {
          bookingId,
          vendorId: oldVendor.id,
          role: VendorAssignmentRole.STANDBY,
          priority: 99,
          score: 50,
          status: VendorAssignmentStatus.PENDING,
          timeoutAt: new Date(Date.now() + VENDOR_TIMEOUT_HOURS * 3600 * 1000),
        },
        update: {
          role: VendorAssignmentRole.STANDBY,
          status: VendorAssignmentStatus.PENDING,
        },
      });
    }

    const timeoutAt = new Date();
    timeoutAt.setHours(timeoutAt.getHours() + VENDOR_TIMEOUT_HOURS);

    // 2. Set new vendor as PRIMARY
    await this.prisma.bookingVendorAssignment.upsert({
      where: { bookingId_vendorId: { bookingId, vendorId } },
      create: {
        bookingId,
        vendorId,
        role: VendorAssignmentRole.PRIMARY,
        priority: 1,
        score: 100,
        status: VendorAssignmentStatus.PENDING,
        timeoutAt,
      },
      update: {
        role: VendorAssignmentRole.PRIMARY,
        priority: 1,
        status: VendorAssignmentStatus.PENDING,
        timeoutAt,
        respondedAt: null,
      },
    });

    // 3. Update booking's vendorId and status
    await this.prisma.booking.update({
      where: { id: bookingId },
      data: {
        vendorId,
        status: BookingStatus.WAITING_PRIMARY_VENDOR,
        noVendorAvailable: false,
      },
    });

    // 4. Log activity for Admin & Audit History
    await this.logActivity(
      bookingId,
      'CUSTOMER_SELECTED_ALTERNATIVE',
      'Customer Selected Alternative Vendor',
      `Customer selected alternative vendor ${selectedVendor.businessName} (replacing ${oldVendorName}). New primary request sent to ${selectedVendor.businessName}, and ${oldVendorName} moved to Standby.`,
      'CUSTOMER',
      userId,
    );

    // 5. In-App Notifications
    await this.notifications.create(selectedVendor.userId, {
      title: '📬 Customer Selected You as Primary Vendor!',
      message: `A customer has selected you as primary vendor for booking ${booking.bookingNumber}. Please accept or reject within ${VENDOR_TIMEOUT_HOURS} hours.`,
    });

    if (oldVendor) {
      await this.notifications.create(oldVendor.userId, {
        title: '📋 Booking Status Update: Moved to Standby',
        message: `For booking ${booking.bookingNumber}, customer selected another vendor as primary. You are now a Standby Vendor for this request.`,
      });
    }

    const admins = await this.prisma.user.findMany({
      where: { role: Role.ADMIN },
      select: { id: true },
    });
    for (const admin of admins) {
      await this.notifications.create(admin.id, {
        title: '🔄 Customer Selected Alternative Vendor',
        message: `Customer selected ${selectedVendor.businessName} as new primary vendor for Booking ${booking.bookingNumber}. ${oldVendorName} moved to Standby.`,
        type: 'booking',
        link: `/admin/bookings?bookingId=${bookingId}`,
      });
    }

    // 6. Email Dispatches
    const customerName = booking.customerName || booking.user?.name || 'Customer';
    const eventDateStr = booking.eventDate ? new Date(booking.eventDate).toLocaleDateString('en-GB') : 'TBD';
    const eventCity = booking.city || 'Delhi';
    const categoryName = booking.package?.category?.name || 'Category';
    const packageName = booking.package?.title || 'Package';
    const amount = Number(booking.totalAmount) || 0;

    if (selectedVendor.user?.email) {
      await this.mailService.sendPrimaryBookingRequestEmail(
        selectedVendor.user.email,
        selectedVendor.businessName,
        customerName,
        booking.bookingNumber,
        eventDateStr,
        eventCity,
        packageName,
        amount,
      );
    }

    if (oldVendor?.user?.email) {
      await this.mailService.sendStandbyBookingBroadcastEmail(
        oldVendor.user.email,
        oldVendor.businessName,
        booking.bookingNumber,
        categoryName,
        eventDateStr,
        eventCity,
      );
    }

    return { success: true, message: 'Vendor selected successfully' };
  }

  async getBookingActivities(bookingId: string) {
    return this.prisma.bookingActivity.findMany({
      where: { bookingId },
      orderBy: { createdAt: 'asc' },
    });
  }
}

