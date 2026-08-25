-- AlterTable
ALTER TABLE "User" ADD COLUMN     "phoneOtp" TEXT,
ADD COLUMN     "phoneOtpExpiresAt" TIMESTAMP(3);
