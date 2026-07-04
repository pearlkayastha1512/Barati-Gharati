
import { create } from "zustand";

import { Booking, BookingStatus } from "@/types/booking";

import {
  getCustomerBookings,
  getVendorBookings,
  getAllBookings,
  createBooking,
  updateBookingStatus,
  deleteBooking,
  payAdvance,
} from "@/services/booking.service";

interface BookingStore {
  bookings: Booking[];
  selectedBooking: Booking | null;
  activeTab: string;

  setActiveTab: (tab: string) => void;
  selectBooking: (booking: Booking) => void;
  clearSelectedBooking: () => void;

  loadCustomerBookings: (customerId: string) => void;
  loadVendorBookings: (vendorId: number) => void;
  loadAllBookings: () => void;

  addBooking: (booking: Booking) => void;

  updateStatus: (
    bookingId: string,
    status: BookingStatus
  ) => void;

  payAdvance: (
    bookingId: string,
    amount: number
  ) => void;

  deleteBooking: (
    bookingId: string
  ) => void;
}

export const useBookingStore = create<BookingStore>((set) => ({
  bookings: [],
  selectedBooking: null,
  activeTab: "All",

  setActiveTab: (tab) =>
    set({
      activeTab: tab,
    }),

  selectBooking: (booking) =>
    set({
      selectedBooking: booking,
    }),

  clearSelectedBooking: () =>
    set({
      selectedBooking: null,
    }),

  loadCustomerBookings: (customerId) => {
    set({
      bookings: getCustomerBookings(customerId),
    });
  },

  loadVendorBookings: (vendorId) => {
    set({
      bookings: getVendorBookings(vendorId),
    });
  },

 loadAllBookings: () => {
  set({
    bookings: getAllBookings(),
  });
},

  addBooking: (booking) => {
    createBooking(booking);

    set((state) => {
      const bookings = [...state.bookings, booking];

      return {
        bookings,
        selectedBooking:
          bookings.find(
            (b) => b.id === state.selectedBooking?.id
          ) ?? state.selectedBooking,
      };
    });
  },

  updateStatus: (bookingId, status) => {
    updateBookingStatus(bookingId, status);

    set((state) => {
      const bookings = state.bookings.map((booking) =>
        booking.id === bookingId
          ? {
              ...booking,
              bookingStatus: status,
            }
          : booking
      );

      return {
        bookings,
        selectedBooking:
          bookings.find(
            (b) => b.id === state.selectedBooking?.id
          ) ?? null,
      };
    });
  },

  payAdvance: (bookingId, amount) => {
    payAdvance(bookingId, amount);

    set((state) => {
      const bookings = state.bookings.map((booking) => {
        if (booking.id !== bookingId) {
          return booking;
        }

        const advancePaid = Math.min(
          booking.advancePaid + amount,
          booking.amount
        );

        const remainingAmount =
          booking.amount - advancePaid;

        return {
          ...booking,
          advancePaid,
          remainingAmount,
          paymentStatus:
            remainingAmount === 0
              ? ("paid" as const)
              : advancePaid > 0
              ? ("partial" as const)
              : ("pending" as const),
          updatedAt: new Date().toISOString(),
        };
      });

      return {
        bookings,
        selectedBooking:
          bookings.find(
            (b) => b.id === state.selectedBooking?.id
          ) ?? null,
      };
    });
  },

  deleteBooking: (bookingId) => {
    deleteBooking(bookingId);

    set((state) => {
      const bookings = state.bookings.filter(
        (booking) => booking.id !== bookingId
      );

      return {
        bookings,
        selectedBooking:
          state.selectedBooking?.id === bookingId
            ? null
            : bookings.find(
                (b) => b.id === state.selectedBooking?.id
              ) ?? null,
      };
    });
  },
}));