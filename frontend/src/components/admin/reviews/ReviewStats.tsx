"use client";

import { useMemo } from "react";

import {
  Star,
  MessageSquare,
  ThumbsUp,
  AlertTriangle,
} from "lucide-react";

import { getReviews } from "@/services/review.service";

export default function ReviewStats() {
  const stats = useMemo(() => {
    const reviews = getReviews();

   const average =
  reviews.length === 0
    ? "0.0"
    : (
        reviews.reduce(
          (sum, review) =>
            sum + review.rating,
          0
        ) / reviews.length
      ).toFixed(1);

    return {
      total: reviews.length,

      average,

      positive: reviews.filter(
        (review) => review.rating >= 4
      ).length,

      negative: reviews.filter(
        (review) => review.rating <= 2
      ).length,
    };
  }, []);

  return (
    <section className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
      <Card
        title="Total Reviews"
        value={stats.total.toString()}
        icon={MessageSquare}
        color="blue"
      />

      <Card
        title="Average Rating"
        value={stats.average}
        icon={Star}
        color="amber"
      />

      <Card
        title="Positive"
        value={stats.positive.toString()}
        icon={ThumbsUp}
        color="green"
      />

      <Card
        title="Negative"
        value={stats.negative.toString()}
        icon={AlertTriangle}
        color="red"
      />
    </section>
  );
}

interface CardProps {
  title: string;
  value: string;
  icon: React.ElementType;
  color:
    | "blue"
    | "green"
    | "amber"
    | "red";
}

function Card({
  title,
  value,
  icon: Icon,
  color,
}: CardProps) {
  const colors = {
    blue: {
      bg: "bg-blue-100",
      text: "text-blue-700",
    },

    green: {
      bg: "bg-green-100",
      text: "text-green-700",
    },

    amber: {
      bg: "bg-amber-100",
      text: "text-amber-700",
    },

    red: {
      bg: "bg-red-100",
      text: "text-red-700",
    },
  };

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">

      <div
        className={`inline-flex rounded-2xl p-3 ${colors[color].bg}`}
      >
        <Icon
          size={24}
          className={colors[color].text}
        />
      </div>

      <p className="mt-6 text-sm text-slate-500">
        {title}
      </p>

      <h2 className="mt-2 text-4xl font-bold text-slate-900">
        {value}
      </h2>

    </div>
  );
}