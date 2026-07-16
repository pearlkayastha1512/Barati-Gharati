"use client";

import { useMemo } from "react";

import {
  Wallet,
  TrendingUp,
  CreditCard,
  IndianRupee,
} from "lucide-react";

import { useBookingStore } from "@/store/bookingStore";
import { getBookingRevenueDate } from "@/utils/bookingRevenue";

export default function EarningsStats() {
  const bookings = useBookingStore(
    (state) => state.bookings
  );

  const currentMonth = new Date().getMonth();

  const currentYear = new Date().getFullYear();

  const stats = useMemo(() => {
    let totalRevenue = 0;

    let monthlyRevenue = 0;

    let pendingAmount = 0;

    bookings.forEach((booking) => {
      if (
        booking.bookingStatus ===
        "cancelled"
      ) {
        return;
      }

      totalRevenue +=
        booking.vendorNetAmount ?? 0;

      pendingAmount +=
        booking.remainingAmount;

      const bookingDate =
        getBookingRevenueDate(booking);

      if (
        bookingDate.getMonth() ===
          currentMonth &&
        bookingDate.getFullYear() ===
          currentYear
      ) {
        monthlyRevenue +=
          booking.vendorNetAmount ?? 0;
      }
    });

    const averageBooking =
      bookings.filter(
        (booking) =>
          booking.bookingStatus !== "cancelled"
      ).length > 0
        ? Math.round(
            totalRevenue /
              bookings.filter(
                (booking) =>
                  booking.bookingStatus !==
                  "cancelled"
              ).length
          )
        : 0;

    return [
      {
        title: "Total Revenue",
        value: `₹${totalRevenue.toLocaleString(
          "en-IN"
        )}`,
        icon: Wallet,
      },
      {
        title: "This Month",
        value: `₹${monthlyRevenue.toLocaleString(
          "en-IN"
        )}`,
        icon: TrendingUp,
      },
      {
        title: "Pending",
        value: `₹${pendingAmount.toLocaleString(
          "en-IN"
        )}`,
        icon: CreditCard,
      },
      {
        title: "Average Booking",
        value: `₹${averageBooking.toLocaleString(
          "en-IN"
        )}`,
        icon: IndianRupee,
      },
    ];
  }, [
    bookings,
    currentMonth,
    currentYear,
  ]);

  return (
    <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

      {stats.map((item) => {
        const Icon = item.icon;

        return (
          <div
            key={item.title}
            className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
          >

            <div className="w-fit rounded-2xl bg-[#ffe1ec] p-3">

              <Icon
                size={22}
                className="text-[#e4005a]"
              />

            </div>

            <p className="mt-5 text-sm font-medium text-slate-500">
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
