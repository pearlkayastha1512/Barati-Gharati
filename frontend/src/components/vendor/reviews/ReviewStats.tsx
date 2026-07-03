"use client";

import { useMemo } from "react";

import {
  Star,
  MessageSquare,
  ThumbsUp,
  Users,
} from "lucide-react";

import { useReviewStore } from "@/store/reviewStore";

export default function ReviewStats() {
  const reviews = useReviewStore(
    (state) => state.reviews
  );

  const stats = useMemo(() => {
    const totalReviews =
      reviews.length;

    const averageRating =
      totalReviews === 0
        ? 0
        : (
            reviews.reduce(
              (sum, review) =>
                sum + review.rating,
              0
            ) / totalReviews
          ).toFixed(1);

    const fiveStarReviews =
      reviews.filter(
        (review) =>
          review.rating === 5
      ).length;

    const recommendationRate =
      totalReviews === 0
        ? 0
        : Math.round(
            (reviews.filter(
              (review) =>
                review.rating >= 4
            ).length /
              totalReviews) *
              100
          );

    const uniqueCustomers =
      new Set(
        reviews.map(
          (review) =>
            review.customerId
        )
      ).size;

    return {
      averageRating,
      totalReviews,
      recommendationRate,
      uniqueCustomers,
      fiveStarReviews,
    };
  }, [reviews]);

  const cards = [
    {
      title: "Average Rating",
      value: stats.averageRating,
      subtitle: "Out of 5",
      icon: Star,
    },
    {
      title: "Reviews",
      value: stats.totalReviews,
      subtitle: "Customer Reviews",
      icon: MessageSquare,
    },
    {
      title: "Recommendation",
      value: `${stats.recommendationRate}%`,
      subtitle: "Rated 4★ & Above",
      icon: ThumbsUp,
    },
    {
      title: "Customers",
      value: stats.uniqueCustomers,
      subtitle: "Reviewed Vendors",
      icon: Users,
    },
  ];

  return (
    <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => {
        const Icon =
          card.icon;

        return (
          <div
            key={card.title}
            className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="w-fit rounded-2xl bg-orange-100 p-3">

              <Icon
                size={22}
                className="text-orange-600"
              />

            </div>

            <p className="mt-5 text-sm text-slate-500">
              {card.title}
            </p>

            <h3 className="mt-2 text-4xl font-bold text-slate-900">
              {card.value}
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              {card.subtitle}
            </p>

          </div>
        );
      })}
    </section>
  );
}