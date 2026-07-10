"use client";

import Link from "next/link";
import {
  CalendarDays,
  Clock3,
  MapPin,
  ArrowRight,
} from "lucide-react";
import { useBookingStore } from "@/store/bookingStore";



export default function UpcomingBookings() {
  const bookings = useBookingStore(
  (state) => state.bookings
);
  return (
    <div className="rounded-3xl border border-[#ffb3bf] bg-white/90 shadow-sm shadow-[#ff4d6d]/5">

      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#ffcad3] px-7 py-6">

        <div>
          <h2 className="text-2xl font-bold text-[#3f1d2f]">
            Upcoming Wedding Stops
          </h2>

          <p className="mt-1 text-sm text-[#8d6171]">
            Your next vendor visits and celebration checkpoints.
          </p>
        </div>

        <Link
          href="/customer/bookings"
          className="flex items-center gap-2 font-semibold text-[#ff4d6d] transition hover:text-[#ff4d6d]"
        >
          View All
          <ArrowRight size={16} />
        </Link>

      </div>

      {/* Booking List */}
      <div className="divide-y divide-[#fff6c7]">

       {bookings
  .filter(
    (booking) =>
      booking.bookingStatus !== "cancelled"
  )
  .sort(
    (a, b) =>
      new Date(a.eventDate).getTime() -
      new Date(b.eventDate).getTime()
  )
  .slice(0, 5)
  .map((booking) => (
          <div
            key={booking.id}
            className="flex items-center justify-between px-7 py-5 transition hover:bg-[#ffe6eb]"
          >
            <div>
              <h3 className="font-semibold text-[#3f1d2f]">
               {booking.vendorName}
              </h3>

              <p className="mt-1 text-sm text-[#8d6171]">
               {booking.packageName}
              </p>

              <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-[#8d6171]">

                <span className="flex items-center gap-1">
                  <CalendarDays size={15} />
                 {new Date(
  booking.eventDate
).toLocaleDateString("en-GB", {
  day: "2-digit",
  month: "short",
  year: "numeric",
})}
                </span>

                <span className="flex items-center gap-1">
                  <Clock3 size={15} />
                  {booking.eventTime}
                </span>

                <span className="flex items-center gap-1">
                  <MapPin size={15} />
                  {booking.venue}
                </span>

              </div>
            </div>

           <Link
  href={`/customer/bookings/${booking.id}`}
  className="rounded-xl bg-[#ff4d6d] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#e63b5f]"
>
  Details
</Link>
          </div>
        ))}

      </div>
    </div>
  );
}
