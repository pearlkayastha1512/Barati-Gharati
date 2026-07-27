import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import type { Response } from 'express';

import {
  ApiBearerAuth,
  ApiTags,
} from '@nestjs/swagger';

import { Role, VendorBadge, VendorBadgeBillingCycle } from '@prisma/client';

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

  @Post('mobile-callback')
  mobileCallback(
    @Body()
    body: {
      razorpay_order_id?: string;
      razorpay_payment_id?: string;
      razorpay_signature?: string;
      error?: { description?: string } | string;
    },
    @Res() response: Response,
  ) {
    const payload = {
      type:
        body.razorpay_order_id &&
        body.razorpay_payment_id &&
        body.razorpay_signature
          ? 'success'
          : 'failed',
      data: {
        razorpay_order_id:
          body.razorpay_order_id ?? '',
        razorpay_payment_id:
          body.razorpay_payment_id ?? '',
        razorpay_signature:
          body.razorpay_signature ?? '',
      },
      message:
        typeof body.error === 'string'
          ? body.error
          : body.error?.description ??
            'Payment could not be completed.',
    };

    const serialized = JSON.stringify(payload).replace(
      /</g,
      '\\u003c',
    );

    response
      .type('html')
      .send(`<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"><style>body{font-family:sans-serif;text-align:center;padding:48px;color:#6c2d45}</style></head><body><p>Returning to Barati Gharati…</p><script>window.ReactNativeWebView.postMessage(JSON.stringify(${serialized}));</script></body></html>`);
  }

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

  @Post('remaining/create-order')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.USER)
  createRemainingOrder(
    @CurrentUser('sub') userId: string,
    @Body() dto: CreateOrderDto,
  ) {
    return this.paymentService.createRemainingOrder(
      userId,
      dto,
    );
  }

  @Post('vendor-badge/create-order')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.VENDOR)
  createVendorBadgeOrder(
    @CurrentUser('sub') userId: string,
    @Body() dto: { badge: VendorBadge; billingCycle?: VendorBadgeBillingCycle },
  ) {
    return this.paymentService.createVendorBadgeOrder(
      userId,
      dto.badge,
      dto.billingCycle ?? VendorBadgeBillingCycle.MONTHLY,
    );
  }

  @Post('vendor-registration-badge/create-order')
  createVendorRegistrationBadgeOrder(
    @Body() dto: {
      badge: VendorBadge;
      billingCycle?: VendorBadgeBillingCycle;
      registrationVerificationId: string;
    },
  ) {
    return this.paymentService.createVendorRegistrationBadgeOrder(
      dto.badge,
      dto.billingCycle ?? VendorBadgeBillingCycle.MONTHLY,
      dto.registrationVerificationId,
    );
  }

  @Post('customer-premium-registration/create-order')
  createCustomerPremiumRegistrationOrder() {
    return this.paymentService.createCustomerPremiumRegistrationOrder();
  }

  @Post('vendor-badge/verify')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.VENDOR)
  verifyVendorBadgePayment(
    @CurrentUser('sub') userId: string,
    @Body()
    dto: VerifyPaymentDto & {
      badge: VendorBadge;
      billingCycle?: VendorBadgeBillingCycle;
    },
  ) {
    return this.paymentService.verifyVendorBadgePayment(
      userId,
      dto.badge,
      dto.billingCycle ?? VendorBadgeBillingCycle.MONTHLY,
      dto,
    );
  }

  // ==========================
  // PREMIUM PLANNING ADVANCE
  // ==========================

  @Post('premium-advance/create-order')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.USER)
  createPremiumAdvanceOrder(
    @CurrentUser('sub') userId: string,
    @Body() body: { planningRequestId: string },
  ) {
    return this.paymentService.createPremiumAdvanceOrder(
      userId,
      body.planningRequestId,
    );
  }

  @Post('premium-advance/verify')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.USER)
  verifyPremiumAdvancePayment(
    @CurrentUser('sub') userId: string,
    @Body()
    dto: VerifyPaymentDto & { planningRequestId: string },
  ) {
    return this.paymentService.verifyPremiumAdvancePayment(
      userId,
      dto.planningRequestId,
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

  @Post('remaining/verify/:bookingId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.USER)
  verifyRemainingPayment(
    @CurrentUser('sub') userId: string,
    @Param('bookingId') bookingId: string,
    @Body() dto: VerifyPaymentDto,
  ) {
    return this.paymentService.verifyRemainingPayment(
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
