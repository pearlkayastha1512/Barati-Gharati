import { create } from "zustand";
import {
  BackendNotification,
  getNotifications,
  markNotificationRead,
  deleteNotification,
} from "../api/vendorNotifications.api";

export interface VendorNotification {
  id: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

interface VendorNotificationsState {
  notifications: VendorNotification[];
  fetchNotifications: () => Promise<void>;
  toggleRead: (id: string, isRead: boolean) => Promise<void>;
  removeNotification: (id: string) => Promise<void>;
}

export const useVendorNotificationsStore =
  create<VendorNotificationsState>((set, get) => ({
    notifications: [],

    fetchNotifications: async () => {
      try {
        const data = await getNotifications();

        set({
          notifications: data,
        });
      } catch (e) {
        console.log("FETCH NOTIFICATIONS ERROR", e);
      }
    },

    toggleRead: async (id, isRead) => {
      try {
        await markNotificationRead(id, isRead);
        await get().fetchNotifications();
      } catch (e) {
        console.log(e);
      }
    },

    removeNotification: async (id) => {
      try {
        await deleteNotification(id);
        await get().fetchNotifications();
      } catch (e) {
        console.log(e);
      }
    },
  }));