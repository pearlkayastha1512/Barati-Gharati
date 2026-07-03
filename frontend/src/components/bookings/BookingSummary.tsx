"use client";

import { useMemo } from "react";

import { motion } from "framer-motion";
import {
  CalendarCheck,
  Clock3,
  CheckCircle2,
  XCircle,
} from "lucide-react";

import { useBookingStore } from "@/store/bookingStore";

export default function BookingSummary() {
  const bookings = useBookingStore(
    (state) => state.bookings
  );

  const stats = useMemo(() => {
    const today = new Date();

    const total = bookings.length;

    const upcoming = bookings.filter(
      (booking) =>
        booking.bookingStatus !== "cancelled" &&
        new Date(booking.eventDate) >= today
    ).length;

    const completed = bookings.filter(
      (booking) =>
        booking.bookingStatus === "completed"
    ).length;

    const cancelled = bookings.filter(
      (booking) =>
        booking.bookingStatus === "cancelled"
    ).length;

    return [
      {
        title: "Total Bookings",
        value: total.toString(),
        subtitle: "All vendor bookings",
        icon: CalendarCheck,
        color: "bg-indigo-100 text-indigo-600",
      },
      {
        title: "Upcoming",
        value: upcoming.toString(),
        subtitle: "Scheduled bookings",
        icon: Clock3,
        color: "bg-yellow-100 text-yellow-600",
      },
      {
        title: "Completed",
        value: completed.toString(),
        subtitle: "Successfully completed",
        icon: CheckCircle2,
        color: "bg-green-100 text-green-600",
      },
      {
        title: "Cancelled",
        value: cancelled.toString(),
        subtitle: "Cancelled bookings",
        icon: XCircle,
        color: "bg-red-100 text-red-600",
      },
    ];
  }, [bookings]);

  return (
    <section className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((item, index) => {
        const Icon = item.icon;

        return (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: index * 0.08,
            }}
            className="
              rounded-3xl
              border
              border-gray-200
              bg-white
              p-6
              shadow-sm
              transition-all
              duration-300
              hover:-translate-y-1
              hover:shadow-xl
            "
          >
            <div className="flex items-start justify-between">
              <div
                className={`rounded-2xl p-3 ${item.color}`}
              >
                <Icon size={24} />
              </div>

              <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-500">
                Live
              </span>
            </div>

            <h3 className="mt-6 text-sm text-gray-500">
              {item.title}
            </h3>

            <p className="mt-2 text-4xl font-bold text-gray-900">
              {item.value}
            </p>

            <p className="mt-2 text-sm text-gray-500">
              {item.subtitle}
            </p>
          </motion.div>
        );
      })}
    </section>
  );
}