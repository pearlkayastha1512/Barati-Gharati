"use client";

import { X, CalendarDays, Wallet } from "lucide-react";

import { useBookingStore } from "@/store/bookingStore";

interface Props {
  open: boolean;
  onClose: () => void;
}

function badge(status: string) {
  switch (status) {
    case "paid":
      return "bg-green-100 text-green-700";

    case "partial":
      return "bg-yellow-100 text-yellow-700";

    default:
      return "bg-slate-100 text-slate-700";
  }
}

export default function PayoutDetailsModal({
  open,
  onClose,
}: Props) {
  const bookings = useBookingStore(
    (state) => state.bookings
  );

  if (!open) return null;

  const payoutBookings = bookings.filter(
    (booking) =>
      booking.bookingStatus !==
        "cancelled" &&
      (booking.paymentStatus ===
        "paid" ||
        booking.paymentStatus ===
          "partial")
  );

  const totalPayout =
    payoutBookings.reduce(
      (sum, booking) =>
        sum + (booking.vendorNetAmount ?? 0),
      0
    );

  const today = new Date();

  const payoutDate = new Date(
    today.getFullYear(),
    today.getMonth(),
    15
  );

  if (today.getDate() > 15) {
    payoutDate.setMonth(
      payoutDate.getMonth() + 1
    );
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-6">
      <div className="max-h-[90vh] w-full max-w-5xl overflow-hidden rounded-3xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b px-8 py-6">
          <div>
            <h2 className="text-3xl font-bold text-slate-700">
              Upcoming Payout
            </h2>

            <p className="mt-1 text-slate-500">
              Advance payments included in
              your next settlement.
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-xl p-2 transition hover:bg-slate-100"
          >
            <X className="text-slate-600" />
          </button>
        </div>

        {/* Summary */}
        <div className="grid gap-6 border-b bg-slate-50 p-8 md:grid-cols-2">
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <Wallet className="text-[#e4005a]" />

              <h3 className="font-semibold text-slate-600">
                Total Upcoming Payout
              </h3>
            </div>

            <p className="mt-5 text-5xl font-bold text-[#e4005a]">
              ₹
              {totalPayout.toLocaleString(
                "en-IN"
              )}
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <CalendarDays className="text-green-700" />

              <h3 className="font-semibold text-slate-600">
                Settlement Date
              </h3>
            </div>

            <p className="mt-5 text-2xl font-bold text-slate-700">
              {payoutDate.toLocaleDateString(
                "en-IN",
                {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                }
              )}
            </p>
          </div>
        </div>

        {/* Table */}
        <div className="max-h-[420px] overflow-y-auto">
          <table className="w-full text-slate-600">
            <thead className="sticky top-0 bg-slate-100 text-slate-700">
              <tr>
                <th className="px-6 py-4 text-left font-semibold">
                  Booking
                </th>

                <th className="px-6 py-4 text-left font-semibold">
                  Customer
                </th>

                <th className="px-6 py-4 text-left font-semibold">
                  Event Date
                </th>

                <th className="px-6 py-4 text-left font-semibold">
                  Advance
                </th>

                <th className="px-6 py-4 text-left font-semibold">
                  Remaining
                </th>

                <th className="px-6 py-4 text-left font-semibold">
                  Status
                </th>
              </tr>
            </thead>

            <tbody>
              {payoutBookings.map(
                (booking) => (
                  <tr
                    key={booking.id}
                    className="border-t hover:bg-slate-50"
                  >
                    <td className="px-6 py-5 font-semibold text-slate-700">
                      {booking.bookingNumber}
                    </td>

                    <td className="px-6 py-5 text-slate-600">
                      {booking.customerName}
                    </td>

                    <td className="px-6 py-5 text-slate-600">
                      {new Date(
                        booking.eventDate
                      ).toLocaleDateString(
                        "en-IN"
                      )}
                    </td>

                    <td className="px-6 py-5 font-semibold text-slate-700">
                      ₹
                      {(booking.vendorNetAmount ?? 0).toLocaleString(
                        "en-IN"
                      )}
                    </td>

                    <td className="px-6 py-5 text-slate-600">
                      ₹
                      {booking.remainingAmount.toLocaleString(
                        "en-IN"
                      )}
                    </td>

                    <td className="px-6 py-5">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${badge(
                          booking.paymentStatus
                        )}`}
                      >
                        {
                          booking.paymentStatus
                        }
                      </span>
                    </td>
                  </tr>
                )
              )}

              {payoutBookings.length ===
                0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-12 text-center text-slate-500"
                  >
                    No payouts available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t bg-slate-50 px-8 py-5">
          <div>
            <p className="text-sm text-slate-600">
              Total Settlement
            </p>

            <h3 className="text-3xl font-bold text-[#e4005a]">
              ₹
              {totalPayout.toLocaleString(
                "en-IN"
              )}
            </h3>
          </div>

          <button
            onClick={onClose}
            className="rounded-2xl bg-[#e4005a] px-8 py-3 font-semibold text-white transition hover:bg-[#c8004e]"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
