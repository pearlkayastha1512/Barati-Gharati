"use client";

import { useEffect } from "react";
import { toast } from "sonner";

import { Vendor } from "@/types/vendor";

import { useAuthStore } from "@/store/authStore";
import { useWishlistStore } from "@/store/wishlistStore";

export function useWishlist(vendor: Vendor) {
  const { user, isAuthenticated } = useAuthStore();

  const {
    toggleWishlist,
    isVendorWishlisted,
    loadWishlist,
    hasLoaded,
  } = useWishlistStore();

  useEffect(() => {
    if (isAuthenticated && !hasLoaded) {
      loadWishlist();
    }
  }, [hasLoaded, isAuthenticated, loadWishlist]);

  const isWishlisted =
    isAuthenticated &&
    isVendorWishlisted(vendor.id);

  const handleToggleWishlist = async () => {
    if (!isAuthenticated || !user) {
      toast.error("Please login to add vendors to your wishlist.");
      return;
    }

    const alreadyWishlisted = isWishlisted;

    const success = await toggleWishlist(vendor.id);

    if (!success) {
      toast.error(
        "Unable to update wishlist. Please try again."
      );
      return;
    }

    if (alreadyWishlisted) {
      toast.success("Removed from wishlist.");
    } else {
      toast.success("Added to wishlist.");
    }
  };

  return {
    isWishlisted,
    handleToggleWishlist,
  };
}