import { create } from "zustand";

export type BookingStatus = "upcoming" | "pending" | "completed" | "cancelled";

export type Booking = {
  id: string;
  vendorName: string;
  vendorCategory: string;
  date: string;
  time: string;
  status: BookingStatus;
  image: string;
};

interface BookingState {
  bookings: Booking[];
}

// TODO: once backend is connected, replace this with API-backed state:
// - on mount, fetch bookings via getBookings() and populate `bookings`
// - creating a booking (from VendorDetailsScreen "Book Now") should call
//   POST /bookings, then refresh this list
export const useBookingStore = create<BookingState>(() => ({
  bookings: [],
}));