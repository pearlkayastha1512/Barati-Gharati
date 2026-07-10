"use client";

import { X } from "lucide-react";

import { Booking } from "@/types/booking";

interface Props {
  booking: Booking | null;

  open: boolean;

  onClose: () => void;
}

export default function BookingDetailsModal({
  booking,
  open,
  onClose,
}: Props) {
  if (!open || !booking) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-6">
      <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-3xl bg-white shadow-2xl">

        {/* Header */}

        <div className="flex items-center justify-between border-b border-slate-200 p-6">

          <h2 className="text-3xl font-bold text-slate-800">
            Booking Details
          </h2>

          <button
            onClick={onClose}
            className="rounded-xl p-2 transition hover:bg-slate-100 text-gray-700"
          >
            <X size={22} />
          </button>

        </div>

        <div className="space-y-8 p-8">

          {/* Booking Number */}

          <div>

            <h2 className="text-3xl font-bold text-slate-900">
              {booking.bookingNumber}
            </h2>

            <p className="mt-2 text-slate-500">
              {booking.eventType}
            </p>

          </div>

          {/* Booking Information */}

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
              label="Customer Email"
              value={booking.customerEmail}
            />

            <Info
              label="Customer Phone"
              value={booking.customerPhone}
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
              label="Event Date"
              value={new Date(
                booking.eventDate
              ).toLocaleDateString()}
            />

            <Info
              label="Event Time"
              value={booking.eventTime}
            />

            <Info
              label="Venue"
              value={booking.venue}
            />

            <Info
              label="City"
              value={booking.city}
            />

            <Info
              label="Guests"
              value={booking.guests.toString()}
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
              label="Admin Approved At"
              value={
                booking.adminApprovedAt
                  ? new Date(
                      booking.adminApprovedAt
                    ).toLocaleString()
                  : "-"
              }
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
              label="Remaining Amount"
              value={`₹${booking.remainingAmount.toLocaleString(
                "en-IN"
              )}`}
            />

          </div>

          {/* Bride & Groom */}

          <div className="grid gap-6 md:grid-cols-2">

            <Info
              label="Bride Name"
              value={booking.brideName}
            />

            <Info
              label="Groom Name"
              value={booking.groomName}
            />

          </div>

          {/* Special Requirements */}

          <div>

            <h3 className="text-lg font-semibold text-slate-800">
              Special Requirements
            </h3>

            <p className="mt-3 rounded-2xl bg-slate-50 p-4 text-slate-600">
              {booking.specialRequirements || "-"}
            </p>

          </div>

          <div className="flex justify-end">

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
