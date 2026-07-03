"use client";

import { Trash2 } from "lucide-react";
import { toast } from "sonner";

import { useAuthStore } from "@/store/authStore";
import { useWishlistStore } from "@/store/wishlistStore";

export default function WishlistFilters() {
  const { user } = useAuthStore();

  const {
    wishlist,
    sortBy,
    setSortBy,
    clearCustomerWishlist,
  } = useWishlistStore();

  const handleClearWishlist = () => {
  if (wishlist.length === 0) {
    toast.error("Your wishlist is already empty.");
    return;
  }

  if (!user) return;

  toast.warning("Clear your wishlist?", {
  description: "This action will remove all saved vendors.",
  action: {
    label: "Yes, Clear",
    onClick: () => {
      clearCustomerWishlist(user._id);
      toast.success("Wishlist cleared successfully.");
    },
  },
  duration: 7000,
});
};

  return (
    <section className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
      <div>
        <h2 className="text-xl font-bold text-gray-900">
          Saved Vendors
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Compare and book your favourites.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <select
          value={sortBy}
          onChange={(e) =>
            setSortBy(e.target.value)
          }
          className="h-11 rounded-2xl border border-gray-200 px-5 text-sm outline-none text-gray-600"
        >
          <option>Latest Saved</option>

          <option>Highest Rated</option>

          <option>Price Low → High</option>

          <option>Price High → Low</option>
        </select>

        <button
          onClick={handleClearWishlist}
          disabled={wishlist.length === 0}
          className={`
            flex
            items-center
            gap-2
            rounded-2xl
            px-5
            py-3
            font-semibold
            transition

            ${
              wishlist.length === 0
                ? "cursor-not-allowed bg-gray-100 text-gray-400"
                : "bg-red-500 text-white hover:bg-red-600"
            }
          `}
        >
          <Trash2 size={18} />

          Clear Wishlist
        </button>
      </div>
    </section>
  );
}