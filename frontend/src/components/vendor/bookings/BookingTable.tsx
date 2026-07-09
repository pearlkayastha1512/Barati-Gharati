
"use client";

import {
  CheckCircle2,
  Eye,
  XCircle,
} from "lucide-react";

import { Booking } from "@/types/booking";
import { useBookingStore } from "@/store/bookingStore";


interface Props {
  bookings: Booking[];
}

function badge(status: string) {
  switch (status) {
    case "pending":
      return "bg-yellow-100 text-yellow-700";
    case "accepted":
      return "bg-green-100 text-green-700";
    case "completed":
      return "bg-blue-100 text-blue-700";
    case "rejected":
      return "bg-red-100 text-red-700";
    default:
      return "bg-red-100 text-red-700";
  }
}

export default function BookingTable({ bookings }: Props) {
 const {
  updateStatus,
  selectBooking,
} = useBookingStore();

 const handleStatusChange = async (
  booking: Booking,
  status: "accepted" | "rejected"
) => {
  const success = await updateStatus(
    booking.id,
    status
  );

  if (!success) return;
};

  return (
    <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      <table className="w-full text-slate-600">
        <thead className="bg-slate-50">
          <tr>
            <th className="px-6 py-4 text-left font-semibold text-slate-700">
              Customer
            </th>
            <th className="px-6 py-4 text-left font-semibold text-slate-700">
              Event
            </th>
            <th className="px-6 py-4 text-left font-semibold text-slate-700">
              Date
            </th>
            <th className="px-6 py-4 text-left font-semibold text-slate-700">
              Amount
            </th>
            <th className="px-6 py-4 text-left font-semibold text-slate-700">
              Status
            </th>
            <th className="px-6 py-4 text-left font-semibold text-slate-700">
              Action
            </th>
          </tr>
        </thead>

        <tbody>
          {bookings.length === 0 ? (
            <tr>
              <td
                colSpan={6}
                className="py-16 text-center text-slate-500"
              >
                No bookings found.
              </td>
            </tr>
          ) : (
            bookings.map((booking) => (
              <tr
                key={booking.id}
                className="border-t border-slate-200 transition hover:bg-slate-50"
              >
                <td className="px-6 py-5">
                  <div>
                    <p className="font-semibold text-slate-700">
                      {booking.customerName}
                    </p>
                    <p className="text-sm text-slate-500">
                      {booking.category}
                    </p>
                  </div>
                </td>

                <td className="px-6 py-5">
                  {booking.eventType}
                </td>

                <td className="px-6 py-5">
                  {new Date(booking.eventDate).toLocaleDateString(
                    "en-GB",
                    {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    }
                  )}
                </td>

                <td className="px-6 py-5 font-semibold text-slate-700">
                  ₹{booking.amount.toLocaleString("en-IN")}
                </td>

                <td className="px-6 py-5">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${badge(
                      booking.bookingStatus
                    )}`}
                  >
                    {booking.bookingStatus}
                  </span>
                </td>

                <td className="px-6 py-5">
                  <div className="flex gap-2">
                    {booking.bookingStatus === "pending" && (
                      <>
                        <button
                          onClick={() =>
                            handleStatusChange(
                              booking,
                              "accepted"
                            )
                          }
                          className="rounded-lg bg-green-600 px-3 py-2 text-white transition hover:bg-green-700"
                        >
                          <CheckCircle2 size={16} />
                        </button>

                        <button
                          onClick={() =>
                            handleStatusChange(
                              booking,
                              "rejected"
                            )
                          }
                          className="rounded-lg bg-red-600 px-3 py-2 text-white transition hover:bg-red-700"
                        >
                          <XCircle size={16} />
                        </button>
                      </>
                    )}

                  <button
  onClick={() =>
    selectBooking(booking)
  }
  className="rounded-lg bg-blue-600 px-3 py-2 text-white transition hover:bg-blue-700"
>
  <Eye size={16} />
</button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </section>
  );
}
