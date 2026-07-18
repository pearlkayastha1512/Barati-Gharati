CREATE TYPE "AdminVerificationStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

ALTER TABLE "User"
ADD COLUMN "adminVerificationStatus" "AdminVerificationStatus" NOT NULL DEFAULT 'PENDING',
ADD COLUMN "adminVerifiedAt" TIMESTAMP(3),
ADD COLUMN "adminRejectionReason" TEXT;

-- Preserve access for accounts created before this verification workflow.
UPDATE "User"
SET "adminVerificationStatus" = 'APPROVED',
    "adminVerifiedAt" = CURRENT_TIMESTAMP
WHERE "role" IN ('USER', 'ADMIN');

CREATE INDEX "User_adminVerificationStatus_idx" ON "User"("adminVerificationStatus");
