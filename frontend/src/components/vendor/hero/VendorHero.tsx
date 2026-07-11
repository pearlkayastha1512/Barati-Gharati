


"use client";

import { useMemo } from "react";

import { motion } from "framer-motion";

import Link from "next/link";

import {
  ArrowRight,
  BriefcaseBusiness,
  CalendarDays,
  IndianRupee,
} from "lucide-react";

import { useVendorProfile } from "@/hooks/useVendorProfile";
import { useBookingStore } from "@/store/bookingStore";

export default function VendorHero() {
  const { vendor } = useVendorProfile();

  const bookings = useBookingStore(
    (state) => state.bookings
  );

  const displayName =
    vendor?.ownerName ?? "Vendor";

  const currentMonth =
    new Date().getMonth();

  const currentYear =
    new Date().getFullYear();

  const {
    revenue,
    monthlyBookings,
    upcomingBookings,
    nextEvent,
  } = useMemo(() => {
    let revenue = 0;

    let monthlyBookings = 0;

    const upcoming = bookings.filter(
      (booking) =>
        new Date(
          booking.eventDate
        ) >= new Date() &&
        booking.bookingStatus !==
          "cancelled"
    );

    bookings.forEach((booking) => {
      const bookingDate = new Date(
        booking.createdAt
      );

      if (
  bookingDate.getMonth() === currentMonth &&
  bookingDate.getFullYear() === currentYear &&
  booking.bookingStatus !== "cancelled"
) {
  monthlyBookings++;

  revenue += booking.advancePaid;
}
    });

    const nextEvent =
      upcoming.sort(
        (a, b) =>
          new Date(
            a.eventDate
          ).getTime() -
          new Date(
            b.eventDate
          ).getTime()
      )[0];

    return {
      revenue,

      monthlyBookings,

      upcomingBookings:
        upcoming.length,

      nextEvent,
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
        y: 20,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.5,
      }}
      className="relative overflow-hidden rounded-[32px] border border-[#ffc43d]/40 bg-[linear-gradient(135deg,#e4005a_0%,#c90055_42%,#ffb703_100%)] p-10 text-white shadow-xl shadow-[#e4005a]/20"
    >
      <div
        aria-hidden
        className="absolute inset-0 opacity-20 [background-image:linear-gradient(45deg,rgba(255,255,255,0.35)_1px,transparent_1px),linear-gradient(-45deg,rgba(255,255,255,0.2)_1px,transparent_1px)] [background-size:28px_28px]"
      />

      <div className="relative z-10 flex flex-col gap-10 lg:flex-row lg:justify-between">

        <div>

          <div className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/15 px-4 py-2 shadow-sm backdrop-blur">

            <BriefcaseBusiness
              size={16}
            />

            Vendor Dashboard

          </div>

          <h1 className="mt-6 text-5xl font-bold">

            Welcome back,

            <br />

            {displayName}

          </h1>

          <p className="mt-6 max-w-xl text-lg text-white/85">

            Manage your bookings,
            earnings, services and
            grow your business.

          </p>

          <div className="mt-8 flex flex-wrap gap-4">

            <Link
              href="/vendor/services"
              className="flex items-center gap-2 rounded-2xl bg-white px-6 py-4 font-semibold text-[#b00045] transition hover:-translate-y-1 hover:bg-[#fff8ef]"
            >
              Manage Services

              <ArrowRight
                size={18}
              />
            </Link>

            <Link
              href="/vendor/calendar"
              className="rounded-2xl border border-white/35 bg-white/15 px-6 py-4 font-semibold backdrop-blur hover:bg-white/25"
            >
              Open Calendar
            </Link>

          </div>

        </div>

        <div className="w-full max-w-sm rounded-3xl border border-white/30 bg-white/18 p-6 shadow-lg backdrop-blur">

          <div className="flex items-center gap-3">

            <IndianRupee
              size={22}
            />

            <h3 className="text-xl font-semibold">
              This Month
            </h3>

          </div>

          <div className="mt-6 space-y-5">

            <div className="flex justify-between">

              <span>Revenue</span>

              <span className="font-semibold">

                ₹
                {revenue.toLocaleString(
                  "en-IN"
                )}

              </span>

            </div>

            <div className="flex justify-between">

              <span>Bookings</span>

              <span className="font-semibold">

                {monthlyBookings}

              </span>

            </div>

            <div className="flex justify-between">

              <span>Upcoming</span>

              <span className="font-semibold">

                {upcomingBookings}

              </span>

            </div>

          </div>

          <div className="mt-8 flex items-center gap-3">

            <CalendarDays
              size={18}
            />

            {nextEvent
              ? `Next Event: ${new Date(
                  nextEvent.eventDate
                ).toLocaleDateString(
                  "en-GB",
                  {
                    day: "2-digit",
                    month: "short",
                  }
                )}`
              : "No Upcoming Events"}

          </div>

        </div>

      </div>

    </motion.section>
  );
}
