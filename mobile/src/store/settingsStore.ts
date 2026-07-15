import { create } from "zustand";
import { getMyProfile, updateMyProfile, changeMyPassword } from "../api/users.api";
import { useAuthStore } from "./authStore";
import { saveUser } from "../utils/secureStore";

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
  weddingDate: string;
  venue: string;
  guestCount: string;
  occupation: string;
  theme: string;
};

interface SettingsState {
  profile: ProfileData;
  isLoading: boolean;
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
  fetchProfile: () => Promise<void>;
  updateProfile: (data: Partial<ProfileData>) => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<{ success: boolean; error?: string }>;
  toggleNotification: (key: keyof SettingsState["notifications"]) => void;
  togglePrivacy: (key: keyof SettingsState["privacy"]) => void;
  toggleSecurity: (key: keyof SettingsState["security"]) => void;
}

const emptyProfile: ProfileData = {
  fullName: "",
  email: "",
  phone: "",
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
};

export const useSettingsStore = create<SettingsState>((set, get) => ({
  profile: emptyProfile,
  isLoading: false,

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

  // Only pulls name/email/phone from backend — the rest of ProfileData
  // has no DB columns yet, so those fields stay whatever they were locally.
  fetchProfile: async () => {
    try {
      set({ isLoading: true });
      const data = await getMyProfile();
      set((state) => ({
        profile: {
          ...state.profile,
          fullName: data.name,
          email: data.email,
          phone: data.phone ?? "",
        },
        isLoading: false,
      }));
    } catch (error) {
      console.log("FETCH PROFILE ERROR =>", error);
      set({ isLoading: false });
    }
  },

  // Only name + phone are sent to the backend; other fields update locally only.
  updateProfile: async (data) => {
    const previous = get().profile;

    set((state) => ({ profile: { ...state.profile, ...data } }));

    const backendPayload: { name?: string; phone?: string } = {};
    if (data.fullName !== undefined) backendPayload.name = data.fullName;
    if (data.phone !== undefined) backendPayload.phone = data.phone;

    if (Object.keys(backendPayload).length === 0) return; // nothing backend-relevant changed

    try {
      await updateMyProfile(backendPayload);

      // Keep authStore's user object in sync too — ProfileScreen (and anywhere else
      // that reads user.name/user.phone) was reading stale values from here because
      // updating this store never touched useAuthStore before.
      const currentUser = useAuthStore.getState().user;
      if (currentUser) {
        const updatedUser = {
          ...currentUser,
          ...(backendPayload.name !== undefined ? { name: backendPayload.name } : {}),
          ...(backendPayload.phone !== undefined ? { phone: backendPayload.phone } : {}),
        };

        useAuthStore.setState({ user: updatedUser });

        // Also persist to SecureStore, so the fix survives app restart —
        // otherwise restoreSession() would pull the old phone/name back out
        // of SecureStore next time the app launches.
        await saveUser(updatedUser);
      }
    } catch (error) {
      console.log("UPDATE PROFILE ERROR =>", error);
      set({ profile: previous }); // rollback
    }
  },

  changePassword: async (currentPassword, newPassword) => {
    try {
      await changeMyPassword({ currentPassword, newPassword });
      return { success: true };
    } catch (error: any) {
      console.log("CHANGE PASSWORD ERROR =>", error);
      const message = error?.response?.data?.message ?? "Unable to change password.";
      return { success: false, error: message };
    }
  },

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