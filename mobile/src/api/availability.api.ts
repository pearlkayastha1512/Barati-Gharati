import api from "./axios";

export type AvailabilityItem = {
  id: string;
  vendorId: number;
  date: string; // "YYYY-MM-DD"
  status: "blocked" | "booked";
  reason: string;
  createdAt: string;
  updatedAt: string;
};

export const getMyAvailability = async (): Promise<AvailabilityItem[]> => {
  const response = await api.get("/availability/mine");
  return response.data.data; // backend wraps in { success, data }
};

export const blockAvailabilityDate = async (
  date: string,
  reason?: string,
): Promise<AvailabilityItem> => {
  const response = await api.post("/availability/block", { date, reason });
  return response.data; // block() returns the mapped item directly, not wrapped
};

export const unblockAvailabilityDate = async (id: string) => {
  const response = await api.delete(`/availability/${id}`);
  return response.data; // { success: true, message: '...' }
};