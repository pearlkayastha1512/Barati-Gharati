
"use client";

import { useEffect, useState } from "react";

import Image from "next/image";
import Link from "next/link";
import { Heart, MapPin, Star } from "lucide-react";

import { getVendors } from "@/services/vendor.service";
import { useWishlist } from "@/hooks/useWishlist";
import { useVendorStore } from "@/store/vendorStore";

import { Vendor } from "@/types/vendor";

function VendorListingCard({
  vendor,
}: {
  vendor: Vendor;
}) {
  const {
    isWishlisted,
    handleToggleWishlist,
  } = useWishlist(vendor);

  return (
    <article className="group overflow-hidden rounded-3xl border border-white/10 bg-white/[0.08] shadow-xl shadow-black/20 transition-all duration-500 hover:-translate-y-2 hover:bg-white/[0.11]">
      <div className="relative h-60 overflow-hidden">
        <Image
          src={vendor.image}
          alt={vendor.name}
          fill
          sizes="
            (max-width:768px) 100vw,
            (max-width:1280px) 50vw,
            33vw
          "
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

        <button
          type="button"
          onClick={handleToggleWishlist}
          aria-label={
            isWishlisted
              ? "Remove from wishlist"
              : "Add to wishlist"
          }
          className={`absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full border shadow-lg backdrop-blur transition hover:bg-rose-600 hover:text-white ${
            isWishlisted
              ? "border-rose-300 bg-rose-600 text-white"
              : "border-white/20 bg-black/35 text-rose-100"
          }`}
        >
          <Heart
            size={20}
            className={
              isWishlisted
                ? "fill-current"
                : ""
            }
          />
        </button>

        <div className="absolute bottom-4 right-4 flex items-center gap-1 rounded-full border border-white/15 bg-black/40 px-3 py-1 text-sm font-semibold text-white backdrop-blur">
          <Star
            size={14}
            className="fill-yellow-400 text-yellow-400"
          />
          {vendor.rating} ({vendor.reviews})
        </div>
      </div>

      <div className="space-y-5 p-6">
        <div>
          <p className="text-sm font-semibold uppercase text-rose-300">
            {vendor.category}
          </p>

          <h3 className="mt-2 text-2xl font-bold text-white">
            {vendor.name}
          </h3>
        </div>

        <div className="flex items-center gap-2 text-rose-100/65">
          <MapPin size={18} />
          <span>{vendor.city}</span>
        </div>

        <div>
          <p className="text-sm text-rose-100/50">
            Starting From
          </p>

          <h4 className="mt-1 text-3xl font-bold text-rose-300">
            ₹{vendor.price.toLocaleString("en-IN")}
          </h4>
        </div>

        <div className="flex gap-3">
          <Link
            href={`/vendors/${vendor.id}`}
            className="flex-1 rounded-xl border border-rose-300/25 py-3 text-center font-semibold text-rose-50 transition hover:border-rose-300 hover:bg-rose-400/10"
          >
            View Profile
          </Link>

          <Link
            href={`/vendors/${vendor.id}`}
            className="flex-1 rounded-xl bg-rose-600 py-3 text-center font-semibold text-white shadow-lg shadow-rose-950/30 transition hover:bg-rose-500"
          >
            Book Now
          </Link>
        </div>
      </div>
    </article>
  );
}

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


 const allVendors = registeredVendors.filter(
   (vendor) => vendor.id != null
 );

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
        <h2 className="text-2xl font-bold text-white">
          {filteredVendors.length} Vendors Found
        </h2>

        <p className="text-sm text-rose-100/60">
          Showing premium verified vendors
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
        {filteredVendors.map((vendor) => (
          <VendorListingCard
            key={vendor.id}
            vendor={vendor}
          />
        ))}
      </div>
    </section>
  );
}
