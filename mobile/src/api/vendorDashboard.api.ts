import api from "./axios";

export type BackendVendorProfile = {
  id: string;
  businessName: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  user: { id: string; name: string; email: string; phone: string | null };
  category: { id: string; name: string } | null;
};

export type BackendDashboard = {
  totalPackages: number;
  totalBookings: number;
  pendingBookings: number;
  confirmedBookings: number;
  cancelledBookings: number;
  totalRevenue: number; // currently always 0 server-side
  averageRating: number; // currently always 0 server-side
};

export type BackendBooking = {
  id: string;
  bookingNumber: string;
  customerId: string;
  customerName: string;
  packageName: string;
  eventType: string;
  eventDate: string;
  eventTime: string;
  amount: number;
  advancePaid: number;
  platformCommission: number;
  vendorNetAmount: number;
  payoutStatus: string | null;
  remainingAmount: number;
  paymentStatus: string;
  bookingStatus: string; // "pending" | "accepted" | "confirmed" | "cancelled" | "rejected"
  createdAt: string;
};

export type BackendReview = {
  id: string;
  rating: number;
  comment: string | null;
  userId: string;
  createdAt: string;
  user?: { name: string };
};

export const getMyVendorProfile = async (): Promise<BackendVendorProfile> => {
  const response = await api.get("/vendor/profile");
  return response.data.data;
};

export const getVendorDashboard = async (): Promise<BackendDashboard> => {
  const response = await api.get("/vendor/dashboard");
  return response.data.data;
};

export const getMyBookings = async (): Promise<BackendBooking[]> => {
  const response = await api.get("/bookings");
  return response.data.data;
};

export const getVendorReviews = async (vendorId: string): Promise<BackendReview[]> => {
  const response = await api.get(`/reviews/vendor/${vendorId}`);
  // TODO: confirm actual response shape once reviews.service.ts is available —
  // assuming it's a plain array or { data: [...] }; adjust if needed.
  return Array.isArray(response.data) ? response.data : response.data.data ?? [];
};

export const getVendorAverageRating = async (vendorId: string): Promise<number> => {
  const response = await api.get(`/reviews/vendor/${vendorId}/average`);
  // TODO: confirm shape — assuming { average: number } or a raw number.
  const data = response.data;
  return typeof data === "number" ? data : data?.average ?? data?.data?.average ?? 0;
};
