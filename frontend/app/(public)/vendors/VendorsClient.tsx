

"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

import SearchBar from "@/components/vendors/SearchBar";
import FilterSidebar from "@/components/vendors/FilterSidebar";
import SortDropdown from "@/components/vendors/SortDropdown";
import VendorGrid from "@/components/vendors/VendorGrid";


import { useVendorStore } from "@/store/vendorStore";

export default function VendorsPage() {
  const searchParams = useSearchParams();

 const {
  setCity,
  setCategory,
  setDate,
  resetFilters,
} = useVendorStore();
  

 useEffect(() => {
  const city = searchParams.get("city");
  const category = searchParams.get("category");
  const date = searchParams.get("date");

  // User came from Home Search
  if (city || category || date) {
    setCity(city ?? "");
    setCategory(category ?? "");
    setDate(date ?? "");
  }

  // User opened /vendors directly
  else {
    resetFilters();
  }
}, [
  searchParams,
  setCity,
  setCategory,
  setDate,
  resetFilters,
]);

  return (
    <main className="min-h-screen bg-[#261017] pt-32 text-white">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top_left,rgba(244,63,94,0.16),transparent_32%),linear-gradient(135deg,rgba(64,24,34,0.92),rgba(35,16,25,0.96)_55%,rgba(72,25,38,0.88))]" />

      <section className="relative mx-auto max-w-7xl px-6">

        <div className="mb-12">

          <h1 className="text-5xl font-bold text-white">
            Wedding Vendors
          </h1>

          <p className="mt-3 text-lg text-rose-100/75">
            Discover India&apos;s best wedding professionals.
          </p>

        </div>

        <SearchBar />

        <div className="mt-10 flex gap-10">

          <FilterSidebar />

          <div className="flex-1">

            <SortDropdown />

            <VendorGrid />

            

          </div>

        </div>

      </section>

    </main>
  );
}
