"use client";

import { Search } from "lucide-react";

interface ServiceFiltersProps {
  search: string;

  setSearch: (
    value: string
  ) => void;

  category: string;

  setCategory: (
    value: string
  ) => void;

  status: string;

  setStatus: (
    value: string
  ) => void;

  categories: string[];
}

export default function ServiceFilters({
  search,
  setSearch,
  category,
  setCategory,
  status,
  setStatus,
  categories,
}: ServiceFiltersProps) {
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
              setSearch(
                e.target.value
              )
            }
            type="text"
            placeholder="Search service..."
            className="h-12 w-full rounded-2xl border border-slate-200 bg-white pl-11 pr-4 text-gray-700 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
          />

        </div>

        {/* Category */}

        <select
          value={category}
          onChange={(e) =>
            setCategory(
              e.target.value
            )
          }
          className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-gray-700 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
        >
          <option value="All">
            All Categories
          </option>

          {categories.map(
            (category) => (
              <option
                key={category}
                value={category}
              >
                {category}
              </option>
            )
          )}
        </select>

        {/* Status */}

        <select
          value={status}
          onChange={(e) =>
            setStatus(
              e.target.value
            )
          }
          className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-gray-700 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
        >
          <option value="All">
            All Status
          </option>

          <option value="active">
            Active
          </option>

          <option value="draft">
            Draft
          </option>

          <option value="inactive">
            Inactive
          </option>

        </select>

      </div>

    </section>
  );
}