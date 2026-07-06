import api from "./axios";

export const login = (data: any) => {
  return api.post("/auth/login", data);
};

export const register = (data: any) => {
  return api.post("/auth/register", data);
};
export const forgotPassword = (email: string) => {
  return api.post("/auth/forgot-password", {
    email,
  });
};
export const resetPassword = (data: {
  token: string;
  password: string;
}) => {
  return api.post("/auth/reset-password", data);
};
export const verifyEmail = (token: string) => {
  return api.post("/auth/verify-email", {
    token,
  });
};