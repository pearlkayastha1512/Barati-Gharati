"use client";

import { useMemo } from "react";

import {
  Building2,
  CalendarDays,
  CheckCircle2,
  Clock3,
  XCircle,
} from "lucide-react";

import { useBookingStore } from "@/store/bookingStore";

export default function VendorStatus() {
  const bookings = useBookingStore(
    (state) => state.bookings
  );

  const vendors = useMemo(() => {
    return [...bookings].sort(
      (a, b) =>
        new Date(a.eventDate).getTime() -
        new Date(b.eventDate).getTime()
    );
  }, [bookings]);

  return (
    <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">

      <div className="mb-6 flex items-center gap-3">

        <div className="rounded-2xl bg-rose-100 p-3">

          <Building2
            size={22}
            className="text-rose-600"
          />

        </div>

        <div>

          <h3 className="font-semibold text-gray-900">
            Vendors
          </h3>

          <p className="text-sm text-gray-500">
            Booking Status
          </p>

        </div>

      </div>

      {vendors.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-200 py-10 text-center text-gray-500">
          No vendors booked yet.
        </div>
      ) : (
        <div className="space-y-4">

          {vendors.map((booking) => (
            <div
              key={booking.id}
              className="
                rounded-2xl
                border
                border-gray-100
                p-4
                transition
                hover:border-rose-200
                hover:bg-rose-50/30
              "
            >
              <div className="flex items-start justify-between">

                <div>

                  <h4 className="font-semibold text-gray-900">
                    {booking.vendorName}
                  </h4>

                  <p className="text-sm text-gray-500">
                    {booking.category}
                  </p>

                  <div className="mt-2 flex items-center gap-2 text-sm text-gray-500">

                    <CalendarDays size={15} />

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

                <div className="flex flex-col items-end gap-2">

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                      booking.bookingStatus ===
                      "completed"
                        ? "bg-blue-100 text-blue-700"
                        : booking.bookingStatus ===
                          "accepted"
                        ? "bg-green-100 text-green-700"
                        : booking.bookingStatus ===
                          "pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {booking.bookingStatus}
                  </span>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                      booking.paymentStatus ===
                      "paid"
                        ? "bg-green-100 text-green-700"
                        : booking.paymentStatus ===
                          "partial"
                        ? "bg-yellow-100 text-yellow-700"
                        : booking.paymentStatus ===
                          "refunded"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {booking.paymentStatus}
                  </span>

                  {booking.bookingStatus ===
                  "accepted" ? (
                    <CheckCircle2
                      size={20}
                      className="text-green-500"
                    />
                  ) : booking.bookingStatus ===
                    "pending" ? (
                    <Clock3
                      size={20}
                      className="text-yellow-500"
                    />
                  ) : booking.bookingStatus ===
                    "cancelled" ? (
                    <XCircle
                      size={20}
                      className="text-red-500"
                    />
                  ) : (
                    <CheckCircle2
                      size={20}
                      className="text-blue-500"
                    />
                  )}

                </div>

              </div>

            </div>
          ))}

        </div>
      )}

    </div>
  );
}