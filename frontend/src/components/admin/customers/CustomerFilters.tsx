"use client";

import { Search } from "lucide-react";

interface Props {
  search: string;
  setSearch: (value: string) => void;

  verification: string;
  setVerification: (value: string) => void;
}

export default function CustomerFilters({
  search,
  setSearch,
  verification,
  setVerification,
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
            placeholder="Search customer..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="w-full rounded-2xl border border-slate-200 py-3 pl-11 pr-4 outline-none transition focus:border-blue-600 text-gray-600"
          />
        </div>

        {/* Verification Filter */}

        <select
          value={verification}
          onChange={(e) =>
            setVerification(e.target.value)
          }
          className="rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-blue-600 text-gray-600"
        >
          <option value="all">
            All Customers
          </option>

          <option value="verified">
            Verified
          </option>

          <option value="unverified">
            Unverified
          </option>
        </select>
      </div>
    </section>
  );
}