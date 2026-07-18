CREATE TYPE "VendorBadgeBillingCycle" AS ENUM ('MONTHLY', 'YEARLY');

ALTER TABLE "Vendor"
ADD COLUMN "badgeBillingCycle" "VendorBadgeBillingCycle" NOT NULL DEFAULT 'MONTHLY',
ADD COLUMN "badgeExpiresAt" TIMESTAMP(3);

UPDATE "Vendor"
SET "badgeExpiresAt" = "badgePurchasedAt" + INTERVAL '1 month'
WHERE "badgePurchasedAt" IS NOT NULL;

CREATE INDEX "Vendor_badgeExpiresAt_idx" ON "Vendor"("badgeExpiresAt");
