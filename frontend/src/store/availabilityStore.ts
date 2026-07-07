import { create } from "zustand";

import { Availability } from "@/types/availability";

import {
  createAvailability,
  deleteAvailability,
  getAvailability,
  getVendorAvailability,
} from "@/services/availability.service";

interface AvailabilityStore {
  availability: Availability[];
  selectedAvailability: Availability | null;
  isLoading: boolean;

  loadAvailability: () => Promise<void>;

  loadVendorAvailability: (
    vendorId: number
  ) => Promise<void>;

  setSelectedAvailability: (
    item: Availability | null
  ) => void;

  addAvailability: (item: {
    date: string;
    reason?: string;
  }) => Promise<boolean>;

  deleteExistingAvailability: (
    id: string
  ) => Promise<boolean>;
}

export const useAvailabilityStore =
  create<AvailabilityStore>((set) => ({
    availability: [],
    selectedAvailability: null,
    isLoading: false,

    loadAvailability: async () => {
      set({ isLoading: true });

      try {
        const availability =
          await getAvailability();

        set({ availability });
      } finally {
        set({ isLoading: false });
      }
    },

    loadVendorAvailability: async (
      vendorId
    ) => {
      set({ isLoading: true });

      try {
        const availability =
          await getVendorAvailability(
            vendorId
          );

        set({ availability });
      } finally {
        set({ isLoading: false });
      }
    },

    setSelectedAvailability: (item) => {
      set({
        selectedAvailability: item,
      });
    },

    addAvailability: async (item) => {
      const created =
        await createAvailability(item);

      if (!created) {
        return false;
      }

      const availability =
        await getAvailability();

      set({ availability });

      return true;
    },

    deleteExistingAvailability: async (
      id
    ) => {
      const deleted =
        await deleteAvailability(id);

      if (!deleted) {
        return false;
      }

      const availability =
        await getAvailability();

      set({ availability });

      return true;
    },
  }));
