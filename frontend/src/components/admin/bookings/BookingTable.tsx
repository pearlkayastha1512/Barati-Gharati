"use client";

import { Eye } from "lucide-react";

import { Booking } from "@/types/booking";

interface Props {
  bookings: Booking[];

  onView: (booking: Booking) => void;
}

export default function BookingTable({
  bookings,
  onView,
}: Props) {
  if (bookings.length === 0) {
    return (
      <section className="rounded-3xl border border-slate-200 bg-white p-20 text-center shadow-sm">
        <h2 className="text-2xl font-bold text-slate-700">
          No Bookings Found
        </h2>

        <p className="mt-3 text-slate-500">
          Try changing the filters.
        </p>
      </section>
    );
  }

  return (
    <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-slate-50">
            <tr className="text-left">
              <th className="px-6 py-4 font-semibold text-slate-700">
                Booking
              </th>

              <th className="px-6 py-4 font-semibold text-slate-700">
                Customer
              </th>

              <th className="px-6 py-4 font-semibold text-slate-700">
                Vendor
              </th>

              <th className="px-6 py-4 font-semibold text-slate-700">
                Event Date
              </th>

              <th className="px-6 py-4 font-semibold text-slate-700">
                Amount
              </th>

              <th className="px-6 py-4 font-semibold text-slate-700">
                Payment
              </th>

              <th className="px-6 py-4 font-semibold text-slate-700">
                Booking
              </th>

              <th className="px-6 py-4 font-semibold text-slate-700">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="text-slate-600">
            {bookings.map((booking) => (
              <tr
                key={booking.id}
                className="border-t border-slate-100 hover:bg-slate-50"
              >
                <td className="px-6 py-5">
                  <div>
                    <h3 className="font-semibold text-slate-900">
                      {booking.bookingNumber}
                    </h3>

                    <p className="text-sm text-slate-500">
                      {booking.eventType}
                    </p>
                  </div>
                </td>

                <td className="px-6 py-5">
                  {booking.customerName}
                </td>

                <td className="px-6 py-5">
                  {booking.vendorName}
                </td>

                <td className="px-6 py-5">
                  {new Date(
                    booking.eventDate
                  ).toLocaleDateString()}
                </td>

                <td className="px-6 py-5 font-semibold text-slate-900">
                  ₹
                  {booking.amount.toLocaleString(
                    "en-IN"
                  )}
                </td>

                {/* Payment Status */}

                <td className="px-6 py-5">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      booking.paymentStatus ===
                      "paid"
                        ? "bg-green-100 text-green-700"
                        : booking.paymentStatus ===
                          "partial"
                        ? "bg-blue-100 text-blue-700"
                        : booking.paymentStatus ===
                          "refunded"
                        ? "bg-red-100 text-red-700"
                        : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {booking.paymentStatus}
                  </span>
                </td>

                {/* Booking Status */}

                <td className="px-6 py-5">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      booking.bookingStatus ===
                      "accepted"
                        ? "bg-green-100 text-green-700"
                        : booking.bookingStatus ===
                          "completed"
                        ? "bg-blue-100 text-blue-700"
                        : booking.bookingStatus ===
                          "cancelled"
                        ? "bg-red-100 text-red-700"
                        : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {booking.bookingStatus}
                  </span>
                </td>

                <td className="px-6 py-5">
                  <button
                    onClick={() =>
                      onView(booking)
                    }
                    className="rounded-xl bg-slate-100 p-2 transition hover:bg-slate-200"
                  >
                    <Eye size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}