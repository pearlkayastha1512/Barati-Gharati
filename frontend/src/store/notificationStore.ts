import { create } from "zustand";

import { Notification } from "@/types/notification";

import {
  getNotifications,
  createNotification,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
} from "@/services/notification.service";

interface NotificationStore {
  notifications: Notification[];

  isLoading: boolean;

  setNotifications: (
    notifications: Notification[]
  ) => void;

  refreshNotifications: () => Promise<void>;

  addNotification: (
    notification: Notification
  ) => Promise<void>;

  markAsRead: (
    id: string
  ) => Promise<void>;

  markAllAsRead: (
    userId: string
  ) => Promise<void>;

  removeNotification: (
    id: string
  ) => Promise<void>;
}

export const useNotificationStore =
  create<NotificationStore>((set, get) => ({
    notifications: [],

    isLoading: false,

    setNotifications: (notifications) =>
      set({
        notifications,
      }),

    refreshNotifications: async () => {
      set({
        isLoading: true,
      });

      try {
        const notifications =
          await getNotifications();

        set({
          notifications,
        });
      } finally {
        set({
          isLoading: false,
        });
      }
    },

    addNotification: async (notification) => {
      await createNotification(notification);

      const notifications =
        await getNotifications();

      set({
        notifications,
      });
    },

    markAsRead: async (id) => {
      set({
        notifications: get().notifications.map(
          (notification) =>
            notification.id === id
              ? {
                  ...notification,
                  isRead: true,
                }
              : notification
        ),
      });

      await markNotificationAsRead(id);
    },

    markAllAsRead: async (userId) => {
      const notifications = get().notifications;

      await markAllNotificationsAsRead(
        notifications.filter(
          (notification) =>
            notification.userId === userId
        )
      );

      set({
        notifications: notifications.map(
          (notification) =>
            notification.userId === userId
              ? {
                  ...notification,
                  isRead: true,
                }
              : notification
        ),
      });
    },

    removeNotification: async (id) => {
      const success = await deleteNotification(id);

      if (!success) {
        return;
      }

      set({
        notifications: get().notifications.filter(
          (notification) =>
            notification.id !== id
        ),
      });
    },
  }));
