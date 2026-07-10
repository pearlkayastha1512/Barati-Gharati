"use client";

import { Search, Filter } from "lucide-react";

interface BookingFiltersProps {
  search: string;

  setSearch: (
    value: string
  ) => void;

  status: string;

  setStatus: (
    value: string
  ) => void;
}

export default function BookingFilters({
  search,
  setSearch,
  status,
  setStatus,
}: BookingFiltersProps) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

        {/* Search */}

        <div className="relative w-full lg:max-w-md">

          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="text"
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            placeholder="Search customer, event or category..."
            className="h-12 w-full rounded-2xl border border-slate-200 bg-white pl-11 pr-4 text-gray-700 placeholder:text-gray-400 outline-none transition focus:border-[#e4005a] focus:ring-2 focus:ring-[#ffe1ec]"
          />

        </div>

        {/* Status Filter */}

        <div className="flex gap-3">

          <select
            value={status}
            onChange={(e) =>
              setStatus(
                e.target.value
              )
            }
            className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-gray-700 outline-none transition focus:border-[#e4005a] focus:ring-2 focus:ring-[#ffe1ec]"
          >
            <option value="All">
              All Status
            </option>

            <option value="Pending">
              Pending
            </option>

            <option value="Accepted">
              Accepted
            </option>

            <option value="Completed">
              Completed
            </option>

            <option value="Cancelled">
              Cancelled
            </option>

          </select>

          <button
            type="button"
            className="flex items-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 font-medium text-white transition hover:bg-slate-800"
          >
            <Filter size={18} />

            Filters

          </button>

        </div>

      </div>

    </section>
  );
}