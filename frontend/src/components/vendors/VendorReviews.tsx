





"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Star,
  Pencil,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";

import { useReviewStore } from "@/store/reviewStore";
import { useAuthStore } from "@/store/authStore";
import { useBookingStore } from "@/store/bookingStore";

import WriteReviewModal from "./WriteReviewModal";

interface VendorReviewsProps {
  vendorId: number;
  vendorName: string;
}

const REVIEWABLE_BOOKING_STATUSES = [
  "accepted",
  "completed",
];

export default function VendorReviews({
  vendorId,
  vendorName,
}: VendorReviewsProps) {
  const [open, setOpen] = useState(false);

  const { user } = useAuthStore();

  const { bookings, loadCustomerBookings } =
    useBookingStore();

  const reviewBooking = useMemo(() => {
    return bookings
      .filter(
        (booking) =>
          booking.vendorId === vendorId &&
          REVIEWABLE_BOOKING_STATUSES.includes(
            booking.bookingStatus
          )
      )
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() -
          new Date(a.createdAt).getTime()
      )[0];
  }, [bookings, vendorId]);

  useEffect(() => {
    if (
      user &&
      user.role === "customer"
    ) {
      loadCustomerBookings(user._id);
    }
  }, [user, loadCustomerBookings]);

  const {
    reviews,
    loadVendorReviews,
    setSelectedReview,
    deleteExistingReview,
  } = useReviewStore();

  useEffect(() => {
    loadVendorReviews(vendorId);
  }, [vendorId, loadVendorReviews]);

  const averageRating = useMemo(() => {
    if (reviews.length === 0) {
      return 0;
    }

    const total = reviews.reduce(
      (sum, review) => sum + review.rating,
      0
    );

    return Number(
      (total / reviews.length).toFixed(1)
    );
  }, [reviews]);

  const ratingCount = (star: number) =>
    reviews.filter(
      (review) => review.rating === star
    ).length;

  const hasBookedVendor = useMemo(() => {
    if (
      !user ||
      user.role !== "customer"
    ) {
      return false;
    }

    return bookings.some(
      (booking) =>
        booking.vendorId === vendorId
    );
  }, [bookings, vendorId, user]);

  const hasReviewableBooking =
    Boolean(reviewBooking);

  return (
    <>
      <section className="rounded-3xl border border-white/10 bg-white/[0.06] p-8 shadow-xl shadow-black/20 backdrop-blur">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-white">
              Customer Reviews
            </h2>

            <p className="mt-2 text-rose-100/70">
              Hear what couples say about this vendor.
            </p>
          </div>

          {hasBookedVendor && (
            <button
              onClick={() => {
                if (!hasReviewableBooking) {
                  toast.error(
                    "You can review after your booking is accepted."
                  );
                  return;
                }

                setSelectedReview(null);
                setOpen(true);
              }}
              className="rounded-xl bg-rose-600 px-5 py-3 font-semibold text-white shadow-lg shadow-rose-950/40 transition hover:bg-rose-500"
            >
              Write Review
            </button>
          )}
        </div>

        {/* Rating Summary */}
        <div className="mt-10 flex flex-col gap-6 rounded-2xl border border-rose-300/15 bg-rose-400/10 p-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="text-5xl font-bold text-white">
              {averageRating || "0.0"}
            </h3>

            <div className="mt-2 flex text-yellow-400">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={22}
                  fill={
                    star <=
                    Math.round(
                      averageRating
                    )
                      ? "currentColor"
                      : "none"
                  }
                />
              ))}
            </div>

            <p className="mt-2 text-rose-100/65">
              Based on {reviews.length} Reviews
            </p>
          </div>

          <div className="space-y-3">
            {[5, 4, 3, 2, 1].map(
              (star) => {
                const count =
                  ratingCount(star);

                const width =
                  reviews.length === 0
                    ? 0
                    : (count /
                        reviews.length) *
                      100;

                return (
                  <div
                    key={star}
                    className="flex items-center gap-4"
                  >
                    <span className="w-8 text-sm font-medium text-rose-100">
                      {star}★
                    </span>

                    <div className="h-2 w-48 overflow-hidden rounded-full bg-white/15">
                      <div
                        className="h-full rounded-full bg-yellow-400"
                        style={{
                          width: `${width}%`,
                        }}
                      />
                    </div>
                  </div>
                );
              }
            )}
          </div>
        </div>

        {/* Reviews */}
        <div className="mt-10 space-y-6">
          {reviews.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-rose-300/25 p-10 text-center text-rose-100/65">
              No reviews yet.
            </div>
          ) : (
            reviews.map((review) => (
              <div
                key={review.id}
                className="rounded-2xl border border-white/10 bg-[#12070d]/50 p-6"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-white">
                      {review.customerName}
                    </h4>

                    <p className="text-sm text-rose-100/60">
                      {new Date(
                        review.createdAt
                      ).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex text-yellow-400">
                    {[1, 2, 3, 4, 5].map(
                      (star) => (
                        <Star
                          key={star}
                          size={18}
                          fill={
                            star <=
                            review.rating
                              ? "currentColor"
                              : "none"
                          }
                        />
                      )
                    )}
                  </div>
                </div>

                <div className="mt-4">
                  <p className="leading-7 text-rose-100/75">
                    {review.comment}
                  </p>


                  {/* Vendor Reply */}

{review.reply && (
  <div className="mt-6 rounded-2xl border border-orange-300/20 bg-orange-400/10 p-5">

    <div className="flex items-center gap-2 font-semibold text-orange-200">
      <Star
        size={18}
        className="fill-orange-500 text-orange-500"
      />

      Vendor Reply
    </div>

    <p className="mt-3 leading-7 text-orange-50/80">
      {review.reply}
    </p>

    {review.repliedAt && (
      <p className="mt-4 text-xs text-orange-100/55">
        Replied on{" "}
        {new Date(
          review.repliedAt
        ).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })}
      </p>
    )}
  </div>
)}

                  {user?._id ===
                    review.customerId && (
                    <div className="mt-5 flex gap-3">
                      <button
                        onClick={() => {
                          setSelectedReview(
                            review
                          );
                          setOpen(true);
                        }}
                        className="
                          flex
                          items-center
                          gap-2
                          rounded-xl
                          border
                          border-blue-200
                          bg-blue-50
                          px-4
                          py-2
                          text-sm
                          font-medium
                          text-blue-600
                          transition
                          hover:bg-blue-100
                        "
                      >
                        <Pencil
                          size={16}
                        />
                        Edit
                      </button>

                      <button
                        onClick={() => {
  toast("Delete Review?", {
    description:
      "This action cannot be undone.",

    action: {
      label: "Delete",
      onClick: () => {
        deleteExistingReview(review.id);

        loadVendorReviews(vendorId);

        toast.success(
          "Review deleted successfully."
        );
      },
    },

    cancel: {
      label: "Cancel",
      onClick: () => {
        toast.info("Deletion cancelled.");
      },
    },
  });
}}
                        className="
                          flex
                          items-center
                          gap-2
                          rounded-xl
                          border
                          border-red-200
                          bg-red-50
                          px-4
                          py-2
                          text-sm
                          font-medium
                          text-red-600
                          transition
                          hover:bg-red-100
                        "
                      >

                        <Trash2
                          size={16}
                        />
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      <WriteReviewModal
        open={open}
        onClose={() => {
          setSelectedReview(null);
          setOpen(false);
        }}
        bookingId={reviewBooking?.id ?? ""}
        vendorId={vendorId}
        vendorName={vendorName}
      />
    </>
  );
}
