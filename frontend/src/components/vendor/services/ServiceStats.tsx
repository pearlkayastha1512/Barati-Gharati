"use client";

//import { useMemo } from "react";

import {
  BriefcaseBusiness,
  Star,
  IndianRupee,
  TrendingUp,
} from "lucide-react";

import { useServiceStore } from "@/store/serviceStore";
import { useEffect, useMemo } from "react";
import { useVendorProfile } from "@/hooks/useVendorProfile";
import { useReviewStore } from "@/store/reviewStore";
export default function ServiceStats() {
  const services = useServiceStore(
    (state) => state.services
  );
  const { vendor } = useVendorProfile();

const reviews = useReviewStore((state) => state.reviews);

const loadVendorReviews = useReviewStore(
  (state) => state.loadVendorReviews
);

useEffect(() => {
  if (!vendor) return;

  void loadVendorReviews(vendor.id);
}, [vendor, loadVendorReviews]);
  const stats = useMemo(() => {
    const totalServices = services.length;

    const totalReviews = reviews.length;

const averageRating =
  totalReviews === 0
    ? "0.0"
    : (
        reviews.reduce(
          (sum, review) => sum + review.rating,
          0
        ) / totalReviews
      ).toFixed(1);

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
  }, [services,reviews]);

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
            <div className="w-fit rounded-2xl bg-[#ffe1ec] p-3">

              <Icon
                size={22}
                className="text-[#e4005a]"
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