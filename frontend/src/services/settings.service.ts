import { AppSettings } from "@/types/settings";

const STORAGE_KEY = "customer_settings";

class SettingsService {
  getSettings(
    customerId: string
  ): AppSettings {
    if (typeof window === "undefined") {
      return this.defaultSettings(
        customerId
      );
    }

    const data =
      localStorage.getItem(STORAGE_KEY);

    if (!data) {
      const settings =
        this.defaultSettings(customerId);

      this.saveSettings(settings);

      return settings;
    }

    return JSON.parse(data);
  }

  saveSettings(
    settings: AppSettings
  ) {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(settings)
    );
  }

  updateSettings(
    settings: AppSettings
  ) {
    this.saveSettings(settings);
  }

  private defaultSettings(
    customerId: string
  ): AppSettings {
    return {
      customerId,

      notifications: {
        email: true,

        bookingUpdates: true,

        vendorMessages: true,

        offers: true,
      },

      privacy: {
        publicProfile: true,

        activityStatus: true,

        shareWeddingProgress: true,

        marketingEmails: true,
      },

     security: {
  twoFactor: false,

  loginAlerts: true,
},
    };
  }
}

export const settingsService =
  new SettingsService();