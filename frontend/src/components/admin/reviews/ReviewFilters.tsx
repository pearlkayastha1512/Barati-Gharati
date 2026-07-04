"use client";

import { Search } from "lucide-react";

interface Props {
  search: string;
  setSearch: (value: string) => void;

  rating: string;
  setRating: (value: string) => void;
}

export default function ReviewFilters({
  search,
  setSearch,
  rating,
  setRating,
}: Props) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="grid gap-4 lg:grid-cols-2">

        {/* Search */}

        <div className="relative">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="text"
            placeholder="Search reviews..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="w-full rounded-2xl border border-slate-200 py-3 pl-11 pr-4 outline-none transition focus:border-blue-600 text-gray-600"
          />
        </div>

        {/* Rating Filter */}

        <select
          value={rating}
          onChange={(e) =>
            setRating(e.target.value)
          }
          className="rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-blue-600 text-gray-600"
        >
          <option value="all">
            All Ratings
          </option>

          <option value="5">
            ⭐⭐⭐⭐⭐ (5)
          </option>

          <option value="4">
            ⭐⭐⭐⭐ (4)
          </option>

          <option value="3">
            ⭐⭐⭐ (3)
          </option>

          <option value="2">
            ⭐⭐ (2)
          </option>

          <option value="1">
            ⭐ (1)
          </option>
        </select>

      </div>
    </section>
  );
}