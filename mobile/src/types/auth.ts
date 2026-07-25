import { User, CustomerMembership } from "./user";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  phone: string;
  password: string;
  membership?: CustomerMembership;
  membershipPaymentOrderId?: string;
  membershipPaymentId?: string;
  membershipPaymentSignature?: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  password: string;
}

// NEW
export interface VerifyEmailOtpRequest {
  email: string;
  otp: string;
}

// NEW
export interface ResendEmailOtpRequest {
  email: string;
}

export interface AuthUser {
  _id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  role: "customer" | "vendor" | "admin";
  status?: string;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
  adminRole?: string | null;
  permissions?: string[];
  mustChangePassword?: boolean;
  membership?: CustomerMembership;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  accessToken: string;
  user: AuthUser;
}

export interface ApiResponse {
  success: boolean;
  message: string;
}
export interface LoginApiResponse {
  success: boolean;
  message: string;
  accessToken: string;
  user: User;
}