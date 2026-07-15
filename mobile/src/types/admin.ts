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

export interface AdminCustomer {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  role: "USER" | "VENDOR" | "ADMIN";
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export type VendorApprovalStatus = "pending" | "approved" | "rejected";

export interface AdminVendor {
  id: string;
  userId: string;
  ownerName: string;
  email: string;
  phone: string;
  businessName: string;
  category: string;
  city: string;
  profileImage: string;
  businessVerified: boolean;
  approvalStatus: VendorApprovalStatus;
  badge: "bronze" | "silver" | "gold";
  isActive: boolean;
  createdAt: string;
}

export type ChatModerationStatus =
  | "active"
  | "muted"
  | "blocked"
  | "suspended"
  | "flagged";

export interface ChatModerationUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "customer" | "vendor";
  warningCount: number;
  chatMutedUntil?: string | null;
  isChatFlagged: boolean;
  isChatBlocked: boolean;
  isSuspended: boolean;
  lastViolationTime?: string | null;
  violationReason: string;
  status: ChatModerationStatus;
}

export interface AdminListResponse<T> {
  success: boolean;
  count: number;
  data: T[];
}
