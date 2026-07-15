// import api from "./axios";

// export const login = (data: any) => {
//   return api.post("/auth/login", data);
// };

// export const register = (data: any) => {
//   return api.post("/auth/register", data);
// };
// export const forgotPassword = (email: string) => {
//   return api.post("/auth/forgot-password", {
//     email,
//   });
// };
// export const resetPassword = (data: {
//   token: string;
//   password: string;
// }) => {
//   return api.post("/auth/reset-password", data);
// };
// export const verifyEmail = (token: string) => {
//   return api.post("/auth/verify-email", {
//     token,
//   });
// };
import api from "./axios";

import {
  LoginRequest,
  RegisterRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
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
