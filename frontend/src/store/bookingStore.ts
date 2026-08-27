import { create } from "zustand";

import { Booking, BookingStatus } from "@/types/booking";

import {
  createBookingApi,
  getBookingByIdApi,
  getCustomerBookingsApi,
  getVendorBookingsApi,
  updateBookingPaymentApi,
  updateBookingStatusApi,
  primaryAcceptApi,
  primaryRejectApi,
  standbyRespondApi,
  promotedAcceptApi,
  promotedRejectApi,
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

  payAdvance: (
    bookingId: string,
    amount: number
  ) => Promise<boolean>;

  primaryAccept: (bookingId: string) => Promise<boolean>;
  primaryReject: (bookingId: string, reason?: string) => Promise<boolean>;
  standbyRespond: (bookingId: string, response: "AVAILABLE" | "NOT_AVAILABLE") => Promise<boolean>;
  promotedAccept: (bookingId: string) => Promise<boolean>;
  promotedReject: (bookingId: string, reason?: string) => Promise<boolean>;
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

  const updatedBooking =
    result.data?.data as Booking | undefined;

  set((state) => ({
    bookings: state.bookings.map((booking) =>
      booking.id === bookingId
        ? updatedBooking ?? {
            ...booking,
            bookingStatus: status,
            updatedAt: new Date().toISOString(),
          }
        : booking
    ),

    selectedBooking:
      state.selectedBooking?.id === bookingId
        ? updatedBooking ?? {
            ...state.selectedBooking,
            bookingStatus: status,
            updatedAt: new Date().toISOString(),
          }
        : state.selectedBooking,
  }));

  return true;
},

    payAdvance: async (
      bookingId,
      amount
    ) => {
      const result =
        await updateBookingPaymentApi(
          bookingId,
          amount
        );

      if (
        !result.ok ||
        !result.data?.success
      ) {
        return false;
      }

      const updatedBooking =
        result.data.data as Booking;

      set((state) => ({
        bookings: state.bookings.map(
          (booking) =>
            booking.id === bookingId
              ? updatedBooking
              : booking
        ),

        selectedBooking:
          state.selectedBooking?.id ===
          bookingId
            ? updatedBooking
            : state.selectedBooking,
      }));

      return true;
    },

    primaryAccept: async (bookingId) => {
      const result = await primaryAcceptApi(bookingId);
      if (!result.ok) return false;
      // Refresh vendor bookings
      const refresh = await getVendorBookingsApi();
      if (refresh.ok && refresh.data?.success) {
        set({ bookings: refresh.data.data });
      }
      return true;
    },

    primaryReject: async (bookingId, reason) => {
      const result = await primaryRejectApi(bookingId, reason);
      if (!result.ok) return false;
      const refresh = await getVendorBookingsApi();
      if (refresh.ok && refresh.data?.success) {
        set({ bookings: refresh.data.data });
      }
      return true;
    },

    standbyRespond: async (bookingId, response) => {
      set((state) => ({
        bookings: state.bookings.map((b) => {
          if (b.id !== bookingId) return b;
          const updatedAssignments = (b.vendorAssignments ?? []).map((a) => ({
            ...a,
            status: response,
          }));
          return { ...b, vendorAssignments: updatedAssignments };
        }),
        selectedBooking:
          state.selectedBooking?.id === bookingId
            ? {
                ...state.selectedBooking,
                vendorAssignments: (
                  state.selectedBooking.vendorAssignments ?? []
                ).map((a) => ({
                  ...a,
                  status: response,
                })),
              }
            : state.selectedBooking,
      }));

      const result = await standbyRespondApi(bookingId, response);
      if (!result.ok) return false;
      const refresh = await getVendorBookingsApi();
      if (refresh.ok && refresh.data?.success) {
        set({ bookings: refresh.data.data });
      }
      return true;
    },

    promotedAccept: async (bookingId) => {
      const result = await promotedAcceptApi(bookingId);
      if (!result.ok) return false;
      const refresh = await getVendorBookingsApi();
      if (refresh.ok && refresh.data?.success) {
        set({ bookings: refresh.data.data });
      }
      return true;
    },

    promotedReject: async (bookingId, reason) => {
      const result = await promotedRejectApi(bookingId, reason);
      if (!result.ok) return false;
      const refresh = await getVendorBookingsApi();
      if (refresh.ok && refresh.data?.success) {
        set({ bookings: refresh.data.data });
      }
      return true;
    },
  }));

