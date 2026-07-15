import { BadRequestException, Injectable } from '@nestjs/common';
import { PayoutStatus, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

type CommissionBreakdownItem = {
  from: number;
  to: number | null;
  taxableAmount: number;
  rate: number;
  commission: number;
};

@Injectable()
export class PayoutsService {
  private readonly policy = 'ADVANCE_MARGINAL_V1';

  constructor(private readonly prisma: PrismaService) {}

  calculateAdvanceCommission(grossAdvance: unknown) {
    const gross = Math.max(0, Number(grossAdvance));
    const slabs = [
      { from: 0, to: 10_000, rate: 10 },
      { from: 10_000, to: 25_000, rate: 8 },
      { from: 25_000, to: 50_000, rate: 6 },
      { from: 50_000, to: null, rate: 5 },
    ];

    const breakdown: CommissionBreakdownItem[] = [];
    let commission = 0;

    for (const slab of slabs) {
      const slabEnd = slab.to ?? gross;
      const taxableAmount = Math.max(
        0,
        Math.min(gross, slabEnd) - slab.from,
      );

      if (taxableAmount <= 0) continue;

      const slabCommission =
        Math.round(taxableAmount * slab.rate) / 100;
      commission += slabCommission;
      breakdown.push({
        ...slab,
        taxableAmount,
        commission: slabCommission,
      });
    }

    commission = Math.round(commission * 100) / 100;

    return {
      grossAdvance: gross,
      platformCommission: commission,
      vendorNetAmount: Math.round((gross - commission) * 100) / 100,
      commissionPolicy: this.policy,
      commissionBreakdown: breakdown,
    };
  }

  async ensureAdvancePayout(
    bookingId: string,
    grossAdvance: unknown,
    razorpayPaymentId?: string,
  ) {
    const calculation = this.calculateAdvanceCommission(grossAdvance);

    return this.prisma.bookingPayout.upsert({
      where: { bookingId },
      create: {
        bookingId,
        ...calculation,
        commissionBreakdown:
          calculation.commissionBreakdown as Prisma.InputJsonValue,
        razorpayPaymentId,
        status: PayoutStatus.HELD_FOR_ADMIN_REVIEW,
        simulated: true,
      },
      update: {
        grossAdvance: calculation.grossAdvance,
        platformCommission: calculation.platformCommission,
        vendorNetAmount: calculation.vendorNetAmount,
        commissionPolicy: calculation.commissionPolicy,
        commissionBreakdown:
          calculation.commissionBreakdown as Prisma.InputJsonValue,
        ...(razorpayPaymentId ? { razorpayPaymentId } : {}),
      },
    });
  }

  async releaseAdvancePayout(bookingId: string) {
    const payout = await this.prisma.bookingPayout.findUnique({
      where: { bookingId },
    });

    if (!payout) {
      throw new BadRequestException(
        'Advance payout ledger is missing for this booking',
      );
    }

    if (
      payout.status === PayoutStatus.RELEASED ||
      payout.status === PayoutStatus.SETTLED
    ) {
      return payout;
    }

    const routeEnabled =
      process.env.RAZORPAY_ROUTE_ENABLED?.toLowerCase() === 'true';

    if (routeEnabled) {
      throw new BadRequestException(
        'Live Razorpay Route transfer is not configured yet. Keep RAZORPAY_ROUTE_ENABLED=false for local testing.',
      );
    }

    return this.prisma.bookingPayout.update({
      where: { bookingId },
      data: {
        status: PayoutStatus.RELEASED,
        simulated: true,
        releasedAt: new Date(),
        transferFailureReason: null,
      },
    });
  }

  async acknowledgeByVendor(bookingId: string) {
    const payout = await this.prisma.bookingPayout.findUnique({
      where: { bookingId },
    });

    if (
      !payout ||
      payout.status !== PayoutStatus.RELEASED &&
      payout.status !== PayoutStatus.SETTLED
    ) {
      throw new BadRequestException(
        'Admin must release the advance payout before acknowledgement',
      );
    }

    return this.prisma.bookingPayout.update({
      where: { bookingId },
      data: { vendorAcknowledgedAt: new Date() },
    });
  }
}
