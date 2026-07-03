import { create } from "zustand";

import { CustomerProfile } from "@/types/customerProfile";

import {
  customerProfileService,
} from "@/services/customerProfile.service";

interface CustomerProfileStore {
  profile: CustomerProfile | null;

  loadProfile: (
    customerId: string
  ) => void;

  updateProfile: (
    profile: CustomerProfile
  ) => void;

  resetProfile: () => void;
}

export const useCustomerProfileStore =
  create<CustomerProfileStore>((set) => ({
    profile: null,

    loadProfile: (
      customerId
    ) => {
      set({
        profile:
          customerProfileService.getProfile(
            customerId
          ),
      });
    },

    updateProfile: (
      profile
    ) => {
      customerProfileService.updateProfile(
        profile
      );

      set({
        profile,
      });
    },

    resetProfile: () => {
      set({
        profile: null,
      });
    },
  }));