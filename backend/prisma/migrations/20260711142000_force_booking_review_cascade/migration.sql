ALTER TABLE "Review" DROP CONSTRAINT IF EXISTS "Review_bookingId_fkey";

ALTER TABLE "Review"
  ADD CONSTRAINT "Review_bookingId_fkey"
  FOREIGN KEY ("bookingId")
  REFERENCES "Booking"("id")
  ON DELETE CASCADE
  ON UPDATE CASCADE;
