"use client";

import { useMemo } from "react";

import { CalendarDays } from "lucide-react";

import { useBookingStore } from "@/store/bookingStore";



export default function WeddingCountdown() {
  const bookings = useBookingStore(
  (state) => state.bookings
);

const nextBooking = useMemo(() => {
  const today = new Date();

  return bookings
    .filter(
      (booking) =>
        booking.bookingStatus !== "cancelled" &&
        new Date(booking.eventDate) >= today
    )
    .sort(
      (a, b) =>
        new Date(a.eventDate).getTime() -
        new Date(b.eventDate).getTime()
    )[0];
}, [bookings]);

const daysRemaining = useMemo(() => {
  if (!nextBooking) return 0;

  const today = new Date();

  const wedding = new Date(nextBooking.eventDate);

  return Math.ceil(
    (wedding.getTime() - today.getTime()) /
      (1000 * 60 * 60 * 24)
  );
}, [nextBooking]);
  return (
    <div className="rounded-3xl bg-gradient-to-br from-rose-500 to-pink-500 p-8 text-white shadow-xl">

      <div className="flex items-center gap-3">

        <CalendarDays />

        <h2 className="text-2xl font-semibold">
          Wedding Countdown
        </h2>

      </div>

      <h1 className="mt-10 text-7xl font-bold">
        {daysRemaining}
      </h1>

      <p className="text-3xl">
       {nextBooking
  ? "Days Remaining"
  : "No Upcoming Wedding"}
      </p>

      <div className="mt-12">

        <p className="uppercase tracking-[0.2em] text-rose-100">
          Wedding Date
        </p>

        <h3 className="mt-2 text-4xl font-semibold">
          {nextBooking
  ? new Date(
      nextBooking.eventDate
    ).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    })
  : "--"}
        </h3>

      </div>

    </div>
  );
}