import api from "./axios";

import {
  LoginRequest,
  RegisterRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  VerifyEmailOtpRequest,
  ResendEmailOtpRequest,
  AuthResponse,
  LoginApiResponse,
  ApiResponse,
} from "../types/auth";

import { UserRole } from "../types/user";

export const login = async (
  data: LoginRequest,
): Promise<LoginApiResponse> => {
  const response = await api.post<AuthResponse>(
    "/auth/login",
    data,
  );

  const backendUser = response.data.user;

  return {
    success: response.data.success,
    message: response.data.message,
    accessToken: response.data.accessToken,

    user: {
      id: backendUser._id,
      name: backendUser.name,
      email: backendUser.email,
      phone: backendUser.phone,
      avatar: backendUser.avatar,

      role:
        backendUser.role === "customer"
          ? UserRole.USER
          : backendUser.role === "vendor"
          ? UserRole.VENDOR
          : UserRole.ADMIN,

      isVerified: backendUser.isVerified,

      createdAt: backendUser.createdAt,
      updatedAt: backendUser.updatedAt,
      adminRole: backendUser.adminRole,
      permissions: backendUser.permissions,
      mustChangePassword: backendUser.mustChangePassword,
      membership: backendUser.membership,
    },
  };
};

export const register = async (
  data: RegisterRequest,
): Promise<ApiResponse> => {
  const response = await api.post<ApiResponse>(
    "/auth/register",
    data,
  );

  return response.data;
};

export const forgotPassword = async (
  data: ForgotPasswordRequest,
): Promise<ApiResponse> => {
  const response = await api.post<ApiResponse>(
    "/auth/forgot-password",
    data,
  );

  return response.data;
};

export const resetPassword = async (
  data: ResetPasswordRequest,
): Promise<ApiResponse> => {
  const response = await api.post<ApiResponse>(
    "/auth/reset-password",
    data,
  );

  return response.data;
};

export const verifyEmail = async (
  token: string,
): Promise<ApiResponse> => {
  const response = await api.get<ApiResponse>(
    `/auth/verify-email?token=${token}`,
  );

  return response.data;
};

// NEW — OTP-based verification (used right after registration)
export const verifyEmailOtp = async (
  data: VerifyEmailOtpRequest,
): Promise<ApiResponse> => {
  const response = await api.post<ApiResponse>(
    "/auth/verify-email-otp",
    data,
  );

  return response.data;
};

// NEW — resend OTP if it expired or user didn't receive it
export const resendEmailOtp = async (
  data: ResendEmailOtpRequest,
): Promise<ApiResponse> => {
  const response = await api.post<ApiResponse>(
    "/auth/resend-email-otp",
    data,
  );

  return response.data;
};

export const sendLoginOtp = async (phone: string): Promise<ApiResponse> => {
  const response = await api.post<ApiResponse>("/auth/login-otp/send", { phone });
  return response.data;
};

export const verifyLoginOtp = async (
  phone: string,
  otp: string,
): Promise<LoginApiResponse> => {
  const response = await api.post<AuthResponse>("/auth/login-otp/verify", {
    phone,
    otp,
  });

  const backendUser = response.data.user;

  return {
    success: response.data.success,
    message: response.data.message,
    accessToken: response.data.accessToken,
    user: {
      id: backendUser._id,
      name: backendUser.name,
      email: backendUser.email,
      phone: backendUser.phone,
      avatar: backendUser.avatar,
      role:
        backendUser.role === "customer"
          ? UserRole.USER
          : backendUser.role === "vendor"
          ? UserRole.VENDOR
          : UserRole.ADMIN,
      isVerified: backendUser.isVerified,
      createdAt: backendUser.createdAt,
      updatedAt: backendUser.updatedAt,
      adminRole: backendUser.adminRole,
      permissions: backendUser.permissions,
      mustChangePassword: backendUser.mustChangePassword,
      membership: backendUser.membership,
    },
  };
};