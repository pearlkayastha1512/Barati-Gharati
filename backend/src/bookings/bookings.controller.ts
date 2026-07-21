import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';

import {
  ApiBearerAuth,
  ApiTags,
} from '@nestjs/swagger';

import { Role } from '@prisma/client';

import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { CancelBookingDto } from './dto/cancel-booking.dto';
import { UpdateBookingPaymentDto } from './dto/update-booking-payment.dto';
import { RescheduleBookingDto } from './dto/reschedule-booking.dto';
import { StandbyRespondDto, VendorRejectDto } from './dto/vendor-response.dto';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('Bookings')
@ApiBearerAuth()
@Controller('bookings')
export class BookingsController {
  constructor(
    private readonly bookingsService: BookingsService,
  ) {}

  // ===========================
  // USER — Create Booking
  // ===========================

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.USER)
  create(
    @CurrentUser('sub') userId: string,
    @Body() dto: CreateBookingDto,
  ) {
    return this.bookingsService.create(userId, dto);
  }

  // ===========================
  // USER & VENDOR — My Bookings
  // ===========================

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.USER, Role.VENDOR)
  findMyBookings(
    @CurrentUser('sub') userId: string,
    @CurrentUser('role') role: Role,
  ) {
    return this.bookingsService.findMyBookings(userId, role);
  }

  // ===========================
  // USER & VENDOR — Booking Details
  // ===========================

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.USER, Role.VENDOR)
  findOne(
    @Param('id') id: string,
    @CurrentUser('sub') userId: string,
    @CurrentUser('role') role: Role,
  ) {
    return this.bookingsService.findOne(id, userId, role);
  }

  // ===========================
  // USER & VENDOR — Booking Assignments (Smart Engine)
  // ===========================

  @Get(':id/assignments')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.USER, Role.VENDOR)
  getAssignments(
    @Param('id') id: string,
    @CurrentUser('sub') userId: string,
    @CurrentUser('role') role: Role,
  ) {
    return this.bookingsService.getBookingAssignments(id, userId, role);
  }

  // ===========================
  // USER — Alternative Vendors (Smart Engine)
  // ===========================

  @Get(':id/alternative-vendors')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.USER)
  getAlternativeVendors(@Param('id') id: string) {
    return this.bookingsService.getAlternativeVendors(id);
  }

  @Patch(':id/select-vendor')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.USER)
  customerSelectVendor(
    @Param('id') id: string,
    @CurrentUser('sub') userId: string,
    @Body('vendorId') vendorId: string,
  ) {
    return this.bookingsService.customerSelectVendor(id, userId, vendorId);
  }


  // ===========================
  // VENDOR — Primary Accept (Smart Engine)
  // ===========================

  @Patch(':id/primary-accept')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.VENDOR)
  primaryAccept(
    @Param('id') id: string,
    @CurrentUser('sub') userId: string,
  ) {
    return this.bookingsService.primaryAccept(id, userId);
  }

  // ===========================
  // VENDOR — Primary Reject (Smart Engine)
  // ===========================

  @Patch(':id/primary-reject')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.VENDOR)
  primaryReject(
    @Param('id') id: string,
    @CurrentUser('sub') userId: string,
    @Body() dto: VendorRejectDto,
  ) {
    return this.bookingsService.primaryReject(id, userId, dto.reason);
  }

  // ===========================
  // VENDOR — Standby Respond (Smart Engine)
  // ===========================

  @Patch(':id/standby-respond')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.VENDOR)
  standbyRespond(
    @Param('id') id: string,
    @CurrentUser('sub') userId: string,
    @Body() dto: StandbyRespondDto,
  ) {
    return this.bookingsService.standbyRespond(id, userId, dto.response);
  }

  // ===========================
  // VENDOR — Promoted Accept (Smart Engine)
  // ===========================

  @Patch(':id/promoted-accept')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.VENDOR)
  promotedAccept(
    @Param('id') id: string,
    @CurrentUser('sub') userId: string,
  ) {
    return this.bookingsService.promotedAccept(id, userId);
  }

  // ===========================
  // VENDOR — Promoted Reject (Smart Engine)
  // ===========================

  @Patch(':id/promoted-reject')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.VENDOR)
  promotedReject(
    @Param('id') id: string,
    @CurrentUser('sub') userId: string,
    @Body() dto: VendorRejectDto,
  ) {
    return this.bookingsService.promotedReject(id, userId, dto.reason);
  }

  // ===========================
  // VENDOR (Legacy) — Accept Booking
  // ===========================

  @Patch(':id/accept')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.VENDOR)
  accept(
    @Param('id') id: string,
    @CurrentUser('sub') userId: string,
  ) {
    return this.bookingsService.accept(id, userId);
  }

  // ===========================
  // VENDOR (Legacy) — Reject Booking
  // ===========================

  @Patch(':id/reject')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.VENDOR)
  reject(
    @Param('id') id: string,
    @CurrentUser('sub') userId: string,
    @Body() dto: CancelBookingDto,
  ) {
    return this.bookingsService.reject(id, userId, dto.cancellationReason);
  }

  @Patch(':id/complete-event')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.VENDOR)
  completeEvent(
    @Param('id') id: string,
    @CurrentUser('sub') userId: string,
  ) {
    return this.bookingsService.completeEvent(id, userId);
  }

  // ===========================
  // USER — Confirm Booking
  // ===========================

  @Patch(':id/confirm')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.USER)
  confirm(
    @Param('id') id: string,
    @CurrentUser('sub') userId: string,
  ) {
    return this.bookingsService.confirm(id, userId);
  }

  // ===========================
  // USER — Update Payment
  // ===========================

  @Patch(':id/payment')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.USER)
  updatePayment(
    @Param('id') id: string,
    @CurrentUser('sub') userId: string,
    @Body() dto: UpdateBookingPaymentDto,
  ) {
    return this.bookingsService.updatePayment(id, userId, dto);
  }

  @Patch(':id/reschedule')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.USER)
  reschedule(
    @Param('id') id: string,
    @CurrentUser('sub') userId: string,
    @Body() dto: RescheduleBookingDto,
  ) {
    return this.bookingsService.reschedule(id, userId, dto);
  }

  // ===========================
  // USER — Cancel Booking
  // ===========================

  @Patch(':id/cancel')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.USER)
  cancel(
    @Param('id') id: string,
    @CurrentUser('sub') userId: string,
    @Body() dto: CancelBookingDto,
  ) {
    return this.bookingsService.cancel(id, userId, dto);
  }
}
