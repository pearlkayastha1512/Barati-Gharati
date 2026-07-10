import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';

import {
  ApiBearerAuth,
  ApiTags,
} from '@nestjs/swagger';

import { Role, VendorBadge } from '@prisma/client';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

import { PaymentService } from './payment.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { VerifyPaymentDto } from './dto/verify-payment.dto';

@ApiTags('Payment')
@ApiBearerAuth()
@Controller('payment')
export class PaymentController {
  constructor(
    private readonly paymentService: PaymentService,
  ) {}

  // ==========================
  // CREATE ORDER
  // ==========================

  @Post('create-order')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.USER)
  createOrder(
    @CurrentUser('sub') userId: string,
    @Body() dto: CreateOrderDto,
  ) {
    return this.paymentService.createOrder(
      userId,
      dto,
    );
  }

  @Post('vendor-badge/create-order')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.VENDOR)
  createVendorBadgeOrder(
    @CurrentUser('sub') userId: string,
    @Body() dto: { badge: VendorBadge },
  ) {
    return this.paymentService.createVendorBadgeOrder(
      userId,
      dto.badge,
    );
  }

  @Post('vendor-badge/verify')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.VENDOR)
  verifyVendorBadgePayment(
    @CurrentUser('sub') userId: string,
    @Body()
    dto: VerifyPaymentDto & {
      badge: VendorBadge;
    },
  ) {
    return this.paymentService.verifyVendorBadgePayment(
      userId,
      dto.badge,
      dto,
    );
  }

  // ==========================
  // VERIFY PAYMENT
  // ==========================

  @Post('verify/:bookingId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.USER)
  verifyPayment(
    @CurrentUser('sub') userId: string,
    @Param('bookingId') bookingId: string,
    @Body() dto: VerifyPaymentDto,
  ) {
    return this.paymentService.verifyPayment(
      userId,
      bookingId,
      dto,
    );
  }

  // ==========================
  // PAYMENT HISTORY
  // ==========================

  @Get('history')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.USER)
  paymentHistory(
    @CurrentUser('sub') userId: string,
  ) {
    return this.paymentService.paymentHistory(
      userId,
    );
  }

  // ==========================
  // SINGLE PAYMENT
  // ==========================

  @Get(':bookingId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.USER)
  getPayment(
    @CurrentUser('sub') userId: string,
    @Param('bookingId') bookingId: string,
  ) {
    return this.paymentService.getPayment(
      userId,
      bookingId,
    );
  }
}
