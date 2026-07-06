/*
  Warnings:

  - You are about to drop the column `amountPaid` on the `Booking` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[bookingNumber]` on the table `Booking` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `bookingNumber` to the `Booking` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Booking" DROP COLUMN "amountPaid",
ADD COLUMN     "advancePaid" DECIMAL(10,2) NOT NULL DEFAULT 0,
ADD COLUMN     "bookingNumber" TEXT NOT NULL,
ADD COLUMN     "brideName" TEXT,
ADD COLUMN     "city" TEXT,
ADD COLUMN     "eventTime" TEXT,
ADD COLUMN     "eventType" TEXT,
ADD COLUMN     "groomName" TEXT,
ADD COLUMN     "guests" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "specialRequirements" TEXT,
ADD COLUMN     "venue" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Booking_bookingNumber_key" ON "Booking"("bookingNumber");
