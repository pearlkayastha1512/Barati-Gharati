import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLeadDto } from './dto/create-lead.dto';
import { ReplyLeadDto } from './dto/reply-lead.dto';
import { UpdateLeadStatusDto } from './dto/update-lead-status.dto';
import { ConvertLeadDto } from './dto/convert-lead.dto';
import { Role, LeadStatus, BookingStatus } from '@prisma/client';
import { VendorStatus } from '@prisma/client';

@Injectable()
export class LeadsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateLeadDto) {
    const vendor = await this.prisma.vendor.findUnique({
      where: { id: dto.vendorId },
    });
    if (!vendor) throw new NotFoundException('Vendor not found');
    if (vendor.status !== VendorStatus.APPROVED)
    throw new ForbiddenException(
      'Vendor is not approved by admin',
    );
    if (dto.packageId) {
      const pkg = await this.prisma.package.findUnique({
        where: { id: dto.packageId },
      });
      if (!pkg) throw new NotFoundException('Package not found');
    }

    return this.prisma.lead.create({
      data: {
        userId,
        vendorId: dto.vendorId,
        packageId: dto.packageId,
        name: dto.name,
        email: dto.email,
        phone: dto.phone,
        eventDate: new Date(dto.eventDate),
        guestCount: dto.guestCount,
        message: dto.message,
      },
      include: {
        vendor: { include: { user: { select: { name: true, email: true } } } },
        package: { select: { title: true, price: true } },
      },
    });
  }

  async findAll(userId: string, role: Role) {
    if (role === Role.VENDOR) {
      const vendor = await this.prisma.vendor.findUnique({ where: { userId } });
      if (!vendor) throw new NotFoundException('Vendor profile not found');

      return this.prisma.lead.findMany({
        where: { vendorId: vendor.id },
        include: {
          user: { select: { name: true, email: true } },
          package: { select: { title: true, price: true } },
        },
        orderBy: { createdAt: 'desc' },
      });
    }

    // COUPLE/USER — sees their own sent leads
    return this.prisma.lead.findMany({
      where: { userId },
      include: {
        vendor: { include: { user: { select: { name: true, email: true } } } },
        package: { select: { title: true, price: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string, userId: string, role: Role) {
    const lead = await this.prisma.lead.findUnique({
      where: { id },
      include: {
        user: { select: { name: true, email: true } },
        vendor: { include: { user: { select: { name: true, email: true } } } },
        package: { select: { title: true, price: true } },
      },
    });

    if (!lead) throw new NotFoundException('Lead not found');

    if (role === Role.VENDOR) {
      const vendor = await this.prisma.vendor.findUnique({ where: { userId } });
      if (!vendor || lead.vendorId !== vendor.id)
        throw new ForbiddenException('Access denied');
    } else {
      if (lead.userId !== userId)
        throw new ForbiddenException('Access denied');
    }

    return lead;
  }

  async reply(userId: string, leadId: string, dto: ReplyLeadDto) {
    const lead = await this.prisma.lead.findUnique({ where: { id: leadId } });
    if (!lead) throw new NotFoundException('Lead not found');

    const vendor = await this.prisma.vendor.findUnique({ where: { userId } });
    if (!vendor || lead.vendorId !== vendor.id)
      throw new ForbiddenException('You can only reply to your own leads');

    return this.prisma.lead.update({
      where: { id: leadId },
      data: {
        vendorReply: dto.reply,
        status: LeadStatus.RESPONDED,
      },
    });
  }

  async updateStatus(userId: string, leadId: string, dto: UpdateLeadStatusDto) {
    const lead = await this.prisma.lead.findUnique({ where: { id: leadId } });
    if (!lead) throw new NotFoundException('Lead not found');

    const vendor = await this.prisma.vendor.findUnique({ where: { userId } });
    if (!vendor || lead.vendorId !== vendor.id)
      throw new ForbiddenException('You can only update status of your own leads');

    return this.prisma.lead.update({
      where: { id: leadId },
      data: { status: dto.status },
    });
  }

  async convert(
  userId: string,
  leadId: string,
  dto: ConvertLeadDto,
) {
  const lead = await this.prisma.lead.findUnique({
    where: {
      id: leadId,
    },
  });

  if (!lead) {
    throw new NotFoundException(
      'Lead not found',
    );
  }

  const vendor =
    await this.prisma.vendor.findUnique({
      where: {
        userId,
      },
    });

  if (
    !vendor ||
    lead.vendorId !== vendor.id
  ) {
    throw new ForbiddenException(
      'Only the vendor can convert a lead to booking',
    );
  }

  if (
    vendor.status !==
    VendorStatus.APPROVED
  ) {
    throw new ForbiddenException(
      'Vendor is not approved by admin',
    );
  }

  const pkg =
    await this.prisma.package.findUnique({
      where: {
        id: dto.packageId,
      },
    });

  if (!pkg) {
    throw new NotFoundException(
      'Package not found',
    );
  }

  const bookingNumber = `BK-${Date.now()}`;

  const booking =
    await this.prisma.booking.create({
      data: {
        bookingNumber,

        userId: lead.userId,

        vendorId: vendor.id,

        packageId: pkg.id,

        eventDate: lead.eventDate,

        eventType: 'Wedding',

        guests: lead.guestCount,

        brideName: '',

        groomName: '',

        city: '',

        venue: '',

        eventTime: '',

        specialRequirements:
          lead.message,

        totalAmount: pkg.price,

        amountPaid: 0,

        remainingAmount: pkg.price,

        paymentStatus:
          'PENDING',

        status:
          BookingStatus.PENDING,

        notes: lead.message,
      },
    });

  await this.prisma.lead.update({
    where: {
      id: leadId,
    },
    data: {
      status:
        LeadStatus.CONVERTED,
    },
  });

  return {
    success: true,

    message:
      'Lead converted to booking successfully.',

    data: booking,
  };
}
}