CREATE TYPE "AdminRole" AS ENUM (
  'SUPER_ADMIN',
  'FINANCE_ADMIN',
  'VENDOR_MANAGER',
  'BOOKING_MANAGER',
  'SUPPORT_ADMIN',
  'CONTENT_MANAGER',
  'REVIEW_DISPUTE_MANAGER',
  'CHAT_MODERATOR'
);

ALTER TABLE "User"
ADD COLUMN "adminRole" "AdminRole",
ADD COLUMN "adminPermissions" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
ADD COLUMN "adminIsActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN "mustChangePassword" BOOLEAN NOT NULL DEFAULT false;

CREATE TABLE "AdminAuditLog" (
  "id" TEXT NOT NULL,
  "actorId" TEXT NOT NULL,
  "action" TEXT NOT NULL,
  "resource" TEXT NOT NULL,
  "resourceId" TEXT,
  "details" JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "AdminAuditLog_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "AdminAuditLog_actorId_idx" ON "AdminAuditLog"("actorId");
CREATE INDEX "AdminAuditLog_resource_idx" ON "AdminAuditLog"("resource");
CREATE INDEX "AdminAuditLog_createdAt_idx" ON "AdminAuditLog"("createdAt");

ALTER TABLE "AdminAuditLog"
ADD CONSTRAINT "AdminAuditLog_actorId_fkey"
FOREIGN KEY ("actorId") REFERENCES "User"("id")
ON DELETE CASCADE ON UPDATE CASCADE;
