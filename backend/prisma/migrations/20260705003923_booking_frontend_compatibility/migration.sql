/*
  Warnings:

  - You are about to drop the column `advancePaid` on the `Booking` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Booking" DROP COLUMN "advancePaid",
ADD COLUMN     "amountPaid" DECIMAL(10,2) NOT NULL DEFAULT 0;
