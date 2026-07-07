import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  AvailabilityStatus,
  BookingStatus,
  VendorStatus,
} from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';
import { BlockAvailabilityDto } from './dto/block-availability.dto';

@Injectable()
export class AvailabilityService {
  constructor(private readonly prisma: PrismaService) {}

  async findMine(userId: string) {
    const vendor = await this.getApprovedVendorByUserId(userId);

    return this.getVendorCalendar(vendor.id, vendor.frontendVendorId ?? 0);
  }

  async findByFrontendVendorId(frontendVendorId: number) {
    const vendor = await this.prisma.vendor.findUnique({
      where: {
        frontendVendorId,
      },
    });

    if (!vendor) {
      throw new NotFoundException('Vendor not found');
    }

    if (vendor.status !== VendorStatus.APPROVED) {
      throw new ForbiddenException('Vendor is not approved by admin');
    }

    return this.getVendorCalendar(vendor.id, vendor.frontendVendorId ?? 0);
  }

  async block(userId: string, dto: BlockAvailabilityDto) {
    const vendor = await this.getApprovedVendorByUserId(userId);

    const date = this.parseDate(dto.date);

    const booked = await this.hasBookedDate(vendor.id, date);

    if (booked) {
      throw new BadRequestException(
        'Vendor already has a booking on this date.',
      );
    }

    const availability = await this.prisma.vendorAvailability.upsert({
      where: {
        vendorId_date: {
          vendorId: vendor.id,
          date,
        },
      },
      update: {
        reason: dto.reason,
        status: AvailabilityStatus.BLOCKED,
      },
      create: {
        vendorId: vendor.id,
        date,
        reason: dto.reason,
        status: AvailabilityStatus.BLOCKED,
      },
    });

    return this.mapBlockedAvailability(
      availability,
      vendor.frontendVendorId ?? 0,
    );
  }

  async unblock(userId: string, id: string) {
    const vendor = await this.getApprovedVendorByUserId(userId);

    const item = await this.prisma.vendorAvailability.findUnique({
      where: {
        id,
      },
    });

    if (!item) {
      throw new NotFoundException('Blocked date not found');
    }

    if (item.vendorId !== vendor.id) {
      throw new ForbiddenException('Access denied');
    }

    await this.prisma.vendorAvailability.delete({
      where: {
        id,
      },
    });

    return {
      success: true,
      message: 'Date unblocked successfully.',
    };
  }

  private async getVendorCalendar(vendorId: string, frontendVendorId: number) {
    const [blocked, booked] = await Promise.all([
      this.prisma.vendorAvailability.findMany({
        where: {
          vendorId,
        },
        orderBy: {
          date: 'asc',
        },
      }),
      this.prisma.booking.findMany({
        where: {
          vendorId,
          status: {
            in: [BookingStatus.ACCEPTED, BookingStatus.CONFIRMED],
          },
        },
        select: {
          id: true,
          eventDate: true,
          updatedAt: true,
          createdAt: true,
        },
        orderBy: {
          eventDate: 'asc',
        },
      }),
    ]);

    const data = [
      ...blocked.map((item) =>
        this.mapBlockedAvailability(item, frontendVendorId),
      ),
      ...booked.map((booking) => ({
        id: `booking-${booking.id}`,
        vendorId: frontendVendorId,
        date: this.formatDate(booking.eventDate),
        status: 'booked' as const,
        reason: 'Booked',
        createdAt: booking.createdAt.toISOString(),
        updatedAt: booking.updatedAt.toISOString(),
      })),
    ];

    return {
      success: true,
      data,
    };
  }

  private async getApprovedVendorByUserId(userId: string) {
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

    return vendor;
  }

  private async hasBookedDate(vendorId: string, date: Date) {
    const { start, end } = this.getDateRange(date);

    const booking = await this.prisma.booking.findFirst({
      where: {
        vendorId,
        eventDate: {
          gte: start,
          lt: end,
        },
        status: {
          in: [BookingStatus.ACCEPTED, BookingStatus.CONFIRMED],
        },
      },
    });

    return Boolean(booking);
  }

  private parseDate(date: string) {
    const value = new Date(`${date.slice(0, 10)}T00:00:00.000Z`);

    if (Number.isNaN(value.getTime())) {
      throw new BadRequestException('Invalid date');
    }

    return value;
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

  private formatDate(date: Date) {
    return date.toISOString().slice(0, 10);
  }

  private mapBlockedAvailability(
    item: {
      id: string;
      date: Date;
      reason: string | null;
      createdAt: Date;
      updatedAt: Date;
    },
    frontendVendorId: number,
  ) {
    return {
      id: item.id,
      vendorId: frontendVendorId,
      date: this.formatDate(item.date),
      status: 'blocked' as const,
      reason: item.reason ?? '',
      createdAt: item.createdAt.toISOString(),
      updatedAt: item.updatedAt.toISOString(),
    };
  }
}
