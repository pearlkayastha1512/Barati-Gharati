-- CreateEnum
CREATE TYPE "AvailabilityStatus" AS ENUM ('BLOCKED');

-- CreateTable
CREATE TABLE "VendorAvailability" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "status" "AvailabilityStatus" NOT NULL DEFAULT 'BLOCKED',
    "reason" TEXT,
    "vendorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VendorAvailability_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "VendorAvailability_vendorId_idx" ON "VendorAvailability"("vendorId");

-- CreateIndex
CREATE INDEX "VendorAvailability_date_idx" ON "VendorAvailability"("date");

-- CreateIndex
CREATE UNIQUE INDEX "VendorAvailability_vendorId_date_key" ON "VendorAvailability"("vendorId", "date");

-- AddForeignKey
ALTER TABLE "VendorAvailability" ADD CONSTRAINT "VendorAvailability_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "Vendor"("id") ON DELETE CASCADE ON UPDATE CASCADE;
