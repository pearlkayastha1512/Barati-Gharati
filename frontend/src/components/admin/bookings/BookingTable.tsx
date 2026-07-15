"use client";

import { Check, Eye, PauseCircle } from "lucide-react";

import { Booking } from "@/types/booking";
import { useAuthStore } from "@/store/authStore";
import { hasAdminPermission } from "@/lib/adminAccess";

interface Props {
  bookings: Booking[];

  onView: (booking: Booking) => void;

  onApprove: (booking: Booking) => void;

  onApprovePayment?: (booking: Booking) => void;

  onHoldPayment?: (booking: Booking) => void;
}

export default function BookingTable({
  bookings,
  onView,
  onApprove,
  onApprovePayment,
  onHoldPayment,
}: Props) {
  const user = useAuthStore((state) => state.user);
  const canReleaseAdvance =
    hasAdminPermission(user, "payments.approve") &&
    hasAdminPermission(user, "payouts.release");
  const canApprovePayment = hasAdminPermission(user, "payments.approve");
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
                          "awaiting_admin_review"
                        ? "bg-purple-100 text-purple-700"
                        : booking.bookingStatus ===
                          "payment_approved"
                        ? "bg-emerald-100 text-emerald-700"
                        : booking.bookingStatus ===
                          "payment_held"
                        ? "bg-red-100 text-red-700"
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
                  <div className="flex items-center gap-2">
                    {canReleaseAdvance && booking.paymentStatus ===
                      "partial" &&
                      !booking.adminApproved && (
                        <button
                          onClick={() =>
                            onApprove(booking)
                          }
                          className="rounded-xl bg-green-100 p-2 text-green-700 transition hover:bg-green-200"
                          title="Approve booking"
                        >
                          <Check size={18} />
                        </button>
                      )}

                    {canApprovePayment && booking.bookingStatus ===
                      "awaiting_admin_review" && (
                        <>
                          <button
                            onClick={() =>
                              onApprovePayment?.(
                                booking
                              )
                            }
                            className="rounded-xl bg-emerald-100 p-2 text-emerald-700 transition hover:bg-emerald-200"
                            title="Approve payment"
                          >
                            <Check size={18} />
                          </button>

                          <button
                            onClick={() =>
                              onHoldPayment?.(
                                booking
                              )
                            }
                            className="rounded-xl bg-red-100 p-2 text-red-700 transition hover:bg-red-200"
                            title="Hold payment"
                          >
                            <PauseCircle size={18} />
                          </button>
                        </>
                      )}

                  <button
                    onClick={() =>
                      onView(booking)
                    }
                    className="rounded-xl bg-slate-100 p-2 transition hover:bg-slate-200"
                  >
                    <Eye size={18} />
                  </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
