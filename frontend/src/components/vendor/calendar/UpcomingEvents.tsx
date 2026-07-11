"use client";

import { useMemo } from "react";

import { CalendarDays } from "lucide-react";

import { useBookingStore } from "@/store/bookingStore";

export default function UpcomingEvents() {
  const bookings = useBookingStore(
    (state) => state.bookings
  );

  const upcomingBookings =
    useMemo(() => {
      return bookings
        .filter(
          (booking) =>
            booking.bookingStatus !==
              "cancelled" &&
            new Date(
              booking.eventDate
            ) >= new Date()
        )
        .sort(
          (a, b) =>
            new Date(
              a.eventDate
            ).getTime() -
            new Date(
              b.eventDate
            ).getTime()
        )
        .slice(0, 6);
    }, [bookings]);

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">

      <div className="mb-6 flex items-center justify-between">

        <h2 className="text-2xl font-bold text-slate-900">
          Upcoming Events
        </h2>

        <span className="rounded-full bg-rose-100 px-3 py-1 text-sm font-semibold text-rose-700">
          {upcomingBookings.length} Events
        </span>

      </div>

      {upcomingBookings.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 py-10 text-center">

          <CalendarDays
            size={42}
            className="mx-auto text-slate-400"
          />

          <p className="mt-4 font-semibold text-slate-700">
            No Upcoming Events
          </p>

          <p className="mt-2 text-sm text-slate-500">
            Upcoming accepted bookings will appear here.
          </p>

        </div>
      ) : (
        <div className="space-y-4">

          {upcomingBookings.map(
            (booking) => (
              <div
                key={booking.id}
                className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 p-5 transition hover:bg-slate-100"
              >
                <div>

                  <h3 className="font-semibold text-slate-900">
                    {booking.customerName}
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    {booking.eventType}
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    {booking.venue}
                  </p>

                </div>

                <div className="text-right">

                  <p className="font-semibold text-rose-700">
                    {new Date(
                      booking.eventDate
                    ).toLocaleDateString(
                      "en-GB",
                      {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      }
                    )}
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    {booking.eventTime}
                  </p>

                </div>

              </div>
            )
          )}

        </div>
      )}

    </section>
  );
}
