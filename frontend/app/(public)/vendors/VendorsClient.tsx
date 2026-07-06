

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
    <main className="min-h-screen bg-rose-50 pt-32">

      <section className="mx-auto max-w-7xl px-6">

        <div className="mb-12">

          <h1 className="text-5xl font-bold text-gray-900">
            Wedding Vendors
          </h1>

          <p className="mt-3 text-lg text-gray-600">
            Discover India's best wedding professionals.
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