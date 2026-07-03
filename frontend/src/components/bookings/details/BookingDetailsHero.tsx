"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Clock3,
} from "lucide-react";

import { Booking } from "@/types/booking";

interface BookingDetailsHeroProps {
  booking: Booking;
}

function getStatusText(status: string) {
  switch (status) {
    case "pending":
      return "Booking Pending";

    case "accepted":
      return "Booking Confirmed";

    case "completed":
      return "Wedding Completed";

    case "cancelled":
      return "Booking Cancelled";

    default:
      return status;
  }
}

function getStatusColor(status: string) {
  switch (status) {
    case "pending":
      return "text-yellow-300";

    case "accepted":
      return "text-green-300";

    case "completed":
      return "text-blue-300";

    case "cancelled":
      return "text-red-300";

    default:
      return "text-white";
  }
}

export default function BookingDetailsHero({
  booking,
}: BookingDetailsHeroProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="
        rounded-[32px]
        bg-gradient-to-r
        from-indigo-600
        via-violet-600
        to-purple-600
        p-8
        text-white
      "
    >
      <Link
        href="/customer/bookings"
        className="inline-flex items-center gap-2 text-white/80 transition hover:text-white"
      >
        <ArrowLeft size={18} />
        Back to Bookings
      </Link>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-6">

        {/* Left */}

        <div>
          <h1 className="text-5xl font-bold">
            {booking.vendorName}
          </h1>

          <p className="mt-3 text-lg text-indigo-100">
            {booking.category}
          </p>

          <div className="mt-5 flex flex-wrap gap-5 text-indigo-100">

            <div className="flex items-center gap-2">
              <Clock3 size={18} />
              {booking.packageName}
            </div>

            <div>
              {booking.city}
            </div>

          </div>

        </div>

        {/* Right */}

        <div className="rounded-3xl bg-white/10 p-6 backdrop-blur">

          <div className="flex items-center gap-3">

            <CalendarDays size={22} />

            <span>
              {booking.eventDate}
            </span>

          </div>

          <div className="mt-4 flex items-center gap-3">

            <CheckCircle2
              size={22}
              className={getStatusColor(
                booking.bookingStatus
              )}
            />

            <span>
              {getStatusText(
                booking.bookingStatus
              )}
            </span>

          </div>

        </div>

      </div>
    </motion.section>
  );
}