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
    <div className="rounded-3xl border border-[#ffb3bf] bg-[#fffdf0] p-6 shadow-sm">

      <div className="mb-6 flex items-center gap-3">

        <div className="rounded-2xl bg-[#ffe6eb] p-3">

          <Building2
            size={22}
            className="text-[#ff4d6d]"
          />

        </div>

        <div>

          <h3 className="font-semibold text-[#3f1d2f]">
            Vendors
          </h3>

          <p className="text-sm text-[#8d6171]">
            Booking Status
          </p>

        </div>

      </div>

      {vendors.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#ffb3bf] py-10 text-center text-[#8d6171]">
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
                border-[#fff3b0]
                p-4
                transition
                hover:border-[#ff8fa1]
                hover:bg-[#ffe6eb]/30
              "
            >
              <div className="flex items-start justify-between">

                <div>

                  <h4 className="font-semibold text-[#3f1d2f]">
                    {booking.vendorName}
                  </h4>

                  <p className="text-sm text-[#8d6171]">
                    {booking.category}
                  </p>

                  <div className="mt-2 flex items-center gap-2 text-sm text-[#8d6171]">

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
                        ? "bg-[#ffe6eb] text-[#ff4d6d]"
                        : booking.bookingStatus ===
                          "accepted"
                        ? "bg-[#fff8d8] text-[#111111]"
                        : booking.bookingStatus ===
                          "pending"
                        ? "bg-[#fff3b0] text-[#111111]"
                        : "bg-[#ffe6eb] text-[#e63b5f]"
                    }`}
                  >
                    {booking.bookingStatus}
                  </span>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                      booking.paymentStatus ===
                      "paid"
                        ? "bg-[#fff8d8] text-[#111111]"
                        : booking.paymentStatus ===
                          "partial"
                        ? "bg-[#fff3b0] text-[#111111]"
                        : booking.paymentStatus ===
                          "refunded"
                        ? "bg-[#ffe6eb] text-[#ff4d6d]"
                        : "bg-[#ffe6eb] text-[#e63b5f]"
                    }`}
                  >
                    {booking.paymentStatus}
                  </span>

                  {booking.bookingStatus ===
                  "accepted" ? (
                    <CheckCircle2
                      size={20}
                      className="text-[#ff4d6d]"
                    />
                  ) : booking.bookingStatus ===
                    "pending" ? (
                    <Clock3
                      size={20}
                      className="text-[#ff4d6d]"
                    />
                  ) : booking.bookingStatus ===
                    "cancelled" ? (
                    <XCircle
                      size={20}
                      className="text-[#e63b5f]"
                    />
                  ) : (
                    <CheckCircle2
                      size={20}
                      className="text-[#ff8fa1]"
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