ALTER TABLE "Booking"
ADD COLUMN "advancePaymentOrderId" TEXT,
ADD COLUMN "adminApproved" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "adminApprovedAt" TIMESTAMP(3);
