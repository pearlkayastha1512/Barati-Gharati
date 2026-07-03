import { create } from "zustand";
import {
  saveOnboardingStatus,
  getOnboardingStatus,
} from "../utils/secureStore";

interface AppState {
  isFirstLaunch: boolean;

  loadApp: () => Promise<void>;

  completeOnboarding: () => Promise<void>;
}

export const useAppStore = create<AppState>((set) => ({
  isFirstLaunch: true,

  completeOnboarding: async () => {
    await saveOnboardingStatus();

    set({
      isFirstLaunch: false,
    });
  },

  loadApp: async () => {
    const status = await getOnboardingStatus();

    set({
      isFirstLaunch: !status,
    });
  },
}));