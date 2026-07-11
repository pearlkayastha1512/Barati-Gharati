"use client";

import Image from "next/image";
import { Heart, MapPin, Share2, Star } from "lucide-react";

import { useWishlist } from "@/hooks/useWishlist";
import { Vendor } from "@/types/vendor";

interface VendorHeroProps {
  vendor: Vendor;
}

export default function VendorHero({ vendor }: VendorHeroProps) {
  const {
    isWishlisted,
    handleToggleWishlist,
  } = useWishlist(vendor);

  return (
    <section className="relative overflow-hidden rounded-3xl border border-white/10 shadow-2xl shadow-rose-950/40">

      {/* Cover Image */}
      <div className="relative h-[500px] w-full">

        <Image
          src={vendor.image}
          alt={vendor.name}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/20" />

        {/* Content */}
        <div className="absolute inset-0 flex items-end">

          <div className="w-full p-8 md:p-12">

            <div className="flex flex-wrap items-center gap-3">

              <span className="flex items-center gap-1 rounded-full border border-white/15 bg-black/35 px-4 py-2 text-sm font-semibold text-white backdrop-blur-md">

                <Star
                  size={16}
                  className="fill-yellow-400 text-yellow-400"
                />

                {vendor.rating}

                <span className="text-white/80">
                  ({vendor.reviews} Reviews)
                </span>

              </span>

              <span className="rounded-full bg-rose-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-rose-950/40">
                {vendor.category}
              </span>

            </div>

            <h1 className="mt-5 text-5xl font-bold text-white md:text-6xl">
              {vendor.name}
            </h1>

            <div className="mt-4 flex flex-wrap items-center gap-6 text-white">

              <div className="flex items-center gap-2">
                <MapPin size={18} />
                {vendor.city}
              </div>

              <div className="text-2xl font-bold">
                ₹{vendor.price.toLocaleString("en-IN")}
              </div>

            </div>

            <div className="mt-8 flex gap-4">

              <button
                type="button"
                onClick={handleToggleWishlist}
                aria-label={
                  isWishlisted
                    ? "Remove from wishlist"
                    : "Add to wishlist"
                }
                className={`flex items-center gap-2 rounded-xl px-6 py-3 font-semibold transition ${
                  isWishlisted
                    ? "bg-rose-600 text-white hover:bg-rose-500"
                    : "bg-white text-gray-950 hover:bg-rose-50"
                }`}
              >
                <Heart
                  size={18}
                  className={
                    isWishlisted
                      ? "fill-current"
                      : ""
                  }
                />
                {isWishlisted ? "Saved" : "Save"}
              </button>

              <button className="flex items-center gap-2 rounded-xl border border-white/25 bg-black/30 px-6 py-3 font-semibold text-white backdrop-blur-md transition hover:bg-white/15">
                <Share2 size={18} />
                Share
              </button>

            </div>

          </div>

        </div>

      </div>

    </section>
  );
}
