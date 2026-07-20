/*
  Warnings:

  - You are about to drop the column `brideName` on the `WeddingWebsite` table. All the data in the column will be lost.
  - You are about to drop the column `groomName` on the `WeddingWebsite` table. All the data in the column will be lost.
  - You are about to drop the column `storyDescription` on the `WeddingWebsite` table. All the data in the column will be lost.
  - You are about to drop the column `storyTitle` on the `WeddingWebsite` table. All the data in the column will be lost.
  - You are about to drop the column `theme` on the `WeddingWebsite` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `WeddingWebsite` table. All the data in the column will be lost.
  - You are about to drop the column `weddingDate` on the `WeddingWebsite` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[bookingId]` on the table `WeddingWebsite` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "WeddingWebsite" DROP CONSTRAINT "WeddingWebsite_userId_fkey";

-- DropIndex
DROP INDEX "WeddingWebsite_slug_idx";

-- AlterTable
ALTER TABLE "WeddingWebsite" DROP COLUMN "brideName",
DROP COLUMN "groomName",
DROP COLUMN "storyDescription",
DROP COLUMN "storyTitle",
DROP COLUMN "theme",
DROP COLUMN "title",
DROP COLUMN "weddingDate",
ADD COLUMN     "bookingId" TEXT,
ADD COLUMN     "galleryImages" TEXT[],
ADD COLUMN     "story" TEXT,
ALTER COLUMN "template" SET DEFAULT 'classic';

-- CreateIndex
CREATE UNIQUE INDEX "WeddingWebsite_bookingId_key" ON "WeddingWebsite"("bookingId");

-- AddForeignKey
ALTER TABLE "WeddingWebsite" ADD CONSTRAINT "WeddingWebsite_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WeddingWebsite" ADD CONSTRAINT "WeddingWebsite_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE SET NULL ON UPDATE CASCADE;
