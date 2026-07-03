import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { CancelBookingDto } from './dto/cancel-booking.dto';
import { Role, BookingStatus } from '@prisma/client';
import { PaymentStatus } from '@prisma/client';
import { VendorStatus } from '@prisma/client';

@Injectable()
export class BookingsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateBookingDto) {
    const pkg = await this.prisma.package.findUnique({
      where: { id: dto.packageId },
    });
    
    if (!pkg) throw new NotFoundException('Package not found');
    const vendor = await this.prisma.vendor.findUnique({
  where: {
    id: pkg.vendorId,
  },
});

if (!vendor) {
  throw new NotFoundException('Vendor not found');
}

if (vendor.status !== VendorStatus.APPROVED) {
  throw new ForbiddenException(
    'Vendor is not approved by admin',
  );
}
    return this.prisma.booking.create({
      data: {
        userId,
        vendorId: pkg.vendorId,
        packageId: dto.packageId,
        eventDate: new Date(dto.eventDate),
        totalAmount: pkg.price,
        notes: dto.notes,
        status: BookingStatus.PENDING,
      },
      include: {
        package: true,
        vendor: { include: { user: { select: { name: true, email: true } } } },
        user: { select: { name: true, email: true } },
      },
    });
  }

  async findMyBookings(userId: string, role: Role) {
    if (role === Role.VENDOR) {
      const vendor = await this.prisma.vendor.findUnique({ where: { userId } });
      if (!vendor) throw new NotFoundException('Vendor profile not found');
      if (vendor.status !== VendorStatus.APPROVED) {
  throw new ForbiddenException(
    'Vendor is not approved by admin',
  );
}
      return this.prisma.booking.findMany({
        where: { vendorId: vendor.id },
        include: {
          package: true,
          user: { select: { name: true, email: true } },
        },
        orderBy: { createdAt: 'desc' },
      });
    }

    return this.prisma.booking.findMany({
      where: { userId },
      include: {
        package: true,
        vendor: { include: { user: { select: { name: true, email: true } } } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string, userId: string, role: Role) {
    const booking = await this.prisma.booking.findUnique({
      where: { id },
      include: {
        package: true,
        vendor: { include: { user: { select: { name: true, email: true } } } },
        user: { select: { name: true, email: true } },
      },
    });

    if (!booking) throw new NotFoundException('Booking not found');
    
    if (role === Role.VENDOR) {
      const vendor = await this.prisma.vendor.findUnique({ where: { userId } });
      if (vendor?.status !== VendorStatus.APPROVED) {
  throw new ForbiddenException(
    'Vendor is not approved by admin',
  );
}
      if (!vendor || booking.vendorId !== vendor.id)
        throw new ForbiddenException('Access denied');
    } else {
      if (booking.userId !== userId)
        throw new ForbiddenException('Access denied');
    }

    return booking;
  }

  async accept(id: string, userId: string) {
    const booking = await this.getVendorBooking(id, userId);

    if (booking.status !== BookingStatus.PENDING)
      throw new BadRequestException('Only PENDING bookings can be accepted');

    return this.prisma.booking.update({
      where: { id },
      data: { status: BookingStatus.ACCEPTED },
    });
  }

  async reject(id: string, userId: string, cancellationReason: string) {
    const booking = await this.getVendorBooking(id, userId);

    if (booking.status !== BookingStatus.PENDING)
      throw new BadRequestException('Only PENDING bookings can be rejected');

    return this.prisma.booking.update({
      where: { id },
      data: { status: BookingStatus.REJECTED, cancellationReason },
    });
  }

  async confirm(id: string, userId: string) {
  const booking = await this.prisma.booking.findUnique({
    where: { id },
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
    throw new BadRequestException(
      'Only ACCEPTED bookings can be confirmed',
    );
  }

  return this.prisma.booking.update({
    where: { id },
    data: {
      status: BookingStatus.CONFIRMED,
    },
  });
}

  async cancel(id: string, userId: string, dto: CancelBookingDto) {
    const booking = await this.prisma.booking.findUnique({ where: { id } });

    if (!booking) throw new NotFoundException('Booking not found');
    if (booking.userId !== userId)
      throw new ForbiddenException('Access denied');
    if (booking.status === BookingStatus.CANCELLED)
      throw new BadRequestException('Booking is already cancelled');
    if (booking.status === BookingStatus.CONFIRMED)
      throw new BadRequestException('Confirmed bookings cannot be cancelled');

    return this.prisma.booking.update({
      where: { id },
      data: {
        status: BookingStatus.CANCELLED,
        cancellationReason: dto.cancellationReason,
      },
    });
  }

  private async getVendorBooking(
  id: string,
  userId: string,
) {
  const vendor = await this.prisma.vendor.findUnique({
    where: {
      userId,
    },
  });

  if (!vendor) {
    throw new NotFoundException(
      'Vendor profile not found',
    );
  }

  if (vendor.status !== VendorStatus.APPROVED) {
    throw new ForbiddenException(
      'Vendor is not approved by admin',
    );
  }

  const booking = await this.prisma.booking.findUnique({
    where: {
      id,
    },
  });

  if (!booking) {
    throw new NotFoundException(
      'Booking not found',
    );
  }

  if (booking.vendorId !== vendor.id) {
    throw new ForbiddenException(
      'Access denied',
    );
  }

  return booking;
}
}