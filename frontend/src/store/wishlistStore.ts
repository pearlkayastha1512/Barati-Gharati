import { create } from "zustand";

import { WishlistItem } from "@/types/wishlist";

import {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  isWishlisted,
  clearWishlist,
} from "@/services/wishlist.service";

interface WishlistStore {
  wishlist: WishlistItem[];

  // Sorting
  sortBy: string;

  setSortBy: (
    value: string
  ) => void;

  loadWishlist: (
    customerId: string
  ) => void;

  addVendor: (
    item: WishlistItem
  ) => void;

  removeVendor: (
    customerId: string,
    vendorId: number
  ) => void;

  toggleWishlist: (
    item: WishlistItem
  ) => void;

  isVendorWishlisted: (
    customerId: string,
    vendorId: number
  ) => boolean;

  clearCustomerWishlist: (
    customerId: string
  ) => void;
}

export const useWishlistStore =
  create<WishlistStore>((set) => ({
    wishlist: [],

    // Default sorting
    sortBy: "Latest Saved",

    setSortBy: (sortBy) =>
      set({
        sortBy,
      }),

    loadWishlist: (customerId) => {
      set({
        wishlist: getWishlist(customerId),
      });
    },

    addVendor: (item) => {
      addToWishlist(item);

      set({
        wishlist: getWishlist(
          item.customerId
        ),
      });
    },

    removeVendor: (
      customerId,
      vendorId
    ) => {
      removeFromWishlist(
        customerId,
        vendorId
      );

      set({
        wishlist:
          getWishlist(customerId),
      });
    },

    toggleWishlist: (item) => {
      if (
        isWishlisted(
          item.customerId,
          item.vendorId
        )
      ) {
        removeFromWishlist(
          item.customerId,
          item.vendorId
        );
      } else {
        addToWishlist(item);
      }

      set({
        wishlist: getWishlist(
          item.customerId
        ),
      });
    },

    isVendorWishlisted: (
      customerId,
      vendorId
    ) => {
      return isWishlisted(
        customerId,
        vendorId
      );
    },

    clearCustomerWishlist: (
      customerId
    ) => {
      clearWishlist(customerId);

      set({
        wishlist: [],
      });
    },
  }));