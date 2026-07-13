import api from "./axios";

export interface BackendNotification {
  id: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export const getNotifications = async (): Promise<BackendNotification[]> => {
  const res = await api.get("/notifications");
  return res.data.data;
};

export const markNotificationRead = async (
  id: string,
  isRead: boolean
) => {
  const res = await api.patch(`/notifications/${id}/read`, {
    isRead,
  });

  return res.data.data;
};

export const deleteNotification = async (id: string) => {
  const res = await api.delete(`/notifications/${id}`);
  return res.data;
};