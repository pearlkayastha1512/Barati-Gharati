export interface AdminDashboardStats {
  totalUsers: number;
  totalCustomers: number;
  totalVendors: number;
  totalPackages: number;
  totalBookings: number;
  totalCategories: number;
  totalRevenue: number;
  pendingVendorApprovals: number;
  pendingBookings: number;
  confirmedBookings: number;
  cancelledBookings: number;
}

export interface AdminDashboardResponse {
  success: boolean;
  data: AdminDashboardStats;
}
