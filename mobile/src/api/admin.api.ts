import api from "./axios";
import { AdminDashboardResponse } from "../types/admin";

export const getAdminDashboard = async () => {
  const response = await api.get<AdminDashboardResponse>(
    "/admin/dashboard",
  );

  return response.data;
};
