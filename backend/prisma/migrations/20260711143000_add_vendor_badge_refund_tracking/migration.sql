ALTER TABLE "Vendor"
ADD COLUMN "badgePaymentId" TEXT,
ADD COLUMN "badgePaymentRefundId" TEXT,
ADD COLUMN "badgePaymentRefundedAt" TIMESTAMP(3);
