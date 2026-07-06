/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Portfolio` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Conversation" DROP CONSTRAINT "Conversation_vendorId_fkey";

-- DropForeignKey
ALTER TABLE "Portfolio" DROP CONSTRAINT "Portfolio_vendorId_fkey";

-- AlterTable
ALTER TABLE "Conversation" ADD COLUMN     "portfolioId" TEXT;

-- AlterTable
ALTER TABLE "Portfolio" DROP COLUMN "createdAt";

-- AddForeignKey
ALTER TABLE "Portfolio" ADD CONSTRAINT "Portfolio_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "Vendor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Conversation" ADD CONSTRAINT "Conversation_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "Vendor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Conversation" ADD CONSTRAINT "Conversation_portfolioId_fkey" FOREIGN KEY ("portfolioId") REFERENCES "Portfolio"("id") ON DELETE SET NULL ON UPDATE CASCADE;
