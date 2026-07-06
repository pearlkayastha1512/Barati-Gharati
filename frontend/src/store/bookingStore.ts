import { create } from "zustand";

import { Booking, BookingStatus } from "@/types/booking";

import {
  createBookingApi,
  getBookingByIdApi,
  getCustomerBookingsApi,
  getVendorBookingsApi,
  updateBookingStatusApi,
} from "@/services/api/booking.api";

interface BookingStore {
  bookings: Booking[];

  selectedBooking: Booking | null;

  activeTab: string;

  loading: boolean;

  setActiveTab: (tab: string) => void;

  selectBooking: (
    booking: Booking
  ) => void;

  clearSelectedBooking: () => void;

  loadCustomerBookings: (
    customerId: string
  ) => Promise<void>;

  loadVendorBookings: (
    vendorId: number
  ) => Promise<void>;

  loadAllBookings: () => Promise<void>;

  loadBooking: (
    bookingId: string
  ) => Promise<void>;

  addBooking: (
    booking: Booking
  ) => Promise<boolean>;

  updateStatus: (
    bookingId: string,
    status: BookingStatus
  ) => Promise<boolean>;
}

export const useBookingStore =
  create<BookingStore>((set) => ({
    bookings: [],

    selectedBooking: null,

    activeTab: "All",

    loading: false,

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

    loadCustomerBookings: async () => {
      set({
        loading: true,
      });

      const result =
        await getCustomerBookingsApi();

      if (
        result.ok &&
        result.data?.success
      ) {
        set({
          bookings: result.data.data,
          loading: false,
        });

        return;
      }

      set({
        bookings: [],
        loading: false,
      });
    },

    loadVendorBookings: async () => {
      set({
        loading: true,
      });

      const result =
        await getVendorBookingsApi();

      if (
        result.ok &&
        result.data?.success
      ) {
        set({
          bookings: result.data.data,
          loading: false,
        });

        return;
      }

      set({
        bookings: [],
        loading: false,
      });
    },

    loadAllBookings: async () => {
      const result =
        await getCustomerBookingsApi();

      if (
        result.ok &&
        result.data?.success
      ) {
        set({
          bookings: result.data.data,
        });
      }
    },

    loadBooking: async (
      bookingId
    ) => {
      const result =
        await getBookingByIdApi(
          bookingId
        );

      if (
        result.ok &&
        result.data?.success
      ) {
        set({
          selectedBooking:
            result.data.data,
        });
      }
    },

    addBooking: async (
      booking
    ) => {
      const result =
        await createBookingApi(
          booking
        );

      if (
        !result.ok ||
        !result.data.success
      ) {
        return false;
      }

      set((state) => ({
        bookings: [
          result.data.data,
          ...state.bookings,
        ],
      }));

      return true;
    },

   updateStatus: async (
  bookingId,
  status
) => {
  const result =
    await updateBookingStatusApi(
      bookingId,
      status
    );

  if (!result.ok) {
    return false;
  }

  set((state) => ({
    bookings: state.bookings.map((booking) =>
      booking.id === bookingId
        ? {
            ...booking,
            bookingStatus: status,
            updatedAt: new Date().toISOString(),
          }
        : booking
    ),

    selectedBooking:
      state.selectedBooking?.id === bookingId
        ? {
            ...state.selectedBooking,
            bookingStatus: status,
            updatedAt: new Date().toISOString(),
          }
        : state.selectedBooking,
  }));

  return true;
},










  }));