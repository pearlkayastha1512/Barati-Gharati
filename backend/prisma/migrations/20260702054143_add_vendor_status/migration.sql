/*
  Warnings:

  - Added the required column `updatedAt` to the `VendorGallery` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "VendorStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- AlterTable
ALTER TABLE "Vendor" ADD COLUMN     "status" "VendorStatus" NOT NULL DEFAULT 'PENDING';


