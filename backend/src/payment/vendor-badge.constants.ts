import { VendorBadge, VendorBadgeBillingCycle } from '@prisma/client';

export const VENDOR_BADGE_PRICES: Record<
  VendorBadgeBillingCycle,
  Record<VendorBadge, number>
> = {
  [VendorBadgeBillingCycle.MONTHLY]: {
    [VendorBadge.BRONZE]: 0,
    [VendorBadge.SILVER]: 999,
    [VendorBadge.GOLD]: 1999,
  },
  [VendorBadgeBillingCycle.YEARLY]: {
    [VendorBadge.BRONZE]: 0,
    [VendorBadge.SILVER]: 9990,
    [VendorBadge.GOLD]: 19990,
  },
};

export const VENDOR_BADGE_LIMITS: Record<VendorBadge, number> = {
  [VendorBadge.BRONZE]: 5,
  [VendorBadge.SILVER]: 15,
  [VendorBadge.GOLD]: 50,
};

export function getVendorBadgeExpiry(
  cycle: VendorBadgeBillingCycle,
  from = new Date(),
) {
  const expiresAt = new Date(from);
  if (cycle === VendorBadgeBillingCycle.YEARLY) {
    expiresAt.setFullYear(expiresAt.getFullYear() + 1);
  } else {
    expiresAt.setMonth(expiresAt.getMonth() + 1);
  }
  return expiresAt;
}
