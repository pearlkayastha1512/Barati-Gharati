CREATE TABLE "VendorRegistrationVerification" (
  "id" TEXT NOT NULL,
  "ownerName" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "phone" TEXT NOT NULL,
  "otpHash" TEXT NOT NULL,
  "verifiedAt" TIMESTAMP(3),
  "expiresAt" TIMESTAMP(3) NOT NULL,
  "usedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "VendorRegistrationVerification_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "VendorRegistrationVerification_email_idx" ON "VendorRegistrationVerification"("email");
CREATE INDEX "VendorRegistrationVerification_phone_idx" ON "VendorRegistrationVerification"("phone");
CREATE INDEX "VendorRegistrationVerification_expiresAt_idx" ON "VendorRegistrationVerification"("expiresAt");
