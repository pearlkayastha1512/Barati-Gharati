import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  CustomerMembership,
  PremiumPlanningStatus,
  VendorStatus,
  BookingStatus,
  PaymentStatus,
  VendorAssignmentRole,
  VendorAssignmentStatus,
} from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { CreatePremiumPlanningRequestDto } from './dto/create-premium-planning-request.dto';
import { ReviewPremiumPlanningRequestDto } from './dto/review-premium-planning-request.dto';
import { CreatePremiumQuotationDto } from './dto/create-premium-quotation.dto';
import {
  CUSTOMER_PREMIUM_FEATURES,
  CUSTOMER_PREMIUM_PRICE,
} from './premium-planning.constants';

@Injectable()
export class PremiumPlanningService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notifications: NotificationsService,
  ) {}

  private isClosed(status: PremiumPlanningStatus) {
    return status === PremiumPlanningStatus.ACCEPTED
      || status === PremiumPlanningStatus.REJECTED
      || status === PremiumPlanningStatus.BOOKED;
  }

  getMembershipInfo() {
    return {
      success: true,
      data: {
        plan: CustomerMembership.PREMIUM,
        price: CUSTOMER_PREMIUM_PRICE,
        currency: 'INR',
        billing: 'one-time',
        features: CUSTOMER_PREMIUM_FEATURES,
      },
    };
  }

  private async requirePremium(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { membership: true },
    });

    if (!user) throw new NotFoundException('User not found');
    if (user.membership !== CustomerMembership.PREMIUM) {
      throw new ForbiddenException('Premium membership is required');
    }
  }

  async create(userId: string, dto: CreatePremiumPlanningRequestDto) {
    await this.requirePremium(userId);

    const request = await this.prisma.premiumPlanningRequest.create({
      data: { ...dto, userId },
    });

    await this.notifications.create(userId, {
      title: 'Wedding plan submitted',
      message: 'The Barati Gharati team will review your preferences and prepare a quotation.',
    });

    return { success: true, message: 'Wedding preferences submitted successfully', data: request };
  }

  async listMine(userId: string) {
    await this.requirePremium(userId);
    const requests = await this.prisma.premiumPlanningRequest.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    const assignedVendorIds = [
      ...new Set(requests.flatMap((request) => request.assignedVendorIds)),
    ];
    const vendors = assignedVendorIds.length
      ? await this.prisma.vendor.findMany({
          where: { id: { in: assignedVendorIds } },
          select: {
            id: true,
            frontendVendorId: true,
            businessName: true,
            city: true,
            logoUrl: true,
            coverImage: true,
            category: { select: { name: true } },
          },
        })
      : [];
    const vendorById = new Map(vendors.map((vendor) => [vendor.id, vendor]));
    const data = requests.map((request) => ({
      ...request,
      assignedVendors: request.assignedVendorIds
        .map((vendorId) => vendorById.get(vendorId))
        .filter((vendor) => vendor !== undefined)
        .map((vendor) => ({
          id: vendor.id,
          profileId: vendor.frontendVendorId,
          businessName: vendor.businessName,
          category: vendor.category?.name ?? '',
          city: vendor.city ?? '',
          logoUrl: vendor.logoUrl,
          coverImage: vendor.coverImage,
        })),
    }));
    return { success: true, data };
  }

  async listAll() {
    const data = await this.prisma.premiumPlanningRequest.findMany({
      include: {
        user: { select: { id: true, name: true, email: true, phone: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
    return { success: true, data };
  }

  async listApprovedVendors() {
    const data = await this.prisma.vendor.findMany({
      where: { status: VendorStatus.APPROVED, isActive: true },
      select: {
        id: true,
        businessName: true,
        city: true,
        status: true,
        category: { select: { name: true } },
        user: { select: { name: true } },
      },
      orderBy: { businessName: 'asc' },
    });
    return {
      success: true,
      data: data.map((vendor) => ({
        id: vendor.id,
        businessName: vendor.businessName,
        ownerName: vendor.user.name,
        category: vendor.category?.name ?? '',
        city: vendor.city ?? '',
        approvalStatus: vendor.status.toLowerCase(),
      })),
    };
  }

  async review(id: string, dto: ReviewPremiumPlanningRequestDto) {
    const current = await this.find(id);
    if (this.isClosed(current.status)) {
      throw new BadRequestException('This request can no longer be reviewed');
    }

    if (dto.assignedVendorIds?.length) {
      const count = await this.prisma.vendor.count({
        where: { id: { in: dto.assignedVendorIds }, status: VendorStatus.APPROVED },
      });
      if (count !== new Set(dto.assignedVendorIds).size) {
        throw new BadRequestException('One or more assigned vendors are invalid or not approved');
      }
    }

    const hasAssignments = Boolean(dto.assignedVendorIds?.length);
    const data = await this.prisma.premiumPlanningRequest.update({
      where: { id },
      data: {
        assignedVendorIds: dto.assignedVendorIds,
        adminNotes: dto.adminNotes,
        reviewedAt: new Date(),
        status: hasAssignments
          ? PremiumPlanningStatus.VENDORS_ASSIGNED
          : PremiumPlanningStatus.UNDER_REVIEW,
      },
    });
    if (hasAssignments) {
      await this.notifications.create(current.userId, {
        title: 'Vendors assigned to your wedding plan',
        message: `${dto.assignedVendorIds!.length} approved vendor${dto.assignedVendorIds!.length === 1 ? '' : 's'} selected by the Barati Gharati team.`,
      });
    }
    return { success: true, message: 'Planning request reviewed', data };
  }

  async quote(id: string, dto: CreatePremiumQuotationDto) {
    const current = await this.find(id);
    if (this.isClosed(current.status)) {
      throw new BadRequestException('Quotation cannot be changed after customer response');
    }

    const advancePercentage = dto.advancePercentage ?? 50;
    const advanceAmount = Math.round((dto.amount * advancePercentage) / 100);
    const validityDays = dto.validityDays ?? 7;
    const validUntil = new Date();
    validUntil.setDate(validUntil.getDate() + validityDays);

    const quotationDetails = {
      ...(dto.details ?? {}),
      amount: dto.amount,
      advancePercentage,
      advanceAmount,
      validityDays,
      validUntil: validUntil.toISOString(),
      inclusions: dto.inclusions ?? '',
      vendorBreakdown: dto.vendorBreakdown ?? [],
    };

    const data = await this.prisma.premiumPlanningRequest.update({
      where: { id },
      data: {
        quotationAmount: dto.amount,
        quotationDetails: quotationDetails as object,
        adminNotes: dto.adminNotes ?? current.adminNotes,
        quotedAt: new Date(),
        status: PremiumPlanningStatus.QUOTED,
      },
    });

    await this.notifications.create(current.userId, {
      title: 'Your detailed wedding quotation is ready 🎉',
      message: `Review your personalized quotation of ₹${dto.amount.toLocaleString('en-IN')}.`,
    });

    return { success: true, message: 'Quotation sent to customer', data };
  }


  async respond(userId: string, id: string, accept: boolean) {
    const current = await this.find(id);
    if (current.userId !== userId) throw new ForbiddenException('You cannot update this request');
    if (current.status !== PremiumPlanningStatus.QUOTED) {
      throw new BadRequestException('Only a pending quotation can be accepted or rejected');
    }
    const data = await this.prisma.premiumPlanningRequest.update({
      where: { id },
      data: {
        status: accept ? PremiumPlanningStatus.ACCEPTED : PremiumPlanningStatus.REJECTED,
        respondedAt: new Date(),
      },
    });
    return { success: true, message: accept ? 'Quotation accepted' : 'Quotation rejected', data };
  }

  async markBooked(id: string) {
    const current = await this.find(id);
    if (current.status !== PremiumPlanningStatus.ACCEPTED) {
      throw new BadRequestException('Customer must accept the quotation before booking');
    }
    const data = await this.prisma.premiumPlanningRequest.update({
      where: { id },
      data: { status: PremiumPlanningStatus.BOOKED, bookedAt: new Date() },
    });
    await this.notifications.create(current.userId, {
      title: 'Wedding plan booked',
      message: 'Your premium wedding plan is booked. Our team will coordinate the next steps.',
    });
    return { success: true, message: 'Wedding plan marked as booked', data };
  }

  async payAdvance(userId: string, id: string) {
    const current = await this.find(id);
    if (current.userId !== userId) throw new ForbiddenException('You cannot access this request');
    if (current.status !== PremiumPlanningStatus.ACCEPTED) {
      throw new BadRequestException('You must accept the quotation before paying advance');
    }

    const details = (current.quotationDetails ?? {}) as Record<string, any>;
    const totalAmount = Number(current.quotationAmount) || 0;
    const advancePercentage = details.advancePercentage ?? 50;
    const totalAdvancePaid = details.advanceAmount ?? Math.round((totalAmount * advancePercentage) / 100);

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { name: true, email: true, phone: true },
    });

    // Mark planning request as BOOKED
    const updatedRequest = await this.prisma.premiumPlanningRequest.update({
      where: { id },
      data: {
        status: PremiumPlanningStatus.BOOKED,
        bookedAt: new Date(),
      },
    });

    // Auto-create Booking records for all assigned vendors
    const assignedVendorIds = current.assignedVendorIds || [];
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
          eventType: current.weddingType ?? 'Wedding',
          eventDate: current.createdAt ? new Date(current.createdAt) : new Date(),
          city: current.city ?? vendor.city ?? 'Noida',
          guests: current.guestCount ?? 100,
          customerName: user?.name ?? 'Customer',
          customerEmail: user?.email ?? '',
          customerPhone: user?.phone ?? '',
          eventTitle: `${current.weddingType} (${vendor.businessName})`,
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


      await this.notifications.create(vendor.userId, {
        title: '🎉 New Confirmed Booking (Advance Paid)!',
        message: `Your booking for ${current.weddingType} in ${current.city} is confirmed with Advance Paid of ₹${vendorAdvancePaid.toLocaleString('en-IN')}.`,
      });
    }

    await this.notifications.create(userId, {
      title: '🎉 Premium Wedding Plan Booked!',
      message: `Your advance payment of ₹${totalAdvancePaid.toLocaleString('en-IN')} was received. ${createdBookings.length} vendor bookings have been confirmed.`,
    });

    return {
      success: true,
      message: 'Advance payment received & bookings confirmed!',
      data: updatedRequest,
      bookings: createdBookings,
    };
  }

  private async find(id: string) {
    const request = await this.prisma.premiumPlanningRequest.findUnique({ where: { id } });
    if (!request) throw new NotFoundException('Planning request not found');
    return request;
  }
}

