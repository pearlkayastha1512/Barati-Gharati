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
    <div className="rounded-3xl border border-gray-200 bg-white shadow-sm">

      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-100 px-7 py-6">

        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Upcoming Bookings
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Your scheduled meetings & visits.
          </p>
        </div>

        <Link
          href="/customer/bookings"
          className="flex items-center gap-2 font-semibold text-rose-500 transition hover:text-rose-600"
        >
          View All
          <ArrowRight size={16} />
        </Link>

      </div>

      {/* Booking List */}
      <div className="divide-y divide-gray-100">

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
            className="flex items-center justify-between px-7 py-5 transition hover:bg-rose-50"
          >
            <div>
              <h3 className="font-semibold text-gray-900">
               {booking.vendorName}
              </h3>

              <p className="mt-1 text-sm text-gray-500">
               {booking.packageName}
              </p>

              <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-gray-500">

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
  className="rounded-xl bg-rose-500 px-5 py-2 text-sm font-semibold text-white transition hover:bg-rose-600"
>
  Details
</Link>
          </div>
        ))}

      </div>
    </div>
  );
}