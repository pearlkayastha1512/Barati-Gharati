import { create } from "zustand";

import { StoredVendor } from "@/services/vendor.service";

import {
  getAllVendorsApi,
  getDashboardApi,
} from "@/services/api/admin.api";

interface DashboardStats {
  totalVendors: number;
  totalCustomers: number;
  totalBookings: number;
  totalRevenue: number;
  pendingVendorApprovals: number;
}

interface AdminStore {
  stats: DashboardStats;

  vendors: StoredVendor[];

  isDashboardLoading: boolean;

  dashboardError: string | null;

  loadDashboard: () => Promise<void>;

  loadVendors: () => Promise<void>;
}

type ApiListResponse<T> = {
  data?: T[];
};

type ApiDashboardResponse = {
  data?: Partial<DashboardStats> & {
    totalUsers?: number;
  };
};

function getArrayData<T>(
  value: unknown
): T[] {
  if (Array.isArray(value)) {
    return value as T[];
  }

  const response =
    value as ApiListResponse<T>;

  return Array.isArray(response?.data)
    ? response.data
    : [];
}

export const useAdminStore = create<AdminStore>((set) => ({
  stats: {
    totalVendors: 0,
    totalCustomers: 0,
    totalBookings: 0,
    totalRevenue: 0,
    pendingVendorApprovals: 0,
  },

  vendors: [],

  isDashboardLoading: false,

  dashboardError: null,

  loadDashboard: async () => {
    set({
      isDashboardLoading: true,
      dashboardError: null,
    });

    const [dashboardResult, vendorsResult] =
      await Promise.all([
        getDashboardApi(),
        getAllVendorsApi(),
      ]);

    if (!dashboardResult.ok) {
      set({
        isDashboardLoading: false,
        dashboardError:
          dashboardResult.error ??
          "Unable to load dashboard data.",
      });
      return;
    }

    const dashboard =
      (dashboardResult.data as ApiDashboardResponse)
        ?.data ?? {};

    const vendors =
      vendorsResult.ok
        ? getArrayData<StoredVendor>(
            vendorsResult.data
          )
        : [];

    set({
      stats: {
        totalVendors:
          dashboard.totalVendors ??
          vendors.length,

        totalCustomers:
          dashboard.totalCustomers ??
          dashboard.totalUsers ??
          0,

        totalBookings:
          dashboard.totalBookings ??
          0,

        totalRevenue:
          dashboard.totalRevenue ??
          0,

        pendingVendorApprovals:
          dashboard.pendingVendorApprovals ??
          vendors.filter(
            (vendor) =>
              vendor.approvalStatus === "pending"
          ).length,
      },
      isDashboardLoading: false,
      dashboardError: null,
    });
  },

  // -----------------------------
  // Vendors now come from backend
  // Backend MUST return StoredVendor[]
  // -----------------------------
  loadVendors: async () => {
    const result = await getAllVendorsApi();

    if (!result.ok) {
      set({
        vendors: [],
      });
      return;
    }

    set({
      vendors: getArrayData<StoredVendor>(
        result.data
      ),
    });
  },
}));
