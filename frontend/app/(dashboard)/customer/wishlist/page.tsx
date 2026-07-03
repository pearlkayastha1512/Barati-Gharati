"use client";

import { useEffect, useMemo } from "react";

import WishlistHero from "@/components/wishlist/WishlistHero";
import WishlistSummary from "@/components/wishlist/WishlistSummary";
import WishlistFilters from "@/components/wishlist/WishlistFilters";
import WishlistCard from "@/components/wishlist/WishlistCard";

import { useAuthStore } from "@/store/authStore";
import { useWishlistStore } from "@/store/wishlistStore";

export default function WishlistPage() {
  const { user } = useAuthStore();

  const {
    wishlist,
    sortBy,
    loadWishlist,
  } = useWishlistStore();

  useEffect(() => {
    if (user) {
      loadWishlist(user._id);
    }
  }, [user, loadWishlist]);

  const sortedWishlist = useMemo(() => {
    const items = [...wishlist];

    switch (sortBy) {
      case "Highest Rated":
        return items.sort(
          (a, b) => b.rating - a.rating
        );

      case "Price Low → High":
        return items.sort(
          (a, b) =>
            a.startingPrice - b.startingPrice
        );

      case "Price High → Low":
        return items.sort(
          (a, b) =>
            b.startingPrice - a.startingPrice
        );

      case "Latest Saved":
      default:
        return items.sort(
          (a, b) =>
            new Date(b.addedAt).getTime() -
            new Date(a.addedAt).getTime()
        );
    }
  }, [wishlist, sortBy]);

  return (
    <div className="space-y-8">
      <WishlistHero />

      <WishlistSummary />

      <WishlistFilters />

      {sortedWishlist.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-gray-300 bg-white py-20 text-center">
          <h3 className="text-2xl font-semibold text-gray-700">
            Your wishlist is empty
          </h3>

          <p className="mt-3 text-gray-500">
            Start exploring vendors and save your favourites.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
          {sortedWishlist.map((item) => (
            <WishlistCard
              key={item.id}
              vendorName={item.vendorName}
              category={item.category}
              city={item.city}
              rating={item.rating}
              startingPrice={item.startingPrice}
              image={item.image}
            />
          ))}
        </div>
      )}
    </div>
  );
}