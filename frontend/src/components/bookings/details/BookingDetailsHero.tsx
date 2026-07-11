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

    case "advance_paid":
      return "Advance Paid";

    case "accepted":
      return "Booking Confirmed";

    case "event_completed":
      return "Event Completed";

    case "awaiting_admin_review":
      return "Awaiting Admin Review";

    case "payment_approved":
      return "Payment Approved";

    case "payment_held":
      return "Payment Held";

    case "completed":
      return "Event Completed";

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

    case "advance_paid":
      return "text-rose-100";

    case "accepted":
      return "text-green-300";

    case "event_completed":
      return "text-rose-100";

    case "awaiting_admin_review":
      return "text-rose-100";

    case "payment_approved":
      return "text-emerald-200";

    case "payment_held":
      return "text-red-200";

    case "completed":
      return "text-rose-100";

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
      className="rounded-[32px] bg-gradient-to-r from-[#ff4d6d] via-[#e4005a] to-[#6c2d45] p-8 text-white shadow-lg shadow-rose-200/60"
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

          <p className="mt-3 text-lg text-rose-50">
            {booking.category}
          </p>

          <div className="mt-5 flex flex-wrap gap-5 text-rose-50">

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
