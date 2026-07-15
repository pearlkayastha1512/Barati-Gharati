CREATE TYPE "PayoutStatus" AS ENUM (
  'HELD_FOR_ADMIN_REVIEW',
  'RELEASE_PROCESSING',
  'RELEASED',
  'SETTLED',
  'FAILED',
  'REFUNDED'
);

CREATE TABLE "BookingPayout" (
  "id" TEXT NOT NULL,
  "bookingId" TEXT NOT NULL,
  "grossAdvance" DECIMAL(10,2) NOT NULL,
  "platformCommission" DECIMAL(10,2) NOT NULL,
  "vendorNetAmount" DECIMAL(10,2) NOT NULL,
  "commissionPolicy" TEXT NOT NULL DEFAULT 'ADVANCE_MARGINAL_V1',
  "commissionBreakdown" JSONB NOT NULL,
  "status" "PayoutStatus" NOT NULL DEFAULT 'HELD_FOR_ADMIN_REVIEW',
  "simulated" BOOLEAN NOT NULL DEFAULT true,
  "razorpayPaymentId" TEXT,
  "razorpayTransferId" TEXT,
  "transferFailureReason" TEXT,
  "releasedAt" TIMESTAMP(3),
  "settledAt" TIMESTAMP(3),
  "vendorAcknowledgedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "BookingPayout_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "BookingPayout_bookingId_key" ON "BookingPayout"("bookingId");
CREATE UNIQUE INDEX "BookingPayout_razorpayTransferId_key" ON "BookingPayout"("razorpayTransferId");
CREATE INDEX "BookingPayout_status_idx" ON "BookingPayout"("status");

ALTER TABLE "BookingPayout"
ADD CONSTRAINT "BookingPayout_bookingId_fkey"
FOREIGN KEY ("bookingId") REFERENCES "Booking"("id")
ON DELETE CASCADE ON UPDATE CASCADE;
