BEGIN;

-- Create new enum
CREATE TYPE "PaymentStatus_new" AS ENUM (
  'PENDING',
  'PROCESSING',
  'SUCCESS',
  'FAILED',
  'PARTIAL',
  'REFUNDED'
);

ALTER TABLE "Booking"
ALTER COLUMN "paymentStatus" DROP DEFAULT;

-- Convert old PAID values to SUCCESS during migration
ALTER TABLE "Booking"
ALTER COLUMN "paymentStatus"
TYPE "PaymentStatus_new"
USING (
  CASE
    WHEN "paymentStatus"::text = 'PAID'
      THEN 'SUCCESS'::"PaymentStatus_new"
    ELSE "paymentStatus"::text::"PaymentStatus_new"
  END
);

ALTER TYPE "PaymentStatus" RENAME TO "PaymentStatus_old";
ALTER TYPE "PaymentStatus_new" RENAME TO "PaymentStatus";

DROP TYPE "PaymentStatus_old";

ALTER TABLE "Booking"
ALTER COLUMN "paymentStatus"
SET DEFAULT 'PENDING';

COMMIT;