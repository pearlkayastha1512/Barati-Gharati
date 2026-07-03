"use client";

import { useMemo } from "react";

import { motion } from "framer-motion";
import Link from "next/link";

import {
  CalendarCheck,
  Clock3,
  CheckCircle2,
  ArrowRight,
  Sparkles,
} from "lucide-react";

import { useBookingStore } from "@/store/bookingStore";

export default function BookingHero() {
  const bookings = useBookingStore(
    (state) => state.bookings
  );

  const {
  totalBookings,
  upcomingBookings,
  completedBookings,
  pendingBookings,
  cancelledBookings,
} = useMemo(() => {
  const today = new Date();

  return {
    totalBookings: bookings.length,

    upcomingBookings: bookings.filter(
      (booking) =>
        booking.bookingStatus !== "cancelled" &&
        new Date(booking.eventDate) >= today
    ).length,

    completedBookings: bookings.filter(
      (booking) =>
        booking.bookingStatus === "completed"
    ).length,

    pendingBookings: bookings.filter(
      (booking) =>
        booking.bookingStatus === "pending"
    ).length,

    cancelledBookings: bookings.filter(
      (booking) =>
        booking.bookingStatus === "cancelled"
    ).length,
  };
}, [bookings]);

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className="
        relative
        overflow-hidden
        rounded-[32px]
        bg-gradient-to-br
        from-indigo-500
        via-violet-500
        to-purple-600
        p-8
        text-white
        shadow-xl
      "
    >
      {/* Background Glow */}

      <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />

      <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />

      <div className="relative z-10 grid gap-8 lg:grid-cols-2">
        {/* Left */}

        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 backdrop-blur">
            <Sparkles size={16} />

            <span className="text-sm font-medium">
              Booking Management
            </span>
          </div>

          <h1 className="mt-6 text-5xl font-bold leading-tight">
            Manage all your
            <br />
            wedding bookings.
          </h1>

          <p className="mt-6 max-w-xl text-lg text-indigo-100">
            Track every vendor booking, monitor payment status,
            view upcoming events and manage your wedding schedule
            from one place.
          </p>

          <div className="mt-8 flex gap-4">
            <Link
              href="/vendors"
              className="
                flex
                items-center
                gap-2
                rounded-2xl
                bg-white
                px-6
                py-4
                font-semibold
                text-indigo-600
                transition
                hover:-translate-y-1
              "
            >
              Book More Vendors

              <ArrowRight size={18} />
            </Link>
          </div>
        </div>

        {/* Right */}

        <div className="rounded-3xl bg-white/10 p-6 backdrop-blur">
  <div className="flex items-center gap-3">
    <CalendarCheck size={22} />

    <h3 className="text-xl font-semibold">
      Booking Summary
    </h3>
  </div>

  <div className="mt-8 space-y-5">

    <div className="flex items-center justify-between">
      <span className="flex items-center gap-2 text-indigo-100">
        <CalendarCheck size={18} />
        Total Bookings
      </span>

      <span className="font-semibold">
        {totalBookings}
      </span>
    </div>

    <div className="flex items-center justify-between">
      <span className="flex items-center gap-2 text-indigo-100">
        <Clock3 size={18} />
        Upcoming
      </span>

      <span className="font-semibold">
        {upcomingBookings}
      </span>
    </div>

    <div className="flex items-center justify-between">
      <span className="flex items-center gap-2 text-indigo-100">
        <CheckCircle2 size={18} />
        Completed
      </span>

      <span className="font-semibold">
        {completedBookings}
      </span>
    </div>

    <div className="flex items-center justify-between">
      <span className="text-indigo-100">
        Pending
      </span>

      <span className="font-semibold">
        {pendingBookings}
      </span>
    </div>

    <div className="flex items-center justify-between">
      <span className="text-indigo-100">
        Cancelled
      </span>

      <span className="font-semibold">
        {cancelledBookings}
      </span>
    </div>

  </div>
</div>
      </div>
    </motion.section>
  );
}