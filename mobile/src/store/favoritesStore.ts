import { create } from "zustand";
import {
  addWishlistVendor,
  getWishlist,
  removeWishlistVendor,
} from "../api/wishlist.api";
import type { WishlistItem } from "../api/wishlist.api";

interface FavoritesState {
  favoriteIds: Set<string>;
  items: WishlistItem[];
  isLoading: boolean;
  loadFavorites: () => Promise<void>;
  toggleFavorite: (vendorId: string) => Promise<void>;
  isFavorite: (vendorId: string) => boolean;
  clearAllFavorites: () => Promise<void>;
}

const toFavoriteIds = (items: WishlistItem[]) =>
  new Set(items.map((item) => String(item.vendorId)));

export const useFavoritesStore = create<FavoritesState>((set, get) => ({
  favoriteIds: new Set(),
  items: [],
  isLoading: false,

  loadFavorites: async () => {
    set({ isLoading: true });
    try {
      const items = await getWishlist();
      set({ items, favoriteIds: toFavoriteIds(items), isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },

  toggleFavorite: async (vendorId) => {
    try {
      if (get().favoriteIds.has(vendorId)) {
        await removeWishlistVendor(vendorId);
      } else {
        await addWishlistVendor(vendorId);
      }

      const items = await getWishlist();
      set({ items, favoriteIds: toFavoriteIds(items) });
    } catch {
      // Keep the server-confirmed snapshot if a toggle request fails.
    }
  },

  isFavorite: (vendorId) => get().favoriteIds.has(vendorId),

  clearAllFavorites: async () => {
    try {
      const vendorIds = get().items.map((item) => String(item.vendorId));
      await Promise.all(vendorIds.map(removeWishlistVendor));
      set({ items: [], favoriteIds: new Set() });
    } catch {
      await get().loadFavorites();
    }
  },
}));
