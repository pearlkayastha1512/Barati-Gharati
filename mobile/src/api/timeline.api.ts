import api from "./axios";

export type BackendPriority = "LOW" | "MEDIUM" | "HIGH";
export type BackendStatus = "PENDING" | "COMPLETED";

export type BackendTimelineItem = {
  id: string;
  title: string;
  date: string;
  description: string | null;
  priority: BackendPriority;
  status: BackendStatus;
  userId: string;
  createdAt: string;
  updatedAt: string;
};

type ApiListResponse = {
  success: boolean;
  count: number;
  data: BackendTimelineItem[];
};

type ApiItemResponse = {
  success: boolean;
  message: string;
  data: BackendTimelineItem;
};

type ApiDeleteResponse = {
  success: boolean;
  message: string;
};

type CreateTimelinePayload = {
  title: string;
  date: string; // "YYYY-MM-DD"
  description?: string;
  priority?: BackendPriority;
};

export const getTimeline = async (): Promise<ApiListResponse> => {
  const response = await api.get<ApiListResponse>("/timeline");
  return response.data;
};

export const createTimelineItem = async (
  payload: CreateTimelinePayload
): Promise<ApiItemResponse> => {
  const response = await api.post<ApiItemResponse>("/timeline", payload);
  return response.data;
};

export const updateTimelineStatus = async (
  id: string,
  status: BackendStatus
): Promise<ApiItemResponse> => {
  const response = await api.patch<ApiItemResponse>(`/timeline/${id}/status`, { status });
  return response.data;
};

export const deleteTimelineItem = async (id: string): Promise<ApiDeleteResponse> => {
  const response = await api.delete<ApiDeleteResponse>(`/timeline/${id}`);
  return response.data;
};