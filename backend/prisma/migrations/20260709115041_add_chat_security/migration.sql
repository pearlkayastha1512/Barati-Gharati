-- AlterTable
ALTER TABLE "User" ADD COLUMN     "chatMutedUntil" TIMESTAMP(3),
ADD COLUMN     "isChatFlagged" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "warningCount" INTEGER NOT NULL DEFAULT 0;
