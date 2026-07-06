/*
  Warnings:

  - You are about to drop the column `bankVerified` on the `Vendor` table. All the data in the column will be lost.
  - You are about to drop the column `businessVerified` on the `Vendor` table. All the data in the column will be lost.
  - You are about to drop the column `city` on the `Vendor` table. All the data in the column will be lost.
  - You are about to drop the column `documentsUploaded` on the `Vendor` table. All the data in the column will be lost.
  - You are about to drop the column `experience` on the `Vendor` table. All the data in the column will be lost.
  - You are about to drop the column `facebook` on the `Vendor` table. All the data in the column will be lost.
  - You are about to drop the column `gstNumber` on the `Vendor` table. All the data in the column will be lost.
  - You are about to drop the column `gstVerified` on the `Vendor` table. All the data in the column will be lost.
  - You are about to drop the column `instagram` on the `Vendor` table. All the data in the column will be lost.
  - You are about to drop the column `isActive` on the `Vendor` table. All the data in the column will be lost.
  - You are about to drop the column `linkedin` on the `Vendor` table. All the data in the column will be lost.
  - You are about to drop the column `website` on the `Vendor` table. All the data in the column will be lost.
  - You are about to drop the column `youtube` on the `Vendor` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Vendor" DROP COLUMN "bankVerified",
DROP COLUMN "businessVerified",
DROP COLUMN "city",
DROP COLUMN "documentsUploaded",
DROP COLUMN "experience",
DROP COLUMN "facebook",
DROP COLUMN "gstNumber",
DROP COLUMN "gstVerified",
DROP COLUMN "instagram",
DROP COLUMN "isActive",
DROP COLUMN "linkedin",
DROP COLUMN "website",
DROP COLUMN "youtube",
ADD COLUMN     "frontendVendorId" INTEGER;

-- CreateIndex
CREATE INDEX "Vendor_frontendVendorId_idx" ON "Vendor"("frontendVendorId");
