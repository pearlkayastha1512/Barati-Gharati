import { AxiosError } from "axios";
import { create } from "zustand";

import {
  cancelBooking,
  createBooking,
  getBookingById,
  getMyBookings,
} from "../api/bookings.api";
import { Booking, CreateBookingInput } from "../types/booking";

export type { Booking, BookingStatus } from "../types/booking";

interface BookingState {
  bookings: Booking[];
  selectedBooking: Booking | null;
  isLoading: boolean;
  isSubmitting: boolean;
  error: string | null;
  loadBookings: () => Promise<void>;
  loadBooking: (id: string) => Promise<void>;
  addBooking: (input: CreateBookingInput) => Promise<Booking | null>;
  cancel: (id: string, reason: string) => Promise<boolean>;
  clearError: () => void;
}

const errorMessage = (error: unknown, fallback: string) => {
  if (error instanceof AxiosError) {
    const message = error.response?.data?.message;
    if (Array.isArray(message)) return message.join(" ");
    if (typeof message === "string") return message;
    if (!error.response) return "Backend server se connection nahi ho pa raha hai.";
  }
  return fallback;
};

export const useBookingStore = create<BookingState>((set) => ({
  bookings: [],
  selectedBooking: null,
  isLoading: false,
  isSubmitting: false,
  error: null,

  clearError: () => set({ error: null }),

  loadBookings: async () => {
    set({ isLoading: true, error: null });
    try {
      const bookings = await getMyBookings();
      set({ bookings, isLoading: false });
    } catch (error) {
      set({
        isLoading: false,
        error: errorMessage(error, "Bookings load nahi ho sakin."),
      });
    }
  },

  loadBooking: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const selectedBooking = await getBookingById(id);
      set({ selectedBooking, isLoading: false });
    } catch (error) {
      set({
        selectedBooking: null,
        isLoading: false,
        error: errorMessage(error, "Booking details load nahi ho sakin."),
      });
    }
  },

  addBooking: async (input) => {
    set({ isSubmitting: true, error: null });
    try {
      const booking = await createBooking(input);
      set((state) => ({
        bookings: [booking, ...state.bookings],
        isSubmitting: false,
      }));
      return booking;
    } catch (error) {
      set({
        isSubmitting: false,
        error: errorMessage(error, "Booking create nahi ho saki."),
      });
      return null;
    }
  },

  cancel: async (id, reason) => {
    set({ isSubmitting: true, error: null });
    try {
      const updated = await cancelBooking(id, reason);
      set((state) => ({
        bookings: state.bookings.map((booking) =>
          booking.id === id ? updated : booking,
        ),
        selectedBooking:
          state.selectedBooking?.id === id ? updated : state.selectedBooking,
        isSubmitting: false,
      }));
      return true;
    } catch (error) {
      set({
        isSubmitting: false,
        error: errorMessage(error, "Booking cancel nahi ho saki."),
      });
      return false;
    }
  },
}));
