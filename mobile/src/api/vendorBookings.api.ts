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
  vendorId: number;

  brideName: string;
  groomName: string;
  eventTitle: string;
  primaryPersonName: string;
  primaryPersonAge: number | null;
  eventTheme: string;

  partnerName: string;
  partnerEmail: string;
  partnerPhone: string;
  partnerOccupation: string;

  contactAddress: string;
  contactState: string;
  contactCountry: string;
  weddingTheme: string;
  specialRequirements: string;

  amount: number;
  advancePaid: number;
  platformCommission: number;
  vendorNetAmount: number;
  payoutStatus: string | null;
  payoutSimulated: boolean;
  payoutReleasedAt: string | null;
  vendorAcknowledgedAt: string | null;
  remainingAmount: number;
  paymentStatus: string;
  bookingStatus: string;

  adminApproved: boolean;
  adminApprovedAt: string | null;

  createdAt: string;
  updatedAt: string;
};

export const getMyBookings = async (): Promise<BackendBooking[]> => {
  const response = await api.get("/bookings");
  return response.data.data;
};

export const acceptBooking = async (id: string) => {
  const response = await api.patch(`/bookings/${id}/accept`);
  return response.data;
};
export const completeBookingEvent = async (id: string) => {
  const response = await api.patch(`/bookings/${id}/complete-event`);
  return response.data;
};
export const rejectBooking = async (id: string, cancellationReason: string) => {
  const response = await api.patch(`/bookings/${id}/reject`, { cancellationReason });
  return response.data;
};
