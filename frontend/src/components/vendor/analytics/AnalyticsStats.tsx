"use client";

import { useMemo } from "react";

import {
  Eye,
  Users,
  TrendingUp,
  Star,
} from "lucide-react";

import { useBookingStore } from "@/store/bookingStore";
import { useReviewStore } from "@/store/reviewStore";

export default function AnalyticsStats() {
  const bookings = useBookingStore(
    (state) => state.bookings
  );

  const reviews = useReviewStore(
    (state) => state.reviews
  );

  const stats = useMemo(() => {
    const uniqueCustomers =
      new Set(
        bookings.map(
          (booking) => booking.customerId
        )
      ).size;

    const currentDate = new Date();

    const currentMonth =
      currentDate.getMonth();

    const currentYear =
      currentDate.getFullYear();

    const currentMonthBookings =
      bookings.filter((booking) => {
        const date = new Date(
          booking.createdAt
        );

        return (
          date.getMonth() ===
            currentMonth &&
          date.getFullYear() ===
            currentYear
        );
      }).length;

    const previousMonthDate =
      new Date(
        currentYear,
        currentMonth - 1,
        1
      );

    const previousMonthBookings =
      bookings.filter((booking) => {
        const date = new Date(
          booking.createdAt
        );

        return (
          date.getMonth() ===
            previousMonthDate.getMonth() &&
          date.getFullYear() ===
            previousMonthDate.getFullYear()
        );
      }).length;

    let growth = 0;

    if (
      previousMonthBookings > 0
    ) {
      growth = Math.round(
        ((currentMonthBookings -
          previousMonthBookings) /
          previousMonthBookings) *
          100
      );
    } else if (
      currentMonthBookings > 0
    ) {
      growth = 100;
    }

    const averageRating =
      reviews.length > 0
        ? (
            reviews.reduce(
              (
                sum,
                review
              ) =>
                sum +
                review.rating,
              0
            ) / reviews.length
          ).toFixed(1)
        : "0.0";

    // Temporary simulated profile views
    const profileViews =
      uniqueCustomers * 35 +
      reviews.length * 12 +
      bookings.length * 18;

    return [
      {
        title:
          "Profile Views",
        value:
          profileViews.toLocaleString(),
        icon: Eye,
        bg: "bg-[#ffe1ec]",
        color:
          "text-[#e4005a]",
      },
      {
        title: "Customers",
        value:
          uniqueCustomers.toString(),
        icon: Users,
        bg: "bg-green-100",
        color:
          "text-green-700",
      },
      {
        title: "Growth",
        value: `${growth >= 0 ? "+" : ""}${growth}%`,
        icon: TrendingUp,
        bg: "bg-[#ffe1ec]",
        color:
          "text-[#e4005a]",
      },
      {
        title: "Rating",
        value: averageRating,
        icon: Star,
        bg: "bg-amber-100",
        color:
          "text-amber-600",
      },
    ];
  }, [bookings, reviews]);

  return (
    <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
      {stats.map((item) => {
        const Icon = item.icon;

        return (
          <div
            key={item.title}
            className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
          >
            <div
              className={`w-fit rounded-2xl p-3 ${item.bg}`}
            >
              <Icon
                size={22}
                className={
                  item.color
                }
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