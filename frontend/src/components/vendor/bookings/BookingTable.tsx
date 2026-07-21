
"use client";

import {
  CheckCircle2,
  Eye,
} from "lucide-react";

import { Booking } from "@/types/booking";
import StatusBadge from "@/components/ui/StatusBadge";

import { useBookingStore } from "@/store/bookingStore";


interface Props {
  bookings: Booking[];
}

function badge(status: string) {
  switch (status) {
    case "pending":
    case "matching":
      return "bg-yellow-100 text-yellow-700";
    case "waiting_primary_vendor":
      return "bg-purple-100 text-purple-700 animate-pulse";
    case "promote_standby":
      return "bg-indigo-100 text-indigo-700 animate-pulse";
    case "waiting_payment":
    case "primary_accepted":
    case "standby_accepted":
      return "bg-blue-100 text-blue-700";
    case "accepted":
    case "in_progress":
      return "bg-green-100 text-green-700";
    case "completed":
      return "bg-[#ffe1ec] text-[#e4005a]";
    case "rejected":
    case "primary_rejected":
    case "cancelled":
      return "bg-red-100 text-red-700";
    default:
      return "bg-slate-100 text-slate-700";
  }
}

export default function BookingTable({ bookings }: Props) {
  const {
    updateStatus,
    selectBooking,
    primaryAccept,
    primaryReject,
    promotedAccept,
    promotedReject,
  } = useBookingStore();

  const handleStatusChange = async (
    booking: Booking,
    status: "accepted" | "rejected" | "event_completed"
  ) => {
    await updateStatus(booking.id, status);
  };

  const handlePrimaryAccept = async (bookingId: string) => {
    await primaryAccept(bookingId);
  };

  const handlePrimaryReject = async (bookingId: string) => {
    const reason = prompt("Reason for rejection (optional):") ?? undefined;
    await primaryReject(bookingId, reason);
  };

  const handlePromotedAccept = async (bookingId: string) => {
    await promotedAccept(bookingId);
  };

  const handlePromotedReject = async (bookingId: string) => {
    const reason = prompt("Reason for rejection (optional):") ?? undefined;
    await promotedReject(bookingId, reason);
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
                  <StatusBadge status={booking.bookingStatus} size="sm" />
                </td>


                <td className="px-6 py-5">
                  <div className="flex gap-2">
                    {/* Primary Vendor Actions */}
                    {(booking.bookingStatus === "waiting_primary_vendor" ||
                      booking.bookingStatus === "pending") && (
                      <>
                        <button
                          onClick={() => handlePrimaryAccept(booking.id)}
                          className="rounded-lg bg-green-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-green-700"
                          title="Accept Booking (Primary)"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => handlePrimaryReject(booking.id)}
                          className="rounded-lg bg-red-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-red-700"
                          title="Reject Booking (Primary)"
                        >
                          Reject
                        </button>
                      </>
                    )}

                    {/* Promoted Standby Vendor Actions */}
                    {booking.bookingStatus === "promote_standby" && (
                      <>
                        <button
                          onClick={() => handlePromotedAccept(booking.id)}
                          className="rounded-lg bg-indigo-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-indigo-700"
                          title="Accept Promoted Booking"
                        >
                          Accept (Promoted)
                        </button>
                        <button
                          onClick={() => handlePromotedReject(booking.id)}
                          className="rounded-lg bg-red-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-red-700"
                          title="Reject Promoted Booking"
                        >
                          Reject
                        </button>
                      </>
                    )}

                    {/* Complete Event Action (ONLY after advance payment is paid) */}
                    {(booking.bookingStatus === "advance_paid" ||
                      booking.bookingStatus === "in_progress" ||
                      booking.bookingStatus === "payment_approved" ||
                      (booking.bookingStatus === "accepted" && booking.paymentStatus !== "pending")) && (
                      <button
                        onClick={() =>
                          handleStatusChange(booking, "event_completed")
                        }
                        className="rounded-lg bg-blue-600 px-3 py-2 text-white transition hover:bg-blue-700"
                        title="Mark Event as Completed"
                      >
                        <CheckCircle2 size={16} />
                      </button>
                    )}



                    <button
                      onClick={() => selectBooking(booking)}
                      className="rounded-lg bg-[#e4005a] px-3 py-2 text-white transition hover:bg-[#e4005a]"
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
