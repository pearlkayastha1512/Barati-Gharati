import { create } from "zustand";

interface FavoritesState {
  favoriteIds: Set<string>;
  toggleFavorite: (vendorId: string) => void;
  isFavorite: (vendorId: string) => boolean;
  clearAllFavorites: () => void;
}

// TODO: once backend is connected, replace local Set with API-backed state:
// - on mount, fetch current favorites via getFavorites() and populate favoriteIds
// - toggleFavorite should call POST /favorites or DELETE /favorites/:vendorId
//   and only update local state after the request succeeds (or optimistically,
//   with rollback on failure — same pattern used in ChecklistScreen)
export const useFavoritesStore = create<FavoritesState>((set, get) => ({
  favoriteIds: new Set(),

  toggleFavorite: (vendorId) => {
    set((state) => {
      const updated = new Set(state.favoriteIds);
      if (updated.has(vendorId)) {
        updated.delete(vendorId);
      } else {
        updated.add(vendorId);
      }
      return { favoriteIds: updated };
    });
  },

  isFavorite: (vendorId) => get().favoriteIds.has(vendorId),

  clearAllFavorites: () => set({ favoriteIds: new Set() }),
}));