-- CreateEnum
CREATE TYPE "VendorAssignmentRole" AS ENUM ('PRIMARY', 'STANDBY');

-- CreateEnum
CREATE TYPE "VendorAssignmentStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED', 'AVAILABLE', 'NOT_AVAILABLE', 'PROMOTED', 'CLOSED', 'TIMED_OUT');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "BookingStatus" ADD VALUE 'MATCHING';
ALTER TYPE "BookingStatus" ADD VALUE 'WAITING_PRIMARY_VENDOR';
ALTER TYPE "BookingStatus" ADD VALUE 'PRIMARY_ACCEPTED';
ALTER TYPE "BookingStatus" ADD VALUE 'WAITING_PAYMENT';
ALTER TYPE "BookingStatus" ADD VALUE 'PRIMARY_REJECTED';
ALTER TYPE "BookingStatus" ADD VALUE 'PROMOTE_STANDBY';
ALTER TYPE "BookingStatus" ADD VALUE 'STANDBY_ACCEPTED';
ALTER TYPE "BookingStatus" ADD VALUE 'IN_PROGRESS';
ALTER TYPE "BookingStatus" ADD VALUE 'COMPLETED';
ALTER TYPE "BookingStatus" ADD VALUE 'REVIEW_PENDING';
ALTER TYPE "BookingStatus" ADD VALUE 'CLOSED';

-- AlterTable
ALTER TABLE "Booking" ADD COLUMN     "engineTimeoutHours" INTEGER NOT NULL DEFAULT 2,
ADD COLUMN     "eventLatitude" DECIMAL(10,7),
ADD COLUMN     "eventLongitude" DECIMAL(10,7),
ADD COLUMN     "matchedAt" TIMESTAMP(3),
ADD COLUMN     "noVendorAvailable" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Vendor" ADD COLUMN     "latitude" DECIMAL(10,7),
ADD COLUMN     "longitude" DECIMAL(10,7);

-- CreateTable
CREATE TABLE "BookingVendorAssignment" (
    "id" TEXT NOT NULL,
    "bookingId" TEXT NOT NULL,
    "vendorId" TEXT NOT NULL,
    "role" "VendorAssignmentRole" NOT NULL,
    "priority" INTEGER NOT NULL,
    "score" DOUBLE PRECISION,
    "status" "VendorAssignmentStatus" NOT NULL DEFAULT 'PENDING',
    "respondedAt" TIMESTAMP(3),
    "promotedAt" TIMESTAMP(3),
    "timeoutAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BookingVendorAssignment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VendorLeadBalance" (
    "id" TEXT NOT NULL,
    "vendorId" TEXT NOT NULL,
    "totalLeads" INTEGER NOT NULL DEFAULT 0,
    "usedLeads" INTEGER NOT NULL DEFAULT 0,
    "remainingLeads" INTEGER NOT NULL DEFAULT 0,
    "planType" TEXT NOT NULL DEFAULT 'BRONZE',
    "cycleStartAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "cycleEndAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VendorLeadBalance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LeadDeductionLog" (
    "id" TEXT NOT NULL,
    "vendorId" TEXT NOT NULL,
    "bookingId" TEXT NOT NULL,
    "assignmentId" TEXT,
    "reason" TEXT NOT NULL,
    "deducted" INTEGER NOT NULL DEFAULT 1,
    "balanceBefore" INTEGER NOT NULL,
    "balanceAfter" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LeadDeductionLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "BookingVendorAssignment_bookingId_idx" ON "BookingVendorAssignment"("bookingId");

-- CreateIndex
CREATE INDEX "BookingVendorAssignment_vendorId_idx" ON "BookingVendorAssignment"("vendorId");

-- CreateIndex
CREATE INDEX "BookingVendorAssignment_status_idx" ON "BookingVendorAssignment"("status");

-- CreateIndex
CREATE INDEX "BookingVendorAssignment_timeoutAt_idx" ON "BookingVendorAssignment"("timeoutAt");

-- CreateIndex
CREATE UNIQUE INDEX "BookingVendorAssignment_bookingId_vendorId_key" ON "BookingVendorAssignment"("bookingId", "vendorId");

-- CreateIndex
CREATE UNIQUE INDEX "VendorLeadBalance_vendorId_key" ON "VendorLeadBalance"("vendorId");

-- CreateIndex
CREATE INDEX "LeadDeductionLog_vendorId_idx" ON "LeadDeductionLog"("vendorId");

-- CreateIndex
CREATE INDEX "LeadDeductionLog_bookingId_idx" ON "LeadDeductionLog"("bookingId");

-- CreateIndex
CREATE INDEX "LeadDeductionLog_createdAt_idx" ON "LeadDeductionLog"("createdAt");

-- CreateIndex
CREATE INDEX "Booking_matchedAt_idx" ON "Booking"("matchedAt");

-- CreateIndex
CREATE INDEX "Vendor_city_idx" ON "Vendor"("city");

-- AddForeignKey
ALTER TABLE "BookingVendorAssignment" ADD CONSTRAINT "BookingVendorAssignment_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookingVendorAssignment" ADD CONSTRAINT "BookingVendorAssignment_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "Vendor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VendorLeadBalance" ADD CONSTRAINT "VendorLeadBalance_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "Vendor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeadDeductionLog" ADD CONSTRAINT "LeadDeductionLog_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "Vendor"("id") ON DELETE CASCADE ON UPDATE CASCADE;
