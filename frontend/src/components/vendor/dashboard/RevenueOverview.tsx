"use client";

import { useMemo } from "react";

import { useBookingStore } from "@/store/bookingStore";

export default function RevenueOverview() {
  const bookings = useBookingStore(
    (state) => state.bookings
  );

  const revenue = useMemo(() => {
    const now = new Date();

    const todayStart = new Date(now);
    todayStart.setHours(0, 0, 0, 0);

    const weekStart = new Date(now);
    weekStart.setDate(
      now.getDate() - now.getDay()
    );
    weekStart.setHours(0, 0, 0, 0);

    const month = now.getMonth();
    const year = now.getFullYear();

    let today = 0;
    let week = 0;
    let monthRevenue = 0;
    let yearRevenue = 0;

    bookings.forEach((booking) => {
      if (
        booking.bookingStatus ===
        "cancelled"
      ) {
        return;
      }

      const date = new Date(
        booking.eventDate
      );

      if (date >= todayStart) {
        today += booking.advancePaid;
      }

      if (date >= weekStart) {
        week += booking.advancePaid;
      }

      if (
        date.getMonth() === month &&
        date.getFullYear() === year
      ) {
        monthRevenue +=
          booking.advancePaid;
      }

      if (
        date.getFullYear() === year
      ) {
        yearRevenue +=
          booking.advancePaid;
      }
    });

    return {
      today,
      week,
      monthRevenue,
      yearRevenue,
    };
  }, [bookings]);

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">

      <h2 className="text-xl font-bold text-slate-900">
        Revenue Overview
      </h2>

      <div className="mt-8 space-y-5">

        <Row
          label="Today"
          value={revenue.today}
        />

        <Row
          label="This Week"
          value={revenue.week}
        />

        <Row
          label="This Month"
          value={revenue.monthRevenue}
        />

        <Row
          label="This Year"
          value={revenue.yearRevenue}
        />

      </div>

    </section>
  );
}

function Row({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="flex items-center justify-between">

      <span className="text-slate-500">
        {label}
      </span>

      <span className="font-semibold text-slate-900">
        ₹
        {value.toLocaleString(
          "en-IN"
        )}
      </span>

    </div>
  );
}