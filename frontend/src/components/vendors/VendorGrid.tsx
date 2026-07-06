
"use client";

import { useEffect, useMemo, useState } from "react";

import VendorCard from "@/components/home/featured-vendors/VendorCard";
import { vendors as demoVendors } from "@/components/home/featured-vendors/vendor-data";

import { getVendors } from "@/services/vendor.service";
import { useVendorStore } from "@/store/vendorStore";

import { Vendor } from "@/types/vendor";

export default function VendorGrid() {
  const {
    search,
    city,
    category,
    rating,
    budget,
    cities,
    categories,
  } = useVendorStore();

  const [registeredVendors, setRegisteredVendors] =
    useState<Vendor[]>([]);
useEffect(() => {
  async function loadVendors() {
    const vendors = await getVendors();

    setRegisteredVendors(vendors);
  }

  loadVendors();
}, []);


 const allVendors = registeredVendors;

  const filteredVendors = allVendors.filter((vendor) => {
    const matchesSearch =
      vendor.name
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      vendor.city
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      vendor.category
        .toLowerCase()
        .includes(search.toLowerCase());

    const matchesCity =
      !city || vendor.city === city;

    const matchesBudget =
      vendor.price <= budget;

    const matchesSidebarCity =
      cities.length === 0 ||
      cities.includes(vendor.city);

    const matchesCategory =
      (!category ||
        vendor.category === category) &&
      (categories.length === 0 ||
        categories.includes(
          vendor.category
        ));

    const matchesRating =
      rating === 0 ||
      vendor.rating >= rating;

    return (
      matchesSearch &&
      matchesCity &&
      matchesSidebarCity &&
      matchesCategory &&
      matchesRating &&
      matchesBudget
    );
  });

  return (
    <section>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">
          {filteredVendors.length} Vendors Found
        </h2>

        <p className="text-sm text-gray-500">
          Showing premium verified vendors
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
        {filteredVendors.map((vendor) => (
          <VendorCard
            key={vendor.id}
            vendor={vendor}
          />
        ))}
      </div>
    </section>
  );
}