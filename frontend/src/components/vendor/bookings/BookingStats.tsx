"use client";

import { useMemo } from "react";

import {
  CalendarCheck2,
  Clock3,
  CheckCircle2,
  Wallet,
} from "lucide-react";

import { useBookingStore } from "@/store/bookingStore";

export default function BookingStats() {
  const bookings = useBookingStore(
    (state) => state.bookings
  );

  const stats = useMemo(() => {
    const totalBookings =
      bookings.length;

    const pendingBookings =
      bookings.filter(
        (booking) =>
          booking.bookingStatus ===
          "pending"
      ).length;

    const completedBookings =
      bookings.filter(
        (booking) =>
          booking.bookingStatus ===
            "completed" ||
          booking.bookingStatus ===
            "accepted"
      ).length;

    const revenue =
      bookings.reduce(
        (sum, booking) =>
          booking.bookingStatus ===
          "cancelled"
            ? sum
            : sum +
              (booking.vendorNetAmount ?? 0),
        0
      );

    return [
      {
        title: "Total",
        value:
          totalBookings.toString(),
        icon: CalendarCheck2,
        color:
          "bg-[#ffe1ec] text-[#e4005a]",
      },
      {
        title: "Pending",
        value:
          pendingBookings.toString(),
        icon: Clock3,
        color:
          "bg-yellow-100 text-yellow-700",
      },
      {
        title: "Completed",
        value:
          completedBookings.toString(),
        icon: CheckCircle2,
        color:
          "bg-green-100 text-green-700",
      },
      {
        title: "Revenue",
        value: `₹${revenue.toLocaleString(
          "en-IN"
        )}`,
        icon: Wallet,
        color:
          "bg-emerald-100 text-emerald-700",
      },
    ];
  }, [bookings]);

  return (
    <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

      {stats.map((item) => {
        const Icon = item.icon;

        return (
          <div
            key={item.title}
            className="
              rounded-3xl
              border
              border-slate-200
              bg-white
              p-6
              shadow-sm
              transition-all
              duration-300
              hover:-translate-y-1
              hover:shadow-xl
            "
          >
            <div
              className={`w-fit rounded-2xl p-3 ${item.color}`}
            >
              <Icon size={24} />
            </div>

            <p className="mt-5 text-sm text-slate-500">
              {item.title}
            </p>

            <h3 className="mt-2 text-4xl font-bold text-slate-900">
              {item.value}
            </h3>
          </div>
        );
      })}

    </section>
  );
}
