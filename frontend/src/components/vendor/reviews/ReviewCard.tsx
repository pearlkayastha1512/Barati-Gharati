"use client";

import {
  MessageSquare,
  Star,
} from "lucide-react";

import { Review } from "@/types/review";

interface Props {
  review: Review;

  onReply: (
    review: Review
  ) => void;
}

export default function ReviewCard({
  review,
  onReply,
}: Props) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-lg">

      {/* Header */}

      <div className="flex items-start justify-between">

        <div>

          <h3 className="text-lg font-bold text-slate-900">
            {review.customerName}
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            {new Date(
              review.createdAt
            ).toLocaleDateString(
              "en-GB",
              {
                day: "2-digit",
                month: "short",
                year: "numeric",
              }
            )}
          </p>

        </div>

        <div className="flex">

          {Array.from({
            length: 5,
          }).map((_, index) => (
            <Star
              key={index}
              size={18}
              fill={
                index <
                review.rating
                  ? "currentColor"
                  : "none"
              }
              className={
                index <
                review.rating
                  ? "text-yellow-500"
                  : "text-gray-300"
              }
            />
          ))}

        </div>

      </div>

      {/* Review */}

      <p className="mt-5 leading-7 text-slate-600">
        {review.comment}
      </p>

      {/* Vendor Reply */}

      {review.reply && (
        <div className="mt-6 rounded-2xl bg-orange-50 p-5">

          <div className="flex items-center gap-2 font-semibold text-orange-700">

            <MessageSquare size={18} />

            Vendor Reply

          </div>

          <p className="mt-3 text-slate-700">
            {review.reply}
          </p>

          {review.repliedAt && (
            <p className="mt-3 text-xs text-slate-500">
              {new Date(
                review.repliedAt
              ).toLocaleDateString(
                "en-GB"
              )}
            </p>
          )}

        </div>
      )}

      {/* Action */}

      <button
        onClick={() =>
          onReply(review)
        }
        className="mt-6 rounded-xl bg-orange-500 px-5 py-2.5 font-semibold text-white transition hover:bg-orange-600"
      >
        {review.reply
          ? "Edit Reply"
          : "Reply"}
      </button>

    </div>
  );
}