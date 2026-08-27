
"use client";

import { useState } from "react";
import {
  CheckCircle2,
  Eye,
  AlertTriangle,
} from "lucide-react";

import { Booking } from "@/types/booking";
import StatusBadge from "@/components/ui/StatusBadge";

import { useBookingStore } from "@/store/bookingStore";
import { useVendorProfile } from "@/hooks/useVendorProfile";
import { toast } from "sonner";
import VendorRejectionModal from "@/components/vendors/VendorRejectionModal";


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
  const { vendor } = useVendorProfile();
  const [pendingResponse, setPendingResponse] = useState<{
    bookingId: string;
    response: "AVAILABLE" | "NOT_AVAILABLE";
  } | null>(null);

  const [rejectingBooking, setRejectingBooking] = useState<{
    id: string;
    isPromoted: boolean;
  } | null>(null);

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

  const handlePromotedAccept = async (bookingId: string) => {
    await promotedAccept(bookingId);
  };

  const handleConfirmRejection = async (reason: string) => {
    if (!rejectingBooking) return;
    if (rejectingBooking.isPromoted) {
      await promotedReject(rejectingBooking.id, reason);
    } else {
      await primaryReject(rejectingBooking.id, reason);
    }
    toast.success("Rejection reason submitted.");
  };

  return (
    <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm relative">
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
            bookings.map((booking) => {
              const myAssignment = vendor
                ? booking.vendorAssignments?.find(
                    (a) =>
                      String(a.vendorId) === String(vendor.id) ||
                      a.vendorId === vendor.userId
                  )
                : null;

              const isStandbyVendor =
                myAssignment?.role === "STANDBY" ||
                (booking.vendorAssignments?.some((a) => a.role === "STANDBY") &&
                  booking.vendorId !== vendor?.id);

              const isPrimaryVendor = !isStandbyVendor;

              const isAvailable =
                myAssignment?.status === "AVAILABLE" ||
                (!myAssignment && booking.vendorAssignments?.some((a) => a.status === "AVAILABLE"));

              const isNotAvailable =
                myAssignment?.status === "NOT_AVAILABLE" ||
                (!myAssignment && booking.vendorAssignments?.some((a) => a.status === "NOT_AVAILABLE"));

              const hasResponded = isAvailable || isNotAvailable;

              return (
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
                    <div className="flex flex-col gap-1">
                      <span className="font-semibold text-slate-800">
                        {new Date(booking.eventDate).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                      {booking.eventDates && booking.eventDates.length > 1 && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2 py-0.5 text-[10px] font-bold text-rose-700 border border-rose-200 w-max">
                          📅 {booking.eventDates.length} Days
                        </span>
                      )}
                    </div>
                  </td>

                  <td className="px-6 py-5 font-semibold text-slate-700">
                    ₹{booking.amount.toLocaleString("en-IN")}
                  </td>

                  <td className="px-6 py-5">
                    <StatusBadge status={booking.bookingStatus} size="sm" />
                  </td>

                  <td className="px-6 py-5">
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center gap-2">
                        {/* Primary Vendor Actions */}
                        {isPrimaryVendor &&
                          (booking.bookingStatus === "waiting_primary_vendor" ||
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
                                onClick={() => setRejectingBooking({ id: booking.id, isPromoted: false })}
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
                              onClick={() => setRejectingBooking({ id: booking.id, isPromoted: true })}
                              className="rounded-lg bg-red-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-red-700"
                              title="Reject Promoted Booking"
                            >
                              Reject
                            </button>
                          </>
                        )}

                        {/* Standby Availability Confirmation Actions */}
                        {isStandbyVendor &&
                          (booking.bookingStatus === "waiting_primary_vendor" ||
                            booking.bookingStatus === "pending" ||
                            booking.bookingStatus === "matching" ||
                            booking.bookingStatus === "primary_rejected") && (
                            <div className="flex items-center gap-1.5">
                              <button
                                disabled={hasResponded}
                                onClick={() => {
                                  if (hasResponded) {
                                    toast.info("Availability status has already been confirmed and locked.");
                                    return;
                                  }
                                  setPendingResponse({ bookingId: booking.id, response: "AVAILABLE" });
                                }}
                                className={`rounded-lg px-2.5 py-1.5 text-xs font-bold transition-all duration-200 shadow-sm ${
                                  isAvailable
                                    ? "bg-emerald-600 text-white ring-2 ring-emerald-400 ring-offset-1 scale-[1.02] opacity-100 font-extrabold shadow-emerald-200 cursor-default"
                                    : isNotAvailable
                                    ? "bg-emerald-100/80 text-emerald-800 opacity-40 grayscale blur-[0.4px] border border-emerald-300 cursor-not-allowed"
                                    : "bg-emerald-600 text-white hover:bg-emerald-700 active:scale-95"
                                }`}
                                title={hasResponded ? "Availability confirmed and locked" : "Confirm Availability for Event Date"}
                              >
                                ✓ Available
                              </button>
                              <button
                                disabled={hasResponded}
                                onClick={() => {
                                  if (hasResponded) {
                                    toast.info("Availability status has already been confirmed and locked.");
                                    return;
                                  }
                                  setPendingResponse({ bookingId: booking.id, response: "NOT_AVAILABLE" });
                                }}
                                className={`rounded-lg px-2.5 py-1.5 text-xs font-bold transition-all duration-200 shadow-sm ${
                                  isNotAvailable
                                    ? "bg-rose-600 text-white ring-2 ring-rose-400 ring-offset-1 scale-[1.02] opacity-100 font-extrabold shadow-rose-200 cursor-default"
                                    : isAvailable
                                    ? "bg-rose-100/80 text-rose-800 opacity-40 grayscale blur-[0.4px] border border-rose-300 cursor-not-allowed"
                                    : "bg-rose-600 text-white hover:bg-rose-700 active:scale-95"
                                }`}
                                title={hasResponded ? "Availability confirmed and locked" : "Mark as Not Available"}
                              >
                                ✕ Not Available
                              </button>
                            </div>
                          )}

                        {/* Complete Event Action */}
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

                      {isStandbyVendor &&
                        (booking.bookingStatus === "waiting_primary_vendor" ||
                          booking.bookingStatus === "pending" ||
                          booking.bookingStatus === "matching") && (
                          <span className="text-[10px] font-medium text-purple-800 bg-purple-50 px-2 py-0.5 rounded border border-purple-200 w-fit">
                            {hasResponded
                              ? "🔒 Availability response locked. Booking accept unlocks if primary rejects."
                              : "ℹ️ Confirm availability. Acceptance unlocks if primary vendor rejects."}
                          </span>
                        )}
                    </div>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>

      {/* Standby Response Warning & Confirmation Modal */}
      {pendingResponse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl border border-slate-100">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-amber-100 p-3 text-amber-600">
                <AlertTriangle size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Confirm Availability Status
                </h3>
                <p className="text-xs text-amber-700 font-semibold">
                  ⚠️ One-Time Action Only
                </p>
              </div>
            </div>

            <p className="mt-4 text-sm leading-relaxed text-slate-600">
              You are marking yourself as{" "}
              <span className="font-extrabold text-slate-900 underline decoration-amber-400">
                {pendingResponse.response === "AVAILABLE" ? "AVAILABLE" : "NOT AVAILABLE"}
              </span>{" "}
              for this booking request.
            </p>

            <div className="mt-3 rounded-2xl border border-amber-200 bg-amber-50/80 p-3.5 text-xs text-amber-900 font-medium leading-relaxed">
              <strong>Warning:</strong> Once you assure your availability status, <span className="underline font-bold text-amber-950">you cannot change it again</span>. Only one response submission is allowed per booking.
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setPendingResponse(null)}
                className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  const { bookingId, response } = pendingResponse;
                  setPendingResponse(null);
                  const ok = await useBookingStore.getState().standbyRespond(bookingId, response);
                  if (ok) {
                    toast.success(`Availability locked as ${response === "AVAILABLE" ? "Available" : "Not Available"}`);
                  } else {
                    toast.error("Failed to update availability");
                  }
                }}
                className={`rounded-xl px-5 py-2.5 text-xs font-bold text-white shadow-md transition ${
                  pendingResponse.response === "AVAILABLE"
                    ? "bg-emerald-600 hover:bg-emerald-700"
                    : "bg-rose-600 hover:bg-rose-700"
                }`}
              >
                Confirm & Lock
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Vendor Custom Rejection Modal */}
      <VendorRejectionModal
        isOpen={Boolean(rejectingBooking)}
        onClose={() => setRejectingBooking(null)}
        onSubmit={handleConfirmRejection}
        title="Reject Booking Request"
      />
    </section>
  );
}
