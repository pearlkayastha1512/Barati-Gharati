"use client";

import Image from "next/image";
import { Camera, Star, X } from "lucide-react";

import { Review } from "@/types/review";
import { useAuthStore } from "@/store/authStore";
import { hasAdminPermission } from "@/lib/adminAccess";
import { isSupportedImageSrc } from "@/lib/image-url";

interface Props {
  review: Review | null;

  open: boolean;

  onClose: () => void;

  onApprovePayment?: (review: Review) => void;

  onHoldPayment?: (review: Review) => void;
}

export default function ReviewDetailsModal({
  review,
  open,
  onClose,
  onApprovePayment,
  onHoldPayment,
}: Props) {
  const user = useAuthStore((state) => state.user);
  const canApprovePayment = hasAdminPermission(user, "payments.approve");
  if (!open || !review) {
    return null;
  }

  const canModeratePayment =
    review.bookingStatus ===
    "awaiting_admin_review";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-6">
      <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl bg-white shadow-2xl">

        {/* Header */}

        <div className="flex items-center justify-between border-b border-slate-200 p-6">

          <h2 className="text-3xl font-bold text-slate-800">
            Review Details
          </h2>

          <button
            onClick={onClose}
            className="rounded-xl p-2 transition hover:bg-slate-100 text-gray-600"
          >
            <X size={22} />
          </button>

        </div>

        <div className="space-y-8 p-8">

          {/* Customer */}

          <div>

            <h2 className="text-3xl font-bold text-slate-900">
              {review.customerName}
            </h2>

            <p className="mt-2 text-slate-500">
              Review for{" "}
              <span className="font-semibold">
                {review.vendorName}
              </span>
            </p>

          </div>

          {/* Information */}

          <div className="grid gap-6 md:grid-cols-2">

            <Info
              label="Customer"
              value={review.customerName}
            />

            <Info
              label="Vendor"
              value={review.vendorName}
            />

            <Info
              label="Booking ID"
              value={review.bookingId}
            />

            <Info
              label="Booking Status"
              value={
                review.bookingStatus
                  ?.replaceAll("_", " ") ?? "-"
              }
            />

            <Info
              label="Created"
              value={new Date(
                review.createdAt
              ).toLocaleDateString()}
            />

          </div>

          {/* Rating */}

          <div>

            <h3 className="text-lg font-semibold text-slate-800">
              Rating
            </h3>

            <div className="mt-3 flex items-center gap-2">

              {Array.from({
                length: review.rating,
              }).map((_, index) => (
                <Star
                  key={index}
                  size={22}
                  className="fill-yellow-400 text-yellow-400"
                />
              ))}

              <span className="ml-2 font-semibold text-slate-700">
                {review.rating}/5
              </span>

            </div>

          </div>

          {/* Comment */}

          <div>

            <h3 className="text-lg font-semibold text-slate-800">
              Customer Review
            </h3>

            <div className="mt-3 rounded-2xl bg-slate-50 p-5 leading-7 text-slate-600">
              {review.comment}
            </div>

          </div>

          {review.complaint && (
            <div>
              <h3 className="text-lg font-semibold text-slate-800">
                Complaint
              </h3>

              <div className="mt-3 rounded-2xl bg-red-50 p-5 leading-7 text-red-700">
                {review.complaint}
              </div>
            </div>
          )}

          {review.proofImages &&
            review.proofImages.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-slate-800">
                  Event Photos
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Photos submitted by the customer with this review.
                </p>

                <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-3">
                  {review.proofImages.map(
                    (image, index) =>
                      isSupportedImageSrc(image) ? (
                        <a
                          key={image}
                          href={image}
                          target="_blank"
                          rel="noreferrer"
                          className="group relative aspect-square overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 shadow-sm"
                          aria-label={`Open event photo ${index + 1}`}
                        >
                          <Image
                            src={image}
                            alt={`Event photo ${index + 1} submitted by ${review.customerName}`}
                            fill
                            sizes="(max-width: 768px) 50vw, 220px"
                            className="object-cover transition duration-300 group-hover:scale-105"
                          />
                          <span className="absolute inset-x-0 bottom-0 bg-black/60 px-3 py-2 text-center text-xs font-semibold text-white opacity-0 transition group-hover:opacity-100">
                            View full photo
                          </span>
                        </a>
                      ) : (
                        <a
                          key={image}
                          href={image}
                          target="_blank"
                          rel="noreferrer"
                          className="flex aspect-square items-center justify-center rounded-2xl border border-slate-200 bg-slate-100 text-slate-600"
                        >
                          <Camera size={28} />
                        </a>
                      )
                  )}
                </div>
              </div>
            )}

          {/* Vendor Reply */}

          <div>

            <h3 className="text-lg font-semibold text-slate-800">
              Vendor Reply
            </h3>

            <div className="mt-3 rounded-2xl bg-slate-50 p-5 leading-7 text-slate-600">
              {review.reply || "No reply yet."}
            </div>

          </div>

          <div className="flex flex-wrap justify-end gap-3">
            {canModeratePayment && canApprovePayment ? (
              <>
                <button
                  onClick={() =>
                    onHoldPayment?.(review)
                  }
                  className="rounded-2xl bg-red-100 px-6 py-3 font-semibold text-red-700 transition hover:bg-red-200"
                >
                  Hold Payment
                </button>

                <button
                  onClick={() =>
                    onApprovePayment?.(review)
                  }
                  className="rounded-2xl bg-emerald-600 px-6 py-3 font-semibold text-white transition hover:bg-emerald-700"
                >
                  Approve Payment
                </button>
              </>
            ) : (
              <span className="rounded-2xl bg-slate-100 px-5 py-3 text-sm font-semibold capitalize text-slate-600">
                Payment action unavailable
              </span>
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
