import { create } from "zustand";

import { getUsers } from "@/services/auth.service";
import { StoredVendor } from "@/services/vendor.service";
import { getAllBookings } from "@/services/booking.service";

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

  loadDashboard: async () => {
    const users = getUsers();

    const [dashboardResult, vendorsResult] =
      await Promise.all([
        getDashboardApi(),
        getAllVendorsApi(),
      ]);

    const dashboard =
      (dashboardResult.data as ApiDashboardResponse)
        ?.data ?? {};

    const vendors =
      vendorsResult.ok
        ? getArrayData<StoredVendor>(
            vendorsResult.data
          )
        : [];

    const bookings = getAllBookings();

    const totalRevenue = bookings.reduce(
      (sum, booking) => sum + booking.advancePaid,
      0
    );

    set({
      stats: {
        totalVendors:
          dashboard.totalVendors ??
          vendors.length,

        totalCustomers:
          dashboard.totalCustomers ??
          dashboard.totalUsers ??
          users.filter(
            (user) => user.role === "customer"
          ).length,

        totalBookings:
          dashboard.totalBookings ??
          bookings.length,

        totalRevenue:
          dashboard.totalRevenue ??
          totalRevenue,

        pendingVendorApprovals: vendors.filter(
          (vendor) =>
            vendor.approvalStatus === "pending"
        ).length,
      },
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
