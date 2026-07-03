
"use client";
import Link from "next/link";
import VendorFilters from "./VendorFilters";
import VendorCard from "./VendorCard";
import { vendors } from "./vendor-data";




import { useMemo, useState } from "react";

interface FeaturedVendorsProps {
  showAll?: boolean;
}

export default function FeaturedVendors({
  showAll = false,
}: FeaturedVendorsProps) {
  const [activeCategory, setActiveCategory] =
  useState("All");

const filteredVendors = useMemo(() => {
  if (activeCategory === "All") {
    return vendors;
  }

  return vendors.filter(
    (vendor) =>
      vendor.category === activeCategory
  );
}, [activeCategory]);

const displayedVendors = showAll
  ? filteredVendors
  : filteredVendors.slice(0, 4);

  return (
    <section
      id="featured-section"
      className="bg-gradient-to-b from-rose-50 to-white py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-14 text-center">
          <p className="font-semibold uppercase tracking-[0.3em] text-rose-500">
            FEATURED VENDORS
          </p>

          <h2 className="mt-4 text-4xl font-bold text-gray-900 md:text-5xl">
            Find Your Perfect Wedding Partner
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-lg text-gray-600">
            Handpicked venues and professionals trusted by thousands of happy
            couples.
          </p>
        </div>

        {/* Filters */}
       <VendorFilters
  activeCategory={activeCategory}
  onCategoryChange={
    setActiveCategory
  }
/>

        {/* Vendors Grid */}
        <div className="mt-14 grid grid-cols-1 gap-8 sm:grid-cols-2 xl:grid-cols-4">
          {displayedVendors.map((vendor) => (
            <VendorCard key={vendor.id} vendor={vendor} />
          ))}
        </div>

        {/* View All Button (Homepage Only) */}
        {!showAll && (
          <div className="mt-16 flex justify-center">
            <Link
              href="/vendors"
              className="group inline-flex items-center gap-2 rounded-full border border-rose-500 px-8 py-4 font-semibold text-rose-500 transition-all duration-300 hover:bg-rose-500 hover:text-white hover:shadow-xl"
            >
              View All Vendors
              <span className="transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}