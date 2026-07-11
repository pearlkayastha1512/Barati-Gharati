import api from "./axios";

export type BackendBooking = {
  id: string;
  bookingNumber: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  vendorName: string;
  category: string;
  packageName: string;
  eventType: string;
  eventDate: string;
  eventTime: string;
  venue: string;
  city: string;
  guests: number;
  amount: number;
  advancePaid: number;
  remainingAmount: number;
  paymentStatus: string;
  bookingStatus: string;
  createdAt: string;
  updatedAt: string;
};

export const getMyBookings = async (): Promise<BackendBooking[]> => {
  const response = await api.get("/bookings");

  console.log(JSON.stringify(response.data, null, 2));

  return response.data.data;
};

export const acceptBooking = async (id: string) => {
  const response = await api.patch(`/bookings/${id}/accept`);
  return response.data;
};

export const rejectBooking = async (id: string, cancellationReason: string) => {
  const response = await api.patch(`/bookings/${id}/reject`, { cancellationReason });
  return response.data;
};