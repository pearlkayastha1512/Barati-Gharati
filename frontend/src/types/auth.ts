export type UserRole =
  | "customer"
  | "vendor"
  | "admin";

export type VendorStatus =
  | "pending"
  | "approved"
  | "rejected";

export interface User {
  _id: string;

  name: string;

  email: string;

  phone: string;

  avatar?: string;

  role: UserRole;

  adminRole?: import('@/lib/adminAccess').AdminRole | null;

  permissions?: string[];

  mustChangePassword?: boolean;

  status?: VendorStatus;

  isVerified: boolean;

  createdAt: string;

  updatedAt: string;

  membership?: "FREE" | "PREMIUM";
  adminVerificationStatus?: "pending" | "approved" | "rejected";
  adminVerifiedAt?: string | null;
  adminRejectionReason?: string | null;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}
