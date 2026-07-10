import { create } from "zustand";

interface VendorSettingsState {
  // Local-only preference toggles
  businessVisibility: boolean;
  acceptNewBookings: boolean;
  displayPricingPublicly: boolean;
  availabilityCalendarVisible: boolean;
  newBookingNotifications: boolean;
  paymentAlerts: boolean;
  customerMessageAlerts: boolean;
  marketingEmails: boolean;

  isSavingAccount: boolean;
  isChangingPassword: boolean;

  toggleSetting: (key: keyof VendorSettingsState) => void;

  updateAccount: (payload: {
    ownerName?: string;
    email?: string;
    phone?: string;
    businessName?: string;
  }) => Promise<{ success: boolean; message?: string }>;

  submitPasswordChange: (
    currentPassword: string,
    newPassword: string
  ) => Promise<{ success: boolean; message?: string }>;
}

export const useVendorSettingsStore = create<VendorSettingsState>((set) => ({
  businessVisibility: true,
  acceptNewBookings: true,
  displayPricingPublicly: true,
  availabilityCalendarVisible: true,
  newBookingNotifications: true,
  paymentAlerts: true,
  customerMessageAlerts: true,
  marketingEmails: true,

  isSavingAccount: false,
  isChangingPassword: false,

  toggleSetting: (key) => {
    set((state) => ({
      [key]: !state[key as keyof VendorSettingsState],
    } as Partial<VendorSettingsState>));
  },

  // Update Account
  updateAccount: async (payload) => {
    try {
      set({ isSavingAccount: true });

      // =====================================================
      // TODO: Call Update Account API here
      // Example:
      // await updateVendorAccount(payload);
      // =====================================================

      console.log("Account Details:", payload);

      // Mock API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      set({ isSavingAccount: false });

      return {
        success: true,
        message: "Account updated successfully.",
      };
    } catch (error) {
      set({ isSavingAccount: false });

      return {
        success: false,
        message: "Failed to update account.",
      };
    }
  },

  // Change Password
  submitPasswordChange: async (currentPassword, newPassword) => {
    try {
      set({ isChangingPassword: true });

      // =====================================================
      // TODO: Call Change Password API here
      // Example:
      // await changePassword({
      //   currentPassword,
      //   newPassword,
      // });
      // =====================================================

      console.log("Current Password:", currentPassword);
      console.log("New Password:", newPassword);

      // Mock API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      set({ isChangingPassword: false });

      return {
        success: true,
        message: "Password changed successfully.",
      };
    } catch (error) {
      set({ isChangingPassword: false });

      return {
        success: false,
        message: "Failed to change password.",
      };
    }
  },
}));