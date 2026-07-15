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
        booking.createdAt
      );

      if (date >= todayStart) {
        today += booking.vendorNetAmount ?? 0;
      }

      if (date >= weekStart) {
        week += booking.vendorNetAmount ?? 0;
      }

      if (
        date.getMonth() === month &&
        date.getFullYear() === year
      ) {
        monthRevenue +=
          booking.vendorNetAmount ?? 0;
      }

      if (
        date.getFullYear() === year
      ) {
        yearRevenue +=
          booking.vendorNetAmount ?? 0;
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
    <section className="rounded-3xl border border-[#f4c8a0] bg-white/90 p-7 shadow-sm shadow-[#e4005a]/5">

      <h2 className="text-xl font-bold text-[#4d1730]">
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
    <div className="flex items-center justify-between rounded-2xl border border-[#ffe0a3] bg-[#fff8ef] px-4 py-3">

      <span className="text-[#946176]">
        {label}
      </span>

      <span className="font-semibold text-[#b00045]">
        ₹
        {value.toLocaleString(
          "en-IN"
        )}
      </span>

    </div>
  );
}
