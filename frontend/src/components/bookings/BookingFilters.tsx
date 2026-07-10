"use client";

import { SlidersHorizontal } from "lucide-react";

export default function BookingFilters() {
  return (
    <section className="flex flex-col gap-4 rounded-3xl border border-[#ffb3bf] bg-[#fffdf0] p-6 shadow-sm md:flex-row md:items-center md:justify-between">

      {/* Left */}

      <div>

        <h2 className="text-xl font-bold text-[#3f1d2f]">
          Manage Bookings
        </h2>

        <p className="mt-1 text-sm text-[#8d6171]">
          Organize and track all your vendor bookings.
        </p>

      </div>

      {/* Right */}

      <div className="flex items-center gap-4">

        <div className="relative">

          <SlidersHorizontal
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-[#ff8fa1]"
          />

          <select
            className="
              h-11
              rounded-2xl
              border
              border-[#ffb3bf]
              bg-white
              pl-11
              pr-10
              text-sm
              outline-none
              transition
              focus:border-[#ff4d6d]
            "
          >
            <option>Sort: Latest</option>
            <option>Oldest First</option>
            <option>Event Date</option>
            <option>Vendor Name</option>
          </select>

        </div>

      </div>

    </section>
  );
}
