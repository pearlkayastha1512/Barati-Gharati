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
  // USER
  // Create Booking
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
  // USER & VENDOR
  // My Bookings
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
  // USER & VENDOR
  // Booking Details
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
  // VENDOR
  // Accept Booking
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
  // VENDOR
  // Reject Booking
  // ===========================

  @Patch(':id/reject')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.VENDOR)
  reject(
    @Param('id') id: string,
    @CurrentUser('sub') userId: string,
    @Body() dto: CancelBookingDto,
  ) {
    return this.bookingsService.reject(
      id,
      userId,
      dto.cancellationReason,
    );
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
  // VENDOR
  // Confirm Booking
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
  // USER
  // Update Payment
  // ===========================

  @Patch(':id/payment')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.USER)
  updatePayment(
    @Param('id') id: string,
    @CurrentUser('sub') userId: string,
    @Body() dto: UpdateBookingPaymentDto,
  ) {
    return this.bookingsService.updatePayment(
      id,
      userId,
      dto,
    );
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
  // USER
  // Cancel Booking
  // ===========================

  @Patch(':id/cancel')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.USER)
  cancel(
    @Param('id') id: string,
    @CurrentUser('sub') userId: string,
    @Body() dto: CancelBookingDto,
  ) {
    return this.bookingsService.cancel(
      id,
      userId,
      dto,
    );
  }
}
