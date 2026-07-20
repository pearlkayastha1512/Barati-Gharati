-- AlterTable
ALTER TABLE "WeddingWebsite" ADD COLUMN     "brideName" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "coverImage" TEXT,
ADD COLUMN     "groomName" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "venueAddress" TEXT,
ADD COLUMN     "venueName" TEXT,
ADD COLUMN     "weddingDate" TIMESTAMP(3);
