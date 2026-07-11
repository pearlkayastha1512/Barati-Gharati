import api from "./axios";

export const getMyBookings = async () => {
  const response = await api.get("/bookings");
  return response.data.data; // backend wraps in { success, data }
};