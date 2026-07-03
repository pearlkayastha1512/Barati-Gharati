"use client";

import { useMemo } from "react";

import { Star } from "lucide-react";

import { useReviewStore } from "@/store/reviewStore";

export default function RatingSummary() {
  const reviews = useReviewStore(
    (state) => state.reviews
  );

  const { averageRating, totalReviews, ratingData } =
    useMemo(() => {
      const total = reviews.length;

      const average =
        total === 0
          ? 0
          : Number(
              (
                reviews.reduce(
                  (sum, review) =>
                    sum + review.rating,
                  0
                ) / total
              ).toFixed(1)
            );

      const ratingData = [5, 4, 3, 2, 1].map(
        (star) => {
          const count = reviews.filter(
            (review) =>
              review.rating === star
          ).length;

          const percentage =
            total === 0
              ? 0
              : Math.round(
                  (count / total) * 100
                );

          return {
            star,
            count,
            percentage,
          };
        }
      );

      return {
        averageRating: average,
        totalReviews: total,
        ratingData,
      };
    }, [reviews]);

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">

      <h2 className="text-2xl font-bold text-slate-900">
        Rating Summary
      </h2>

      {/* Overall Rating */}

      <div className="mt-8 flex items-center justify-between rounded-2xl bg-orange-50 p-6">

        <div>

          <p className="text-sm text-slate-500">
            Average Rating
          </p>

          <div className="mt-2 flex items-center gap-3">

            <h3 className="text-5xl font-bold text-slate-900">
              {averageRating}
            </h3>

            <div className="flex">

              {Array.from({
                length: 5,
              }).map((_, index) => (
                <Star
                  key={index}
                  size={20}
                  fill={
                    index <
                    Math.round(
                      averageRating
                    )
                      ? "currentColor"
                      : "none"
                  }
                  className={
                    index <
                    Math.round(
                      averageRating
                    )
                      ? "text-yellow-500"
                      : "text-gray-300"
                  }
                />
              ))}

            </div>

          </div>

        </div>

        <div className="text-right">

          <p className="text-sm text-slate-500">
            Total Reviews
          </p>

          <p className="mt-2 text-3xl font-bold text-slate-900">
            {totalReviews}
          </p>

        </div>

      </div>

      {/* Rating Breakdown */}

      <div className="mt-8 space-y-5">

        {ratingData.map((item) => (
          <div
            key={item.star}
            className="flex items-center gap-4"
          >

            <div className="flex w-16 items-center gap-1">

              <span className="font-semibold text-slate-700">
                {item.star}
              </span>

              <Star
                size={15}
                fill="currentColor"
                className="text-yellow-500"
              />

            </div>

            <div className="flex-1 overflow-hidden rounded-full bg-slate-200">

              <div
                className="h-3 rounded-full bg-gradient-to-r from-orange-400 to-orange-600 transition-all duration-700"
                style={{
                  width: `${item.percentage}%`,
                }}
              />

            </div>

            <div className="w-24 text-right">

              <p className="text-sm font-semibold text-slate-700">
                {item.count}
              </p>

              <p className="text-xs text-slate-500">
                {item.percentage}%
              </p>

            </div>

          </div>
        ))}

      </div>

    </section>
  );
}