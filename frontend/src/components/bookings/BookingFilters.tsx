"use client";

import { SlidersHorizontal } from "lucide-react";

export default function BookingFilters() {
  return (
    <section className="flex flex-col gap-4 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm md:flex-row md:items-center md:justify-between">

      {/* Left */}

      <div>

        <h2 className="text-xl font-bold text-gray-900">
          Manage Bookings
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Organize and track all your vendor bookings.
        </p>

      </div>

      {/* Right */}

      <div className="flex items-center gap-4">

        <div className="relative">

          <SlidersHorizontal
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <select
            className="
              h-11
              rounded-2xl
              border
              border-gray-200
              bg-white
              pl-11
              pr-10
              text-sm
              outline-none
              transition
              focus:border-indigo-500
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
