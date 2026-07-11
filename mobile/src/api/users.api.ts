import api from "./axios";

export type BackendUserProfile = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: string;
  isVerified: boolean;
};

export const getMyProfile = async (): Promise<BackendUserProfile> => {
  const response = await api.get<BackendUserProfile>("/users/me");
  return response.data;
};

export const updateMyProfile = async (data: { name?: string; phone?: string }): Promise<BackendUserProfile> => {
  const response = await api.patch<BackendUserProfile>("/users/profile", data);
  return response.data;
};

export const changeMyPassword = async (data: {
  currentPassword: string;
  newPassword: string;
}): Promise<{ message?: string }> => {
  const response = await api.patch("/users/change-password", data);
  return response.data;
};