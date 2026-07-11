"use client";

import { useMemo } from "react";

import { motion } from "framer-motion";

import {
  CalendarDays,
  CalendarCheck2,
} from "lucide-react";

import { useBookingStore } from "@/store/bookingStore";

export default function CalendarHero() {
  const bookings = useBookingStore(
    (state) => state.bookings
  );

  const currentMonth =
    new Date().getMonth();

  const currentYear =
    new Date().getFullYear();

  const stats = useMemo(() => {
    const monthlyBookings =
      bookings.filter((booking) => {
        const date = new Date(
          booking.eventDate
        );

        return (
          date.getMonth() ===
            currentMonth &&
          date.getFullYear() ===
            currentYear &&
          booking.bookingStatus !==
            "cancelled"
        );
      });

    const nextEvent =
      bookings
        .filter(
          (booking) =>
            new Date(
              booking.eventDate
            ) >= new Date() &&
            booking.bookingStatus !==
              "cancelled"
        )
        .sort(
          (a, b) =>
            new Date(
              a.eventDate
            ).getTime() -
            new Date(
              b.eventDate
            ).getTime()
        )[0];

    return {
      monthly:
        monthlyBookings.length,

      nextEvent:
        nextEvent
          ? new Date(
              nextEvent.eventDate
            ).toLocaleDateString(
              "en-GB",
              {
                day: "2-digit",
                month: "short",
              }
            )
          : "No Events",
    };
  }, [
    bookings,
    currentMonth,
    currentYear,
  ]);

  return (
    <motion.section
      initial={{
        opacity: 0,
        y: 15,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      className="rounded-[32px] bg-gradient-to-r from-[#4d1730] via-[#e4005a] to-[#ffc43d] p-8 text-white shadow-xl shadow-[#e4005a]/15"
    >
      <div className="flex flex-col gap-8 lg:flex-row lg:justify-between">

        <div>

          <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2">

            <CalendarDays size={16} />

            Event Calendar

          </div>

          <h1 className="mt-5 text-5xl font-bold">
            Organize your
            <br />
            wedding schedule.
          </h1>

          <p className="mt-5 max-w-xl text-rose-50">
            Track bookings, block dates and manage your availability.
          </p>

        </div>

        <div className="rounded-3xl bg-white/10 p-6 backdrop-blur">

          <div className="flex items-center gap-3">

            <CalendarCheck2 />

            <h3 className="text-xl font-semibold">
              Calendar Overview
            </h3>

          </div>

          <div className="mt-6 space-y-5">

            <div className="flex justify-between">

              <span>
                This Month
              </span>

              <span className="font-semibold">
                {stats.monthly}
              </span>

            </div>

            <div className="flex justify-between">

              <span>
                Next Event
              </span>

              <span className="font-semibold">
                {stats.nextEvent}
              </span>

            </div>

          </div>

        </div>

      </div>
    </motion.section>
  );
}
