"use client";

import {
  Search,
  MapPin,
  SlidersHorizontal,
} from "lucide-react";

import { useVendorStore } from "@/store/vendorStore";
import { CITIES } from "@/constants/cities";

export default function SearchBar() {
  const {
    search,
    setSearch,
    city,
    setCity,
  } = useVendorStore();

  return (
    <div className="sticky top-24 z-30 mb-10 rounded-3xl border border-white/10 bg-white/[0.08] p-5 shadow-xl shadow-black/20 backdrop-blur-xl">
      <div className="flex flex-col gap-4 lg:flex-row">
        {/* Search */}
        <div className="relative flex-1">
          <Search
            size={20}
            className="absolute left-5 top-1/2 -translate-y-1/2 text-rose-100/50"
          />

          <input
            type="text"
            placeholder="Search vendors, venues, photographers..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="
              h-14
              w-full
              rounded-2xl
              border
              border-white/10
              bg-[#1f0d14]/85
              pl-14
              pr-4
              text-rose-50
              outline-none
              transition
              placeholder:text-rose-100/40
              focus:border-rose-300
              focus:bg-[#2a121b]
            "
          />
        </div>

        {/* City */}
        <div className="relative w-full lg:w-64">
          <MapPin
            size={20}
            className="absolute left-5 top-1/2 -translate-y-1/2 text-rose-100/50"
          />

          <select
            value={city}
            onChange={(e) =>
              setCity(e.target.value)
            }
            className="
              h-14
              w-full
              rounded-2xl
              border
              border-white/10
              bg-[#1f0d14]/85
              pl-14
              pr-4
              text-rose-50
              outline-none
              transition
              focus:border-rose-300
            "
          >
            <option value="">
              All Cities
            </option>

            {CITIES.map((city) => (
              <option
                key={city}
                value={city}
              >
                {city}
              </option>
            ))}
          </select>
        </div>

        {/* Mobile Filter */}
        <button
          className="
            flex
            h-14
            items-center
            justify-center
            gap-2
            rounded-2xl
            border
            border-white/10
            px-6
            text-rose-50
            transition
            hover:bg-rose-600
            hover:text-white
            lg:hidden
          "
        >
          <SlidersHorizontal size={18} />
          Filters
        </button>
      </div>
    </div>
  );
}
