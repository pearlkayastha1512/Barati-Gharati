/*
  Warnings:

  - A unique constraint covering the columns `[frontendVendorId]` on the table `Vendor` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Vendor_frontendVendorId_idx";

-- CreateIndex
CREATE UNIQUE INDEX "Vendor_frontendVendorId_key" ON "Vendor"("frontendVendorId");
