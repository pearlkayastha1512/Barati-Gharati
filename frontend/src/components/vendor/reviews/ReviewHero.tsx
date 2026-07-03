"use client";

import { useMemo } from "react";

import { motion } from "framer-motion";

import {
  Star,
  MessageSquare,
  TrendingUp,
} from "lucide-react";

import { useReviewStore } from "@/store/reviewStore";

export default function ReviewHero() {
  const reviews = useReviewStore(
    (state) => state.reviews
  );

  const stats = useMemo(() => {
    const total = reviews.length;

    const average =
      total === 0
        ? 0
        : (
            reviews.reduce(
              (sum, review) =>
                sum + review.rating,
              0
            ) / total
          ).toFixed(1);

    const latest =
      total === 0
        ? "No reviews"
        : new Date(
            reviews[
              reviews.length - 1
            ].createdAt
          ).toLocaleDateString(
            "en-GB",
            {
              day: "2-digit",
              month: "short",
              year: "numeric",
            }
          );

    return {
      total,
      average,
      latest,
    };
  }, [reviews]);

  return (
    <motion.section
      initial={{
        opacity: 0,
        y: 15,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      className="rounded-[32px] bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 p-8 text-white shadow-xl"
    >
      <div className="flex flex-col gap-8 lg:flex-row lg:justify-between">

        <div>

          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2">

            <Star size={16} />

            Customer Reviews

          </div>

          <h1 className="mt-5 text-5xl font-bold">
            Build trust with
            <br />
            happy customers
          </h1>

          <p className="mt-5 max-w-xl text-orange-100">
            View ratings, respond to customer feedback and improve your wedding business.
          </p>

        </div>

        <div className="rounded-3xl bg-white/10 p-6 backdrop-blur">

          <div className="flex items-center gap-3">

            <TrendingUp size={22} />

            <h3 className="text-xl font-semibold">
              Review Overview
            </h3>

          </div>

          <div className="mt-6 space-y-5">

            <div className="flex justify-between">

              <span>Average Rating</span>

              <span className="font-semibold">
                ⭐ {stats.average}
              </span>

            </div>

            <div className="flex justify-between">

              <span>Total Reviews</span>

              <span className="font-semibold">
                {stats.total}
              </span>

            </div>

            <div className="flex justify-between">

              <span>Latest Review</span>

              <span className="font-semibold">
                {stats.latest}
              </span>

            </div>

          </div>

          <div className="mt-8 flex items-center gap-3">

            <MessageSquare size={18} />

            Customer Feedback

          </div>

        </div>

      </div>
    </motion.section>
  );
}