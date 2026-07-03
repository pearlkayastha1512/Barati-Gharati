"use client";

import { useMemo } from "react";

import {
  BriefcaseBusiness,
  Star,
  IndianRupee,
  TrendingUp,
} from "lucide-react";

import { useServiceStore } from "@/store/serviceStore";

export default function ServiceStats() {
  const services = useServiceStore(
    (state) => state.services
  );

  const stats = useMemo(() => {
    const totalServices = services.length;

    const totalReviews = services.reduce(
      (sum, service) =>
        sum + service.reviews,
      0
    );

    const averageRating =
      totalServices > 0
        ? (
            services.reduce(
              (sum, service) =>
                sum + service.rating,
              0
            ) / totalServices
          ).toFixed(1)
        : "0.0";

    const averagePrice =
      totalServices > 0
        ? Math.round(
            services.reduce(
              (sum, service) =>
                sum + service.price,
              0
            ) / totalServices
          )
        : 0;

    const startingPrice =
      totalServices > 0
        ? Math.min(
            ...services.map(
              (service) =>
                service.price
            )
          )
        : 0;

    return {
      totalServices,
      totalReviews,
      averageRating,
      averagePrice,
      startingPrice,
    };
  }, [services]);

  const cards = [
    {
      title: "Services",
      value: stats.totalServices,
      subtitle: "Total Services",
      icon: BriefcaseBusiness,
    },
    {
      title: "Rating",
      value: stats.averageRating,
      subtitle: `${stats.totalReviews} Reviews`,
      icon: Star,
    },
    {
      title: "Average Price",
      value: `₹${stats.averagePrice.toLocaleString(
        "en-IN"
      )}`,
      subtitle: "Per Service",
      icon: TrendingUp,
    },
    {
      title: "Starting From",
      value: `₹${stats.startingPrice.toLocaleString(
        "en-IN"
      )}`,
      subtitle: "Lowest Price",
      icon: IndianRupee,
    },
  ];

  return (
    <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.title}
            className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="w-fit rounded-2xl bg-blue-100 p-3">

              <Icon
                size={22}
                className="text-blue-700"
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