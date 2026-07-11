"use client";

import { useMemo } from "react";

import {
  Images,
  FolderOpen,
  CalendarDays,
  Clock3,
} from "lucide-react";

import { usePortfolioStore } from "@/store/portfolioStore";

export default function PortfolioStats() {
  const portfolio = usePortfolioStore(
    (state) => state.portfolio
  );

  const stats = useMemo(() => {
    const totalPhotos =
      portfolio.length;

    const totalCategories =
      new Set(
        portfolio.map(
          (item) =>
            item.categories?.length
              ? item.categories
              : [item.category]
        )
        .flat()
      ).size;

    const currentMonth =
      new Date().getMonth();

    const currentYear =
      new Date().getFullYear();

    const thisMonth =
      portfolio.filter(
        (item) => {
          const date =
            new Date(
              item.createdAt
            );

          return (
            date.getMonth() ===
              currentMonth &&
            date.getFullYear() ===
              currentYear
          );
        }
      ).length;

    const latestUpload =
      portfolio.length > 0
        ? new Date(
            Math.max(
              ...portfolio.map(
                (item) =>
                  new Date(
                    item.createdAt
                  ).getTime()
              )
            )
          ).toLocaleDateString(
            "en-GB",
            {
              day: "2-digit",
              month: "short",
              year: "numeric",
            }
          )
        : "--";

    return {
      totalPhotos,
      totalCategories,
      thisMonth,
      latestUpload,
    };
  }, [portfolio]);

  const cards = [
    {
      title: "Portfolio Items",
      value: stats.totalPhotos,
      subtitle:
        "Uploaded",
      icon: Images,
    },
    {
      title: "Categories",
      value:
        stats.totalCategories,
      subtitle:
        "Used",
      icon: FolderOpen,
    },
    {
      title: "This Month",
      value: stats.thisMonth,
      subtitle:
        "Uploads",
      icon: CalendarDays,
    },
    {
      title: "Latest Upload",
      value:
        stats.latestUpload,
      subtitle:
        "Recent Work",
      icon: Clock3,
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
            <div className="w-fit rounded-2xl bg-[#ffe1ec] p-3">

              <Icon
                size={22}
                className="text-[#e4005a]"
              />

            </div>

            <p className="mt-5 text-sm text-slate-500">
              {card.title}
            </p>

            <h3 className="mt-2 text-3xl font-bold text-slate-900">
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
