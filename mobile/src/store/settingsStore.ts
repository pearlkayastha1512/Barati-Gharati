import { create } from "zustand";

export type ProfileData = {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  gender: string;
  country: string;
  partnerName: string;
  partnerEmail: string;
  partnerPhone: string;
  weddingDate: string; // dd-mm-yyyy
  venue: string;
  guestCount: string;
  occupation: string;
  theme: string;
};

interface SettingsState {
  profile: ProfileData;
  notifications: {
    emailNotifications: boolean;
    bookingUpdates: boolean;
    vendorMessages: boolean;
    offersPromotions: boolean;
  };
  privacy: {
    publicProfile: boolean;
    activityStatus: boolean;
    shareWeddingProgress: boolean;
    marketingEmails: boolean;
  };
  security: {
    twoFactorAuth: boolean;
    loginAlerts: boolean;
  };
  updateProfile: (data: Partial<ProfileData>) => void;
  toggleNotification: (key: keyof SettingsState["notifications"]) => void;
  togglePrivacy: (key: keyof SettingsState["privacy"]) => void;
  toggleSecurity: (key: keyof SettingsState["security"]) => void;
}

// TODO: once backend is connected, replace local state with API-backed state:
// - on mount, fetch via getUserSettings() / getUserProfile()
// - updateProfile should call updateUserProfile(data)
// - each toggle should call updateNotificationPrefs() / updatePrivacyPrefs() / updateSecurityPrefs()
export const useSettingsStore = create<SettingsState>((set) => ({
  profile: {
    fullName: "user29",
    email: "user@gmail.com",
    phone: "8527636888",
    address: "",
    city: "",
    state: "",
    gender: "",
    country: "",
    partnerName: "",
    partnerEmail: "",
    partnerPhone: "",
    weddingDate: "",
    venue: "",
    guestCount: "0",
    occupation: "",
    theme: "",
  },
  notifications: {
    emailNotifications: true,
    bookingUpdates: true,
    vendorMessages: true,
    offersPromotions: true,
  },
  privacy: {
    publicProfile: true,
    activityStatus: true,
    shareWeddingProgress: true,
    marketingEmails: true,
  },
  security: {
    twoFactorAuth: false,
    loginAlerts: true,
  },

  updateProfile: (data) => set((state) => ({ profile: { ...state.profile, ...data } })),
  toggleNotification: (key) =>
    set((state) => ({
      notifications: { ...state.notifications, [key]: !state.notifications[key] },
    })),
  togglePrivacy: (key) =>
    set((state) => ({
      privacy: { ...state.privacy, [key]: !state.privacy[key] },
    })),
  toggleSecurity: (key) =>
    set((state) => ({
      security: { ...state.security, [key]: !state.security[key] },
    })),
}));