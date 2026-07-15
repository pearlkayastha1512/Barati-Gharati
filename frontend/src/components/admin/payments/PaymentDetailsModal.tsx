"use client";

import { Check, X } from "lucide-react";

import { Booking } from "@/types/booking";
import { useAuthStore } from "@/store/authStore";
import { hasAdminPermission } from "@/lib/adminAccess";

interface Props {
  booking: Booking | null;

  open: boolean;

  onClose: () => void;

  onApprove: (booking: Booking) => void;
}

export default function PaymentDetailsModal({
  booking,
  open,
  onClose,
  onApprove,
}: Props) {
  const user = useAuthStore((state) => state.user);
  const canReleaseAdvance =
    hasAdminPermission(user, "payments.approve") &&
    hasAdminPermission(user, "payouts.release");
  if (!open || !booking) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-6">
      <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl bg-white shadow-2xl">

        {/* Header */}

        <div className="flex items-center justify-between border-b border-slate-200 p-6">
          <h2 className="text-3xl font-bold text-slate-800">
            Payment Details
          </h2>

          <button
            onClick={onClose}
            className="rounded-xl p-2 transition hover:bg-slate-100 text-gray-600"
          >
            <X size={22} />
          </button>
        </div>

        <div className="space-y-8 p-8">

          {/* Booking */}

          <div>
            <h2 className="text-3xl font-bold text-slate-900">
              {booking.bookingNumber}
            </h2>

            <p className="mt-2 text-slate-500">
              {booking.eventType}
            </p>
          </div>

          {/* Information */}

          <div className="grid gap-6 md:grid-cols-2">

            <Info
              label="Customer"
              value={booking.customerName}
            />

            <Info
              label="Vendor"
              value={booking.vendorName}
            />

            <Info
              label="Category"
              value={booking.category}
            />

            <Info
              label="Package"
              value={booking.packageName}
            />

            <Info
              label="Total Amount"
              value={`₹${booking.amount.toLocaleString(
                "en-IN"
              )}`}
            />

            <Info
              label="Advance Paid"
              value={`₹${booking.advancePaid.toLocaleString(
                "en-IN"
              )}`}
            />

            <Info
              label="Platform Revenue"
              value={`₹${(booking.platformCommission ?? 0).toLocaleString(
                "en-IN"
              )}`}
            />

            <Info
              label="Vendor Net Advance"
              value={`₹${(booking.vendorNetAmount ?? 0).toLocaleString(
                "en-IN"
              )}`}
            />

            <Info
              label="Payout Status"
              value={
                booking.payoutStatus?.replaceAll("_", " ") ??
                "Not created"
              }
            />

            <Info
              label="Remaining Amount"
              value={`₹${booking.remainingAmount.toLocaleString(
                "en-IN"
              )}`}
            />

            <Info
              label="Payment Status"
              value={booking.paymentStatus}
            />

            <Info
              label="Booking Status"
              value={booking.bookingStatus}
            />

            <Info
              label="Admin Approval"
              value={
                booking.adminApproved
                  ? "Approved"
                  : "Pending"
              }
            />

            <Info
              label="Event Date"
              value={new Date(
                booking.eventDate
              ).toLocaleDateString()}
            />

          </div>

          {/* Payment Summary */}

          <div className="rounded-2xl bg-slate-50 p-6">

            <h3 className="mb-4 text-xl font-semibold text-slate-800">
              Payment Summary
            </h3>

            <div className="space-y-3">

              <div className="flex justify-between">
                <span className="text-slate-500">
                  Total Amount
                </span>

                <span className="font-semibold">
                  ₹{booking.amount.toLocaleString("en-IN")}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-500">
                  Platform commission
                </span>

                <span className="font-semibold text-amber-600">
                  - ₹{(booking.platformCommission ?? 0).toLocaleString("en-IN")}
                </span>
              </div>

              <div className="flex justify-between border-t border-slate-200 pt-3">
                <span className="font-medium text-slate-700">
                  Vendor net release
                </span>

                <span className="font-bold text-green-700">
                  ₹{(booking.vendorNetAmount ?? 0).toLocaleString("en-IN")}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-500">
                  Paid
                </span>

                <span className="font-semibold text-green-600">
                  ₹{booking.advancePaid.toLocaleString("en-IN")}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-500">
                  Remaining
                </span>

                <span className="font-semibold text-red-600">
                  ₹{booking.remainingAmount.toLocaleString("en-IN")}
                </span>
              </div>

            </div>

          </div>

          <div className="flex justify-end gap-3">
            {canReleaseAdvance && booking.paymentStatus ===
              "partial" &&
              !booking.adminApproved && (
                <button
                  onClick={() =>
                    onApprove(booking)
                  }
                  className="inline-flex items-center gap-2 rounded-2xl bg-green-600 px-6 py-3 font-semibold text-white transition hover:bg-green-700"
                >
                  <Check size={18} />
                  Approve & Release Net Advance
                </button>
              )}

            <button
              onClick={onClose}
              className="rounded-2xl bg-slate-800 px-6 py-3 font-semibold text-white transition hover:bg-slate-700"
            >
              Close
            </button>

          </div>

        </div>
      </div>
    </div>
  );
}

function Info({
  label,
  value,
}: {
  label: string;
  value?: string;
}) {
  return (
    <div>
      <p className="text-sm font-medium text-slate-500">
        {label}
      </p>

      <p className="mt-1 break-words text-base font-medium text-slate-700">
        {value || "-"}
      </p>
    </div>
  );
}
