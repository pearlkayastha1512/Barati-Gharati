import { create } from "zustand";

export type VendorBookingStatus = "Pending" | "Completed" | "Cancelled";

export type VendorBookingRecord = {
  id: string;
  customerName: string;
  eventType: string;
  date: string;
  amount: number;
  status: VendorBookingStatus;
};

interface VendorBookingsState {
  bookings: VendorBookingRecord[];
  updateStatus: (id: string, status: VendorBookingStatus) => void;
}

// TODO: once backend is connected, replace local array with API-backed state:
// - on mount, fetch via getVendorBookings() and populate `bookings`
// - updateStatus should call updateBookingStatus(id, status), optimistic update with rollback on failure
export const useVendorBookingsStore = create<VendorBookingsState>((set) => ({
  bookings: [],

  updateStatus: (id, status) => {
    set((state) => ({
      bookings: state.bookings.map((b) => (b.id === id ? { ...b, status } : b)),
    }));
  },
}));