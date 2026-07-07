-- CreateTable
CREATE TABLE "PlatformSettings" (
    "id" TEXT NOT NULL DEFAULT 'platform',
    "allowVendorRegistration" BOOLEAN NOT NULL DEFAULT true,
    "allowCustomerRegistration" BOOLEAN NOT NULL DEFAULT true,
    "enableReviews" BOOLEAN NOT NULL DEFAULT true,
    "enablePayments" BOOLEAN NOT NULL DEFAULT true,
    "maintenanceMode" BOOLEAN NOT NULL DEFAULT false,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PlatformSettings_pkey" PRIMARY KEY ("id")
);

-- Seed singleton row
INSERT INTO "PlatformSettings" (
    "id",
    "allowVendorRegistration",
    "allowCustomerRegistration",
    "enableReviews",
    "enablePayments",
    "maintenanceMode",
    "updatedAt"
) VALUES (
    'platform',
    true,
    true,
    true,
    true,
    false,
    CURRENT_TIMESTAMP
) ON CONFLICT ("id") DO NOTHING;
