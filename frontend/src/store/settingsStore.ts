import { create } from "zustand";

import { AppSettings } from "@/types/settings";

import { settingsService } from "@/services/settings.service";

interface SettingsStore {
  settings: AppSettings | null;

  loadSettings: (
    customerId: string
  ) => void;

  updateSettings: (
    settings: AppSettings
  ) => void;
}

export const useSettingsStore =
  create<SettingsStore>((set) => ({
    settings: null,

    loadSettings: (
      customerId
    ) => {
      set({
        settings:
          settingsService.getSettings(
            customerId
          ),
      });
    },

    updateSettings: (
      settings
    ) => {
      settingsService.updateSettings(
        settings
      );

      set({
        settings,
      });
    },
  }));