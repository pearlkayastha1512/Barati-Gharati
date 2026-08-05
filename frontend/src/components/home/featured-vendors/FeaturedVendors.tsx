
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import VendorFilters from "./VendorFilters";
import VendorCard from "./VendorCard";
import { getVendors } from "@/services/vendor.service";
import { vendors as staticVendors } from "./vendor-data";
import { Vendor } from "@/types/vendor";

interface FeaturedVendorsProps {
  showAll?: boolean;
}

export default function FeaturedVendors({
  showAll = false,
}: FeaturedVendorsProps) {
  const [activeCategory, setActiveCategory] = useState("All");
  const [vendorsList, setVendorsList] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDynamicVendors() {
      try {
        setLoading(true);
        const data = await getVendors();
        if (data && data.length > 0) {
          setVendorsList(data);
        } else {
          setVendorsList(staticVendors as unknown as Vendor[]);
        }
      } catch (err) {
        console.error("Failed to load dynamic vendors:", err);
        setVendorsList(staticVendors as unknown as Vendor[]);
      } finally {
        setLoading(false);
      }
    }
    loadDynamicVendors();
  }, []);

  const categoryList = useMemo(() => {
    const unique = Array.from(new Set(vendorsList.map((v) => v.category).filter(Boolean)));
    return ["All", ...unique];
  }, [vendorsList]);

  const filteredVendors = useMemo(() => {
    if (activeCategory === "All") {
      return vendorsList;
    }
    const cleanActive = activeCategory.toLowerCase();
    return vendorsList.filter((vendor) => {
      const cat = (vendor.category || "").toLowerCase();
      return cat.includes(cleanActive) || cleanActive.includes(cat);
    });
  }, [activeCategory, vendorsList]);

  const displayedVendors = showAll
    ? filteredVendors
    : filteredVendors.slice(0, 8);

  return (
    <section
      id="featured-section"
      className="bg-gradient-to-b from-[#e7a0b5] via-[#f3c5c4] to-[#fff1e7] py-24"
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
            Handpicked venues and professionals trusted by thousands of happy couples.
          </p>
        </div>

        {/* Filters */}
        <VendorFilters
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
          categories={categoryList}
        />

        {/* Dynamic Vendors Grid */}
        {loading ? (
          <div className="mt-14 flex justify-center py-12">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-rose-500 border-t-transparent" />
          </div>
        ) : displayedVendors.length === 0 ? (
          <div className="mt-14 text-center text-gray-600 py-12">
            <p className="text-lg font-medium">No vendors found in this category.</p>
          </div>
        ) : (
          <div className="mt-14 grid grid-cols-1 gap-8 sm:grid-cols-2 xl:grid-cols-4">
            {displayedVendors.map((vendor) => (
              <VendorCard key={vendor.id} vendor={vendor} />
            ))}
          </div>
        )}

        {/* View All Button */}
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
