


"use client";


import { useEffect, useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CalendarDays,
  Sparkles,
  Clock3,
  Wallet,
  Users,
  CheckCircle2,
  Building2,
} from "lucide-react";

import { useAuthStore } from "@/store/authStore";
import { useBookingStore } from "@/store/bookingStore";

export default function WelcomeHero() {
 const { user } = useAuthStore();

const {
  bookings,
  loadCustomerBookings,
} = useBookingStore();

useEffect(() => {
  if (user?._id) {
    loadCustomerBookings(user._id);
  }
}, [user, loadCustomerBookings]);

const totalGuests = useMemo(() => {
  return bookings.reduce(
    (sum, booking) => sum + (booking.guests || 0),
    0
  );
}, [bookings]);

const totalSpent = useMemo(() => {
  return bookings.reduce(
    (sum, booking) => sum + (booking.advancePaid || 0),
    0
  );
}, [bookings]);

const completedBookings = useMemo(() => {
  return bookings.filter(
    (booking) => booking.bookingStatus === "completed"
  ).length;
}, [bookings]);

// const progress = useMemo(() => {
//   if (!bookings.length) return 0;

//   return Math.round(
//     (completedBookings / bookings.length) * 100
//   );
// }, [bookings, completedBookings]);

const progress = useMemo(() => {
  // Total vendor categories needed for a complete wedding plan
  const TOTAL_REQUIRED_BOOKINGS = 6;

  return Math.min(
    Math.round((bookings.length / TOTAL_REQUIRED_BOOKINGS) * 100),
    100
  );
}, [bookings]);


const today = new Date();

const upcomingBooking = useMemo(() => {
  return bookings
    .filter((booking) => booking.eventDate)
    .sort(
      (a, b) =>
        new Date(a.eventDate).getTime() -
        new Date(b.eventDate).getTime()
    )
    .find(
      (booking) =>
        new Date(booking.eventDate).getTime() >= today.getTime()
    );
}, [bookings]);

const weddingDate = upcomingBooking
  ? new Date(upcomingBooking.eventDate)
  : null;

const daysRemaining = weddingDate
  ? Math.ceil(
      (weddingDate.getTime() - today.getTime()) /
        (1000 * 60 * 60 * 24)
    )
  : 0;

  const firstName = user?.name?.split(" ")[0] || "Guest";

  const hour = new Date().getHours();

  let greeting = "Good Evening 🌙";

  if (hour < 12) greeting = "Good Morning ☀️";
  else if (hour < 18) greeting = "Good Afternoon 🌤️";

  return (
    <motion.section
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-rose-500 via-pink-500 to-rose-600 px-8 py-8 text-white shadow-xl"
    >
      {/* Background Glow */}
      <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
      <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />

      <div className="relative z-10 flex flex-col gap-8 xl:flex-row xl:items-start xl:justify-between">
        {/* Left */}
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 backdrop-blur-md">
            <Sparkles size={16} />

            <span className="text-sm font-medium">
              {greeting}
            </span>
          </div>

          <h1 className="mt-5 text-4xl font-bold leading-tight xl:text-5xl">
            Welcome back,
            <br />
            {firstName} 👋
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-7 text-rose-100">
            Continue planning your dream wedding with trusted vendors,
            premium venues and unforgettable experiences.
          </p>

          {/* Buttons */}
          <div className="mt-7 flex flex-wrap gap-4">
            <Link
              href="/vendors"
              className="flex items-center gap-2 rounded-2xl bg-white px-6 py-3 font-semibold text-rose-600 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              Explore Vendors
              <ArrowRight size={18} />
            </Link>

            <Link
              href="/customer/planner"
              className="rounded-2xl border border-white/30 bg-white/10 px-6 py-3 font-semibold backdrop-blur-md transition hover:bg-white/20"
            >
              Wedding Planner
            </Link>

            <Link
              href="/customer/bookings"
              className="rounded-2xl border border-white/30 bg-white/10 px-6 py-3 font-semibold backdrop-blur-md transition hover:bg-white/20"
            >
              My Bookings
            </Link>
          </div>

          {/* Bottom Stats */}
          <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
            <div className="rounded-2xl bg-white/10 p-4 backdrop-blur-md">
              <Building2 className="mb-3" size={22} />

              <p className="text-3xl font-bold">
               {bookings.length}
              </p>

              <p className="mt-1 text-sm text-rose-100">
                Vendors Booked
              </p>
            </div>

            <div className="rounded-2xl bg-white/10 p-4 backdrop-blur-md">
              <Users className="mb-3" size={22} />

              <p className="text-3xl font-bold">
              {totalGuests}
              </p>

              <p className="mt-1 text-sm text-rose-100">
                Guests
              </p>
            </div>

            <div className="rounded-2xl bg-white/10 p-4 backdrop-blur-md">
              <Wallet className="mb-3" size={22} />

              <p className="text-3xl font-bold">
               ₹{totalSpent.toLocaleString("en-IN")}
              </p>

              <p className="mt-1 text-sm text-rose-100">
                Budget Used
              </p>
            </div>

            <div className="rounded-2xl bg-white/10 p-4 backdrop-blur-md">
              <CheckCircle2 className="mb-3" size={22} />

              <p className="text-3xl font-bold">
               {progress}%
              </p>

              <p className="mt-1 text-sm text-rose-100">
                Completed
              </p>
            </div>
          </div>
        </div>

        {/* Right Card */}
        <div className="w-full max-w-sm rounded-3xl border border-white/10 bg-white/10 p-6 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <CalendarDays size={22} />

            <h3 className="text-xl font-semibold">
              Wedding Countdown
            </h3>
          </div>

          <p className="mt-5 text-4xl font-bold">
           {weddingDate
  ? weddingDate.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })
  : "Not Scheduled"}
          </p>

          <div className="mt-5 flex items-center gap-2 text-lg">
            <Clock3 size={18} />

            <span>{weddingDate
  ? `${daysRemaining} Days Remaining`
  : "No upcoming wedding"}</span>
          </div>

          <div className="mt-8">
            <div className="mb-3 flex justify-between text-sm">
              <span>Planning Progress</span>

              <span className="font-semibold">
               {progress}%
              </span>
            </div>

            <div className="h-3 rounded-full bg-white/20">
              <div
  className="h-3 rounded-full bg-white transition-all duration-500"
  style={{
    width: `${progress}%`,
  }}
/>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-4">
            <div className="rounded-2xl bg-white/10 p-4">
              <p className="text-2xl font-bold">
                ₹{totalSpent.toLocaleString("en-IN")}
              </p>

              <p className="mt-1 text-sm text-rose-100">
                Budget Used
              </p>
            </div>

            <div className="rounded-2xl bg-white/10 p-4">
              
              <p className="mt-1 text-2xl text-rose-100">
                Happy Life
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}