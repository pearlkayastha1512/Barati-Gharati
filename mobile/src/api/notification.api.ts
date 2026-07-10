import api from "./axios";

export type BackendNotification = {
  id: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  userId: string;
};

type ApiListResponse = { success: boolean; count: number; data: BackendNotification[] };
type ApiSingleResponse = { success: boolean; message?: string; data: BackendNotification };

export const getNotifications = async (): Promise<BackendNotification[]> => {
  const response = await api.get<ApiListResponse>("/notifications");
  return response.data.data;
};

export const markNotificationRead = async (id: string, isRead: boolean): Promise<BackendNotification> => {
  const response = await api.patch<ApiSingleResponse>(`/notifications/${id}/read`, { isRead });
  return response.data.data;
};

export const deleteNotification = async (id: string): Promise<void> => {
  await api.delete(`/notifications/${id}`);
};
export const createTestNotification = async () => {
  const response = await api.post("/notifications", {
    title: "Test Notification",
    message: "This is a test",
  });
  return response.data;
};