import { create } from "zustand";

export type BookingStatus = "upcoming" | "pending" | "completed" | "cancelled";

export type Booking = {
  id: string;
  vendorId: string;
  vendorName: string;
  vendorCategory: string;
  date: string;
  time: string;
  status: BookingStatus;
  image: string;
  brideName: string;
  groomName: string;
  phone: string;
  email: string;
  partnerEmail?: string;
  partnerPhone?: string;
  partnerOccupation?: string;
  weddingTheme?: string;
  packageName: string;
  estimatedPrice: number;
};

type NewBookingInput = Omit<Booking, "id" | "status">;

interface BookingState {
  bookings: Booking[];
  addBooking: (input: NewBookingInput) => void;
}

// TODO: once backend is connected, replace local state with API-backed state:
// - on mount, fetch via getBookings() and populate `bookings`
// - addBooking should call createBooking(input), then append the returned item
export const useBookingStore = create<BookingState>((set) => ({
  bookings: [],

  addBooking: (input) => {
    const newBooking: Booking = {
      id: Date.now().toString(),
      status: "pending",
      ...input,
    };
    set((state) => ({ bookings: [newBooking, ...state.bookings] }));
  },
}));