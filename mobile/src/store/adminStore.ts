import { create } from "zustand";
import { AxiosError } from "axios";

import { getAdminDashboard } from "../api/admin.api";
import { AdminDashboardStats } from "../types/admin";

const emptyStats: AdminDashboardStats = {
  totalUsers: 0,
  totalCustomers: 0,
  totalVendors: 0,
  totalPackages: 0,
  totalBookings: 0,
  totalCategories: 0,
  totalRevenue: 0,
  pendingVendorApprovals: 0,
  pendingBookings: 0,
  confirmedBookings: 0,
  cancelledBookings: 0,
};

interface AdminState {
  dashboard: AdminDashboardStats;
  isDashboardLoading: boolean;
  dashboardError: string | null;
  loadDashboard: () => Promise<void>;
}

const getErrorMessage = (error: unknown) => {
  if (error instanceof AxiosError) {
    const message = error.response?.data?.message;

    if (Array.isArray(message)) {
      return message.join(" ");
    }

    if (typeof message === "string") {
      return message;
    }

    if (!error.response) {
      return "Backend server se connection nahi ho pa raha hai.";
    }
  }

  return "Dashboard data load nahi ho saka.";
};

export const useAdminStore = create<AdminState>((set) => ({
  dashboard: emptyStats,
  isDashboardLoading: false,
  dashboardError: null,

  loadDashboard: async () => {
    set({
      isDashboardLoading: true,
      dashboardError: null,
    });

    try {
      const response = await getAdminDashboard();

      set({
        dashboard: response.data,
        isDashboardLoading: false,
      });
    } catch (error) {
      set({
        isDashboardLoading: false,
        dashboardError: getErrorMessage(error),
      });
    }
  },
}));
