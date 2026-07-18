CREATE TYPE "CustomerMembership" AS ENUM ('FREE', 'PREMIUM');
CREATE TYPE "PremiumPlanningStatus" AS ENUM ('SUBMITTED', 'UNDER_REVIEW', 'VENDORS_ASSIGNED', 'QUOTED', 'ACCEPTED', 'REJECTED', 'BOOKED');

ALTER TABLE "User"
ADD COLUMN "membership" "CustomerMembership" NOT NULL DEFAULT 'FREE',
ADD COLUMN "membershipActivatedAt" TIMESTAMP(3),
ADD COLUMN "membershipPaymentOrderId" TEXT,
ADD COLUMN "membershipPaymentId" TEXT;

CREATE UNIQUE INDEX "User_membershipPaymentOrderId_key" ON "User"("membershipPaymentOrderId");

CREATE TABLE "PremiumPlanningRequest" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "weddingType" TEXT NOT NULL,
  "venuePreference" TEXT NOT NULL,
  "budget" DECIMAL(12,2) NOT NULL,
  "city" TEXT NOT NULL,
  "guestCount" INTEGER NOT NULL,
  "theme" TEXT NOT NULL,
  "requiredVendors" TEXT[] NOT NULL,
  "specialRequirements" TEXT,
  "status" "PremiumPlanningStatus" NOT NULL DEFAULT 'SUBMITTED',
  "assignedVendorIds" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  "quotationAmount" DECIMAL(12,2),
  "quotationDetails" JSONB,
  "adminNotes" TEXT,
  "reviewedAt" TIMESTAMP(3),
  "quotedAt" TIMESTAMP(3),
  "respondedAt" TIMESTAMP(3),
  "bookedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "PremiumPlanningRequest_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "PremiumPlanningRequest_userId_idx" ON "PremiumPlanningRequest"("userId");
CREATE INDEX "PremiumPlanningRequest_status_idx" ON "PremiumPlanningRequest"("status");
CREATE INDEX "PremiumPlanningRequest_createdAt_idx" ON "PremiumPlanningRequest"("createdAt");

ALTER TABLE "PremiumPlanningRequest"
ADD CONSTRAINT "PremiumPlanningRequest_userId_fkey"
FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
