"use client";

import { useMemo } from "react";

import {
  CalendarDays,
  CheckCircle2,
  Clock3,
} from "lucide-react";

import { useBookingStore } from "@/store/bookingStore";

export default function UpcomingBookings() {
  const bookings = useBookingStore(
    (state) => state.bookings
  );

  const upcomingBookings = useMemo(() => {
    const today = new Date();

    return bookings
      .filter(
        (booking) =>
          booking.bookingStatus !==
            "cancelled" &&
          new Date(
            booking.eventDate
          ) >= today
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
      .slice(0, 5);
  }, [bookings]);

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">

      <h2 className="text-xl font-bold text-slate-900">
        Upcoming Bookings
      </h2>

      <p className="mt-2 text-slate-500">
        Your next scheduled wedding events.
      </p>

      <div className="mt-8 space-y-5">

        {upcomingBookings.length ===
        0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 py-10 text-center text-slate-500">
            No upcoming bookings.
          </div>
        ) : (
          upcomingBookings.map(
            (booking) => (
              <div
                key={booking.id}
                className="flex items-center justify-between rounded-2xl bg-slate-50 p-5 transition hover:bg-slate-100"
              >
                <div>

                  <h3 className="font-semibold text-slate-900">
                    {
                      booking.customerName
                    }
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    {
                      booking.category
                    }
                    {" • "}
                    {
                      booking.packageName
                    }
                  </p>

                  <div className="mt-3 flex items-center gap-2 text-sm text-slate-500">

                    <CalendarDays
                      size={15}
                    />

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

                  </div>

                </div>

                <div className="text-right">

                  <div
                    className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium ${
                      booking.bookingStatus ===
                        "accepted" ||
                      booking.bookingStatus ===
                        "completed"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {booking.bookingStatus ===
                      "accepted" ||
                    booking.bookingStatus ===
                      "completed" ? (
                      <CheckCircle2
                        size={16}
                      />
                    ) : (
                      <Clock3
                        size={16}
                      />
                    )}

                    {
                      booking.bookingStatus
                    }

                  </div>

                </div>

              </div>
            )
          )
        )}

      </div>

    </section>
  );
}