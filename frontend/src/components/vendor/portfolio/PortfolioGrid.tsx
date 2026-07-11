"use client";

import PortfolioCard from "./PortfolioCard";

import { Portfolio } from "@/types/portfolio";

import { usePortfolioStore } from "@/store/portfolioStore";

interface PortfolioGridProps {
  portfolio: Portfolio[];

  onEdit: () => void;
}

export default function PortfolioGrid({
  portfolio,
  onEdit,
}: PortfolioGridProps) {
  const {
    setSelectedPortfolio,
    deleteExistingPortfolio,
  } = usePortfolioStore();

  if (portfolio.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center">

        <h3 className="text-2xl font-bold text-slate-900">
          No Portfolio Found
        </h3>

        <p className="mt-3 text-slate-500">
          No portfolio items match your current filters.
        </p>

      </div>
    );
  }

  return (
    <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

      {portfolio.map((item) => (
        <PortfolioCard
          key={item.id}
          title={item.title}
          image={item.image}
          category={item.category}
          categories={item.categories}
          onEdit={() => {
            setSelectedPortfolio(item);

            onEdit();
          }}
          onDelete={() =>
            deleteExistingPortfolio(item.id)
          }
        />
      ))}

    </section>
  );
}
