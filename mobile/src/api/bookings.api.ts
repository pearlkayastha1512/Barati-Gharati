import api from "./axios";
import {
  Booking,
  BookingListResponse,
  BookingResponse,
  CreateBookingInput,
} from "../types/booking";

const toCreatePayload = (booking: CreateBookingInput) => ({
  bookingNumber: booking.bookingNumber,
  vendorId: booking.vendorId,
  vendorName: booking.vendorName,
  category: booking.category,
  packageName: booking.packageName,
  customerName: booking.customerName,
  customerEmail: booking.customerEmail,
  customerPhone: booking.customerPhone,
  partnerName: booking.partnerName,
  partnerEmail: booking.partnerEmail,
  partnerPhone: booking.partnerPhone,
  partnerOccupation: booking.partnerOccupation,
  eventType: booking.eventType,
  eventDate: booking.eventDate,
  eventDates: booking.eventDates && booking.eventDates.length > 0 ? booking.eventDates : [booking.eventDate],
  eventTime: booking.eventTime,
  venue: booking.venue,
  city: booking.city,
  contactAddress: booking.contactAddress,
  contactState: booking.contactState,
  contactCountry: booking.contactCountry,
  weddingTheme: booking.weddingTheme,
  guests: booking.guests,
  brideName: booking.brideName,
  groomName: booking.groomName,
  eventTitle: booking.eventTitle,
  primaryPersonName: booking.primaryPersonName,
  primaryPersonAge: booking.primaryPersonAge ?? undefined,
  eventTheme: booking.eventTheme,
  specialRequirements: booking.specialRequirements,
  amount: booking.amount,
  advancePaid: booking.advancePaid,
  remainingAmount: booking.remainingAmount,
  paymentStatus: "PENDING",
  bookingStatus: "PENDING",
});

export const getMyBookings = async () => {
  const response = await api.get<BookingListResponse>("/bookings");
  return response.data.data;
};

export const getBookingById = async (id: string) => {
  const response = await api.get<BookingResponse>(`/bookings/${id}`);
  return response.data.data;
};

export const createBooking = async (booking: CreateBookingInput) => {
  const response = await api.post<BookingResponse | Booking>(
    "/bookings",
    toCreatePayload(booking),
  );

  return "data" in response.data ? response.data.data : response.data;
};

export const cancelBooking = async (id: string, cancellationReason: string) => {
  const response = await api.patch<BookingResponse | Booking>(
    `/bookings/${id}/cancel`,
    { cancellationReason },
  );

  return "data" in response.data ? response.data.data : response.data;
};

export const downloadBookingInvoice = async (id: string) => {
  const response = await api.get(`/invoice/download/${id}`, {
    responseType: "arraybuffer",
  });
  return response.data;
};

// ── Smart Booking Engine — alternative vendor selection ──
// Shown to the customer when the original vendor rejects and the system
// is looking for a replacement (bookingStatus "primary_rejected" / "promote_standby").
// Matches BookingEngineService.getAlternativeVendorsForCustomer() on the backend.
export type AlternativeVendor = {
  id: string;
  businessName: string;
  description: string | null;
  profileImage: string | null;
  coverImage: string | null;
  badge: string;
  city: string | null;
  startingPrice: number;
  category: string;
  rating: number;
  score: number;
};

export const getAlternativeVendors = async (bookingId: string) => {
  const response = await api.get<{ success: boolean; data: AlternativeVendor[] }>(
    `/bookings/${bookingId}/alternative-vendors`,
  );
  return response.data.data;
};

export const selectAlternativeVendor = async (bookingId: string, vendorId: string) => {
  const response = await api.patch(`/bookings/${bookingId}/select-vendor`, { vendorId });
  return response.data;
};