-- Rename the existing completed timeline status to match the Prisma schema.
ALTER TYPE "TimelineStatus" RENAME VALUE 'DONE' TO 'COMPLETED';

-- CreateEnum
CREATE TYPE "TimelinePriority" AS ENUM ('LOW', 'MEDIUM', 'HIGH');

-- AlterTable
ALTER TABLE "Timeline" ADD COLUMN "priority" "TimelinePriority" NOT NULL DEFAULT 'MEDIUM';
