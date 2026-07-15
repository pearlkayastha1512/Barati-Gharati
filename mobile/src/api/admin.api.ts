import api from "./axios";
import {
  AdminCustomer,
  AdminDashboardResponse,
  AdminListResponse,
  AdminVendor,
  ChatModerationUser,
} from "../types/admin";

export const getAdminDashboard = async () => {
  const response = await api.get<AdminDashboardResponse>(
    "/admin/dashboard",
  );

  return response.data;
};

export const getAdminCustomers = async () => {
  const response = await api.get<AdminListResponse<AdminCustomer>>("/admin/users");
  return response.data;
};

export const deleteAdminCustomer = async (id: string) => {
  const response = await api.delete(`/admin/users/${id}`);
  return response.data;
};

export const getAdminVendors = async () => {
  const response = await api.get<AdminListResponse<AdminVendor>>("/admin/vendors");
  return response.data;
};

export const approveAdminVendor = async (id: string) => {
  const response = await api.patch(`/admin/vendors/${id}/approve`);
  return response.data;
};

export const rejectAdminVendor = async (id: string) => {
  const response = await api.patch(`/admin/vendors/${id}/reject`);
  return response.data;
};

export const getChatModerationUsers = async () => {
  const response = await api.get<AdminListResponse<ChatModerationUser>>(
    "/admin/chat/users",
  );
  return response.data;
};

export const muteChatUser = async (id: string, durationMinutes: number) => {
  const response = await api.patch(`/admin/chat/${id}/mute`, { durationMinutes });
  return response.data;
};

export const blockChatUser = async (id: string) => {
  const response = await api.patch(`/admin/chat/${id}/block`);
  return response.data;
};

export const suspendChatUser = async (id: string) => {
  const response = await api.patch(`/admin/chat/${id}/suspend`);
  return response.data;
};

export const resetChatWarnings = async (id: string) => {
  const response = await api.patch(`/admin/chat/${id}/reset-warnings`);
  return response.data;
};
