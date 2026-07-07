import { create } from "zustand";

export type NotificationItem = {
  id: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string; // ISO string
};

interface NotificationsState {
  notifications: NotificationItem[];
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
}

// TODO: once backend is connected, replace local state with API-backed state:
// - on mount, fetch via getNotifications()
// - markAsRead should call markNotificationRead(id) — optimistic update with rollback on failure
// - markAllAsRead should call markAllNotificationsRead()
// - removeNotification should call deleteNotification(id)
// This matches your Notification model: { id, title, message, isRead, createdAt, userId }
export const useNotificationsStore = create<NotificationsState>((set) => ({
  notifications: [], // starts empty — matches your "No notifications yet" state

  markAsRead: (id) => {
    set((state) => ({
      notifications: state.notifications.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
    }));
  },

  markAllAsRead: () => {
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
    }));
  },

  removeNotification: (id) => {
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    }));
  },
}));