-- AlterTable
ALTER TABLE "Vendor" ADD COLUMN     "bankVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "businessVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "city" TEXT,
ADD COLUMN     "documentsUploaded" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "experience" TEXT,
ADD COLUMN     "facebook" TEXT,
ADD COLUMN     "gstNumber" TEXT,
ADD COLUMN     "gstVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "instagram" TEXT,
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "linkedin" TEXT,
ADD COLUMN     "website" TEXT,
ADD COLUMN     "youtube" TEXT;
