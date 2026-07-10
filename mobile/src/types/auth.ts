export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  phone: string;
  password: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  password: string;
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