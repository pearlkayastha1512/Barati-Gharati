import { create } from "zustand";

import { getUsers } from "@/services/auth.service";
import { getVendors, StoredVendor } from "@/services/vendor.service";
import { getAllBookings } from "@/services/booking.service";

import {
  getAllVendorsApi,
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

export const useAdminStore = create<AdminStore>((set) => ({
  stats: {
    totalVendors: 0,
    totalCustomers: 0,
    totalBookings: 0,
    totalRevenue: 0,
    pendingVendorApprovals: 0,
  },

  vendors: [],

  // -----------------------------
  // TEMPORARY
  // Dashboard is still using localStorage
  // We'll migrate it after Bookings,
  // Users and Analytics are connected.
  // -----------------------------
  loadDashboard: async () => {
    const users = getUsers();

    const vendors = getVendors();

    const bookings = getAllBookings();

    const totalRevenue = bookings.reduce(
      (sum, booking) => sum + booking.advancePaid,
      0
    );

    set({
      stats: {
        totalVendors: vendors.length,

        totalCustomers: users.filter(
          (user) => user.role === "customer"
        ).length,

        totalBookings: bookings.length,

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
      return;
    }

    set({
      vendors: result.data.data,
    });
  },
}));