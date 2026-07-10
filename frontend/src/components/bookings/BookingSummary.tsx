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
        color: "bg-[#ffe6eb] text-[#ff4d6d]",
      },
      {
        title: "Upcoming",
        value: upcoming.toString(),
        subtitle: "Scheduled bookings",
        icon: Clock3,
        color: "bg-[#fff3b0] text-[#111111]",
      },
      {
        title: "Completed",
        value: completed.toString(),
        subtitle: "Successfully completed",
        icon: CheckCircle2,
        color: "bg-[#fff8d8] text-[#111111]",
      },
      {
        title: "Cancelled",
        value: cancelled.toString(),
        subtitle: "Cancelled bookings",
        icon: XCircle,
        color: "bg-[#ffe6eb] text-[#e63b5f]",
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
              border-[#ffb3bf]
              bg-[#fffdf0]
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

              <span className="rounded-full bg-[#fff8d8] px-3 py-1 text-xs font-semibold text-[#8d6171]">
                Live
              </span>
            </div>

            <h3 className="mt-6 text-sm text-[#8d6171]">
              {item.title}
            </h3>

            <p className="mt-2 text-4xl font-bold text-[#3f1d2f]">
              {item.value}
            </p>

            <p className="mt-2 text-sm text-[#8d6171]">
              {item.subtitle}
            </p>
          </motion.div>
        );
      })}
    </section>
  );
}