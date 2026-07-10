import { create } from "zustand";
import {
  getNotifications,
  markNotificationRead,
  deleteNotification,
} from "../api/notification.api";

export type NotificationItem = {
  id: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
};

interface NotificationsState {
  notifications: NotificationItem[];
  isLoading: boolean;
  fetchNotifications: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  removeNotification: (id: string) => Promise<void>;
}

export const useNotificationsStore = create<NotificationsState>((set, get) => ({
  notifications: [],
  isLoading: false,

  fetchNotifications: async () => {
    try {
      set({ isLoading: true });
      const data = await getNotifications();
      set({ notifications: data, isLoading: false });
    } catch (error) {
      console.log("FETCH NOTIFICATIONS ERROR =>", error);
      set({ isLoading: false });
    }
  },

  markAsRead: async (id) => {
    // optimistic update
    set((state) => ({
      notifications: state.notifications.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
    }));

    try {
      await markNotificationRead(id, true);
    } catch (error) {
      console.log("MARK READ ERROR =>", error);
      // rollback on failure
      set((state) => ({
        notifications: state.notifications.map((n) => (n.id === id ? { ...n, isRead: false } : n)),
      }));
    }
  },

  markAllAsRead: async () => {
    const unread = get().notifications.filter((n) => !n.isRead);
    if (unread.length === 0) return;

    // optimistic update
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
    }));

    try {
      await Promise.all(unread.map((n) => markNotificationRead(n.id, true)));
    } catch (error) {
      console.log("MARK ALL READ ERROR =>", error);
      // on failure, just re-fetch from server to resync accurate state
      get().fetchNotifications();
    }
  },

  removeNotification: async (id) => {
    const previous = get().notifications;

    // optimistic update
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    }));

    try {
      await deleteNotification(id);
    } catch (error) {
      console.log("DELETE NOTIFICATION ERROR =>", error);
      // rollback on failure
      set({ notifications: previous });
    }
  },
}));