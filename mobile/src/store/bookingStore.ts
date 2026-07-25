import { AxiosError } from "axios";
import { create } from "zustand";

import {
  cancelBooking,
  createBooking,
  getBookingById,
  getMyBookings,
  getAlternativeVendors,
  selectAlternativeVendor,
  AlternativeVendor,
} from "../api/bookings.api";
import { Booking, CreateBookingInput } from "../types/booking";

export type { Booking, BookingStatus } from "../types/booking";
export type { AlternativeVendor } from "../api/bookings.api";

interface BookingState {
  bookings: Booking[];
  selectedBooking: Booking | null;
  isLoading: boolean;
  isSubmitting: boolean;
  error: string | null;

  alternativeVendors: AlternativeVendor[];
  isLoadingAlternatives: boolean;
  isSelectingVendor: boolean;

  loadBookings: () => Promise<void>;
  loadBooking: (id: string) => Promise<void>;
  addBooking: (input: CreateBookingInput) => Promise<Booking | null>;
  cancel: (id: string, reason: string) => Promise<boolean>;
  loadAlternativeVendors: (bookingId: string) => Promise<void>;
  selectVendor: (bookingId: string, vendorId: string) => Promise<boolean>;
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

export const useBookingStore = create<BookingState>((set, get) => ({
  bookings: [],
  selectedBooking: null,
  isLoading: false,
  isSubmitting: false,
  error: null,

  alternativeVendors: [],
  isLoadingAlternatives: false,
  isSelectingVendor: false,

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

  // Fetches candidate replacement vendors — used once the original vendor
  // has rejected (bookingStatus "primary_rejected") or a standby is being
  // sought ("promote_standby"), so the customer can pick instead of only
  // waiting for the automatic promotion.
  loadAlternativeVendors: async (bookingId) => {
    set({ isLoadingAlternatives: true, error: null });
    try {
      const alternativeVendors = await getAlternativeVendors(bookingId);
      set({ alternativeVendors, isLoadingAlternatives: false });
    } catch (error) {
      set({
        alternativeVendors: [],
        isLoadingAlternatives: false,
        error: errorMessage(error, "Alternative vendors load nahi ho sake."),
      });
    }
  },

  selectVendor: async (bookingId, vendorId) => {
    set({ isSelectingVendor: true, error: null });
    try {
      await selectAlternativeVendor(bookingId, vendorId);
      // Refresh the booking so the screen picks up the new vendorId +
      // "waiting_primary_vendor" status immediately.
      const selectedBooking = await getBookingById(bookingId);
      set((state) => ({
        selectedBooking,
        bookings: state.bookings.map((booking) =>
          booking.id === bookingId ? selectedBooking : booking,
        ),
        alternativeVendors: [],
        isSelectingVendor: false,
      }));
      return true;
    } catch (error) {
      set({
        isSelectingVendor: false,
        error: errorMessage(error, "Vendor select nahi ho saka."),
      });
      return false;
    }
  },
}));