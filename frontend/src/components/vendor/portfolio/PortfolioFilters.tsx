"use client";

import { Search } from "lucide-react";

interface PortfolioFiltersProps {
  search: string;

  setSearch: (
    value: string
  ) => void;

  category: string;

  setCategory: (
    value: string
  ) => void;

  categories: string[];
}

export default function PortfolioFilters({
  search,
  setSearch,
  category,
  setCategory,
  categories,
}: PortfolioFiltersProps) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

      <div className="flex flex-col gap-4 xl:flex-row">

        {/* Search */}

        <div className="relative flex-1">

          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            type="text"
            placeholder="Search portfolio..."
            className="h-12 w-full rounded-2xl border border-slate-200 bg-white pl-11 pr-4 text-gray-700 outline-none transition focus:border-[#e4005a] focus:ring-2 focus:ring-[#ffe1ec]"
          />

        </div>

        {/* Category */}

        <select
          value={category}
          onChange={(e) =>
            setCategory(e.target.value)
          }
          className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-gray-700 outline-none transition focus:border-[#e4005a] focus:ring-2 focus:ring-[#ffe1ec]"
        >
          <option value="All">
            All Categories
          </option>

          {categories.map((category) => (
            <option
              key={category}
              value={category}
            >
              {category}
            </option>
          ))}
        </select>

      </div>

    </section>
  );
}