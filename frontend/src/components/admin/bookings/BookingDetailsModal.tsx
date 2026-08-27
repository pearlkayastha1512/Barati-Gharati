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
              label="Event Date(s)"
              value={
                booking.eventDates && booking.eventDates.length > 0
                  ? booking.eventDates
                      .map((d) =>
                        new Date(d.includes("T") ? d : d + "T00:00:00").toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })
                      )
                      .join(", ") + ` (${booking.eventDates.length} Days)`
                  : new Date(booking.eventDate).toLocaleDateString()
              }
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
              label="Advance Release"
              value={
                booking.payoutStatus?.replaceAll("_", " ") ?? "Not created"
              }
            />

            <Info
              label="Vendor Acknowledgement"
              value={
                booking.vendorAcknowledgedAt
                  ? new Date(booking.vendorAcknowledgedAt).toLocaleString()
                  : "Pending"
              }
            />

            <Info
              label="Remaining Amount"
              value={`₹${booking.remainingAmount.toLocaleString(
                "en-IN"
              )}`}
            />

            {booking.settlement && (
              <>
                <Info
                  label="Platform Commission"
                  value={`₹${booking.settlement.platformCommission.toLocaleString(
                    "en-IN"
                  )}`}
                />

                <Info
                  label="Vendor Receives"
                  value={`₹${booking.settlement.vendorReceives.toLocaleString(
                    "en-IN"
                  )}`}
                />
              </>
            )}

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

          {booking.review && (
            <div>
              <h3 className="text-lg font-semibold text-slate-800">
                Customer Review
              </h3>

              <div className="mt-3 space-y-3 rounded-2xl bg-slate-50 p-4 text-slate-600">
                <p>
                  Rating: {booking.review.rating}/5
                </p>

                <p>
                  {booking.review.comment || "-"}
                </p>

                {booking.review.complaint && (
                  <p>
                    Complaint: {booking.review.complaint}
                  </p>
                )}

                {booking.review.vendorDispute && (
                  <p>
                    Vendor dispute: {booking.review.vendorDispute}
                  </p>
                )}

                {booking.review.proofImages &&
                  booking.review.proofImages.length >
                    0 && (
                    <div className="flex flex-wrap gap-2">
                      {booking.review.proofImages.map(
                        (image) => (
                          <a
                            key={image}
                            href={image}
                            target="_blank"
                            rel="noreferrer"
                            className="rounded-lg bg-white px-3 py-2 text-sm font-semibold text-blue-700"
                          >
                            Proof
                          </a>
                        )
                      )}
                    </div>
                  )}
              </div>
            </div>
          )}

          {/* Vendor Assignments & Request Dispatched Log */}
          {booking.vendorAssignments && booking.vendorAssignments.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  📢 Request Broadcast & Vendor Response Log
                </h3>
                <span className="text-xs font-semibold rounded-full bg-slate-100 px-3 py-1 text-slate-600">
                  {booking.vendorAssignments.length} Vendors Received Request
                </span>
              </div>
              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
                <table className="min-w-full divide-y divide-slate-200">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-5 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-400">Vendor</th>
                      <th className="px-5 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-400">Role</th>
                      <th className="px-5 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-400">Status</th>
                      <th className="px-5 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-400">Timestamps</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 bg-white text-sm">
                    {booking.vendorAssignments.map((a) => (
                      <tr key={a.id} className={a.role === "PRIMARY" ? "bg-blue-50/30 font-medium" : "hover:bg-slate-50/50"}>
                        <td className="whitespace-nowrap px-5 py-4">
                          <p className="font-semibold text-slate-900 flex items-center gap-2">
                            {a.businessName}
                            {a.role === "PRIMARY" && (
                              <span className="rounded bg-blue-600 px-1.5 py-0.5 text-[10px] text-white font-bold uppercase">Requested</span>
                            )}
                          </p>
                          <p className="text-xs text-slate-500">{a.ownerName}</p>
                        </td>
                        <td className="whitespace-nowrap px-5 py-4">
                          <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-bold ${
                            a.role === "PRIMARY" ? "bg-blue-100 text-blue-700" : "bg-purple-100 text-purple-700"
                          }`}>
                            {a.role === "PRIMARY" ? "Primary Vendor" : "Standby Vendor"}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-bold ${
                            a.status === "ACCEPTED" || a.status === "AVAILABLE"
                              ? "bg-emerald-100 text-emerald-800"
                              : a.status === "REJECTED" || a.status === "NOT_AVAILABLE" || a.status === "TIMED_OUT"
                              ? "bg-rose-100 text-rose-800"
                              : a.status === "PROMOTED"
                              ? "bg-amber-100 text-amber-800"
                              : "bg-slate-100 text-slate-800"
                          }`}>
                            {a.status.replaceAll("_", " ")}
                          </span>
                          {a.status === "REJECTED" && booking.cancellationReason && (
                            <div className="mt-2 max-w-xs rounded-xl border border-rose-200 bg-rose-50 p-2.5 text-xs text-rose-800">
                              <span className="font-bold uppercase tracking-wider text-[10px] text-rose-600 block mb-0.5">Rejection Reason</span>
                              <span className="italic font-medium">&ldquo;{booking.cancellationReason}&rdquo;</span>
                            </div>
                          )}
                        </td>
                        <td className="px-5 py-4 text-xs text-slate-500 space-y-1">
                          <p>Sent: {new Date(a.createdAt).toLocaleString("en-IN")}</p>
                          {a.respondedAt && <p>Responded: {new Date(a.respondedAt).toLocaleString("en-IN")}</p>}
                          {a.promotedAt && <p>Promoted: {new Date(a.promotedAt).toLocaleString("en-IN")}</p>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Activity Timeline & Audit Log */}
          {booking.activities && booking.activities.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                📜 Complete Activity Timeline (Admin View)
              </h3>
              <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-5">
                <div className="relative border-l-2 border-slate-200 ml-3 space-y-6">
                  {booking.activities.map((act) => (
                    <div key={act.id} className="relative pl-6">
                      <div className="absolute -left-[9px] top-1.5 h-4 w-4 rounded-full border-2 border-white bg-slate-700 shadow-sm" />
                      <div className="rounded-xl bg-white p-4 shadow-sm border border-slate-100 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-800 text-sm">{act.title}</span>
                          <span className="text-xs text-slate-400">
                            {new Date(act.createdAt).toLocaleString("en-IN")}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed">{act.description}</p>
                        {act.actorType && (
                          <div className="pt-1">
                            <span className="inline-block rounded bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-500 uppercase">
                              By: {act.actorType}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

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
