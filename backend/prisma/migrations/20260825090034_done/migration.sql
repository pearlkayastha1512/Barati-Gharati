-- CreateTable
CREATE TABLE "BookingActivity" (
    "id" TEXT NOT NULL,
    "bookingId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "actorType" TEXT,
    "actorId" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BookingActivity_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "BookingActivity_bookingId_idx" ON "BookingActivity"("bookingId");

-- CreateIndex
CREATE INDEX "BookingActivity_createdAt_idx" ON "BookingActivity"("createdAt");

-- AddForeignKey
ALTER TABLE "BookingActivity" ADD CONSTRAINT "BookingActivity_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE CASCADE ON UPDATE CASCADE;
