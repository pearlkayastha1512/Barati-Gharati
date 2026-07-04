"use client";

import { useState } from "react";

import ReviewCard from "./ReviewCard";
import ReplyReviewModal from "./ReplyReviewModal";

import { useReviewStore } from "@/store/reviewStore";

export default function ReviewGrid() {
  const {
    reviews,
    setSelectedReview,
  } = useReviewStore();

  const [openReply, setOpenReply] =
    useState(false);

  const handleReply = (review: any) => {
    setSelectedReview(review);

    setOpenReply(true);
  };

  const handleClose = () => {
    setSelectedReview(null);

    setOpenReply(false);
  };

  if (reviews.length === 0) {
    return (
      <>
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center">

          <h3 className="text-2xl font-bold text-slate-900">
            No Reviews Yet
          </h3>

          <p className="mt-3 text-slate-500">
            Customer reviews will appear here after completed bookings.
          </p>

        </div>

        <ReplyReviewModal
          open={openReply}
          onClose={handleClose}
        />
      </>
    );
  }

  return (
    <>
      <section className="space-y-6">

        {reviews.map((review) => (
          <ReviewCard
            key={review.id}
            review={review}
            onReply={handleReply}
          />
        ))}

      </section>

      <ReplyReviewModal
        open={openReply}
        onClose={handleClose}
      />
    </>
  );
}