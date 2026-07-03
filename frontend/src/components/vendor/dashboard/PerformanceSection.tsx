"use client";

import { useMemo } from "react";

import { useBookingStore } from "@/store/bookingStore";

export default function PerformanceSection() {
  const bookings = useBookingStore(
    (state) => state.bookings
  );

  const metrics = useMemo(() => {
    const totalBookings =
      bookings.length;

    const pendingBookings =
      bookings.filter(
        (booking) =>
          booking.bookingStatus ===
          "pending"
      ).length;

    const acceptedBookings =
      bookings.filter(
        (booking) =>
          booking.bookingStatus ===
            "accepted" ||
          booking.bookingStatus ===
            "completed"
      ).length;

    const conversionRate =
      totalBookings === 0
        ? 0
        : Math.round(
            (acceptedBookings /
              totalBookings) *
              100
          );

    return [
      {
        title: "Total Bookings",
        value:
          totalBookings.toString(),
      },
      {
        title: "Pending Requests",
        value:
          pendingBookings.toString(),
      },
      {
        title: "Conversion Rate",
        value: `${conversionRate}%`,
      },
      {
        title:
          "Customer Satisfaction",
        value: "4.9 ★",
      },
    ];
  }, [bookings]);

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">

      <h2 className="text-2xl font-bold text-slate-900">
        Business Performance
      </h2>

      <p className="mt-2 text-slate-500">
        Live insights based on your
        bookings.
      </p>

      <div className="mt-8 grid gap-5 md:grid-cols-2">

        {metrics.map((metric) => (
          <div
            key={metric.title}
            className="rounded-2xl bg-slate-50 p-5 transition hover:bg-slate-100"
          >
            <p className="text-sm text-slate-500">
              {metric.title}
            </p>

            <p className="mt-2 text-3xl font-bold text-slate-900">
              {metric.value}
            </p>
          </div>
        ))}

      </div>

    </section>
  );
}