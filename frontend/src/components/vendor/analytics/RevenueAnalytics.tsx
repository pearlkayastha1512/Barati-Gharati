"use client";

import { useMemo } from "react";

import {
  TrendingUp,
  TrendingDown,
} from "lucide-react";

import { useBookingStore } from "@/store/bookingStore";

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export default function RevenueAnalytics() {
  const bookings = useBookingStore(
    (state) => state.bookings
  );

  const currentYear =
    new Date().getFullYear();

  const revenueData = useMemo(() => {
    const monthlyRevenue =
      new Array(12).fill(0);

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

      if (
        date.getFullYear() !==
        currentYear
      ) {
        return;
      }

      monthlyRevenue[
        date.getMonth()
      ] += booking.advancePaid;
    });

    return months.map(
      (month, index) => {
        const revenue =
          monthlyRevenue[index];

        const previous =
          index === 0
            ? revenue
            : monthlyRevenue[
                index - 1
              ];

        const growth =
          previous === 0
            ? revenue > 0
              ? 100
              : 0
            : Math.round(
                ((revenue -
                  previous) /
                  previous) *
                  100
              );

        return {
          month,
          revenue,
          growth,
        };
      }
    );
  }, [bookings, currentYear]);

  const topMonth =
    revenueData.reduce(
      (best, current) =>
        current.revenue >
        best.revenue
          ? current
          : best,
      revenueData[0]
    );

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">

      <div className="flex items-center justify-between">

        <div>

          <h2 className="text-2xl font-bold text-slate-900">
            Revenue Growth
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Monthly earnings overview
          </p>

        </div>

        <div className="rounded-xl bg-green-50 px-4 py-2 text-sm font-semibold text-green-700">

          Best Month • {topMonth.month}

        </div>

      </div>

      <div className="mt-8 space-y-5">

        {revenueData
          .filter(
            (item) =>
              item.revenue > 0
          )
          .map((item) => (
            <Row
              key={item.month}
              label={item.month}
              value={`₹${item.revenue.toLocaleString(
                "en-IN"
              )}`}
              growth={item.growth}
            />
          ))}

        {revenueData.every(
          (item) =>
            item.revenue === 0
        ) && (
          <div className="rounded-2xl bg-slate-50 py-12 text-center text-slate-500">
            No revenue available yet.
          </div>
        )}

      </div>

    </section>
  );
}

function Row({
  label,
  value,
  growth,
}: {
  label: string;
  value: string;
  growth: number;
}) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-slate-100 p-4 transition hover:bg-slate-50">

      <div>

        <p className="font-semibold text-slate-900">
          {label}
        </p>

        <p className="mt-1 text-sm text-slate-500">
          Revenue
        </p>

      </div>

      <div className="flex items-center gap-5">

        <span className="text-lg font-bold text-blue-700">
          {value}
        </span>

        <div
          className={`flex items-center gap-1 rounded-full px-3 py-1 text-sm font-semibold ${
            growth >= 0
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {growth >= 0 ? (
            <TrendingUp size={16} />
          ) : (
            <TrendingDown size={16} />
          )}

          {growth >= 0
            ? "+"
            : ""}
          {growth}%
        </div>

      </div>

    </div>
  );
}