import api from "./axios";

export type BackendChecklistItem = {
  id: string;
  task: string;
  isDone: boolean;
  userId: string;
  createdAt: string;
};

type ApiListResponse = {
  success: boolean;
  count: number;
  data: BackendChecklistItem[];
};

type ApiItemResponse = {
  success: boolean;
  message: string;
  data: BackendChecklistItem;
};

type ApiDeleteResponse = {
  success: boolean;
  message: string;
};

export const getChecklist = async (): Promise<ApiListResponse> => {
  const response = await api.get<ApiListResponse>("/checklist");
  return response.data;
};

export const createChecklistItem = async (task: string): Promise<ApiItemResponse> => {
  const response = await api.post<ApiItemResponse>("/checklist", { task });
  return response.data;
};

export const updateChecklistStatus = async (
  id: string,
  isDone: boolean
): Promise<ApiItemResponse> => {
  const response = await api.patch<ApiItemResponse>(`/checklist/${id}/status`, { isDone });
  return response.data;
};

export const deleteChecklistItem = async (id: string): Promise<ApiDeleteResponse> => {
  const response = await api.delete<ApiDeleteResponse>(`/checklist/${id}`);
  return response.data;
};