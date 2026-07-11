import { create } from "zustand";
import { getMyBookings, acceptBooking, rejectBooking, BackendBooking } from "../api/vendorBookings.api";

export type VendorBookingStatus = "Pending" | "Accepted" | "Completed" | "Cancelled" | "Rejected";

export type VendorBookingRecord = {
  id: string;
  customerName: string;
  eventType: string;
  date: string;
  amount: number;
  status: VendorBookingStatus;
  // extra fields kept for BookingDetailsCard, in case it needs them later
  packageName: string;
  advancePaid: number;
  remainingAmount: number;
  paymentStatus: string;
  eventTime: string;
  customerEmail: string;
  customerPhone: string;
};

interface VendorBookingsState {
  bookings: VendorBookingRecord[];
  isLoading: boolean;
  fetchBookings: () => Promise<void>;
  updateStatus: (id: string, status: VendorBookingStatus) => Promise<void>;
}

const mapStatus = (backendStatus: string): VendorBookingStatus => {
  switch (backendStatus) {
    case "pending":
      return "Pending";
    case "accepted":
      return "Accepted";
    case "completed": // service maps CONFIRMED -> 'completed'
      return "Completed";
    case "cancelled":
      return "Cancelled";
    case "rejected":
      return "Rejected";
    default:
      return "Pending";
  }
};

const mapBooking = (b: BackendBooking): VendorBookingRecord => ({
  id: b.id,
  customerName: b.customerName,
  eventType: b.eventType || "Event",
  date: new Date(b.eventDate).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }),
  amount: b.amount,
  status: mapStatus(b.bookingStatus),
  packageName: b.packageName,
  advancePaid: b.advancePaid,
  remainingAmount: b.remainingAmount,
  paymentStatus: b.paymentStatus,
  eventTime: b.eventTime,
  customerEmail: b.customerEmail,
  customerPhone: b.customerPhone,
});

export const useVendorBookingsStore = create<VendorBookingsState>((set, get) => ({
  bookings: [],
  isLoading: false,

 fetchBookings: async () => {
  console.log("fetchBookings() called");

  try {
    set({ isLoading: true });

    const data = await getMyBookings();

    console.log("Fetched Data:", data);

    set({
      bookings: data.map(mapBooking),
      isLoading: false,
    });
  } catch (error) {
    console.log("FETCH VENDOR BOOKINGS ERROR =>", error);
    set({ isLoading: false });
  }
},

  // Only Pending -> Accepted / Rejected transitions are vendor-controlled
  // (Confirmed/Cancelled happen from the customer side via /confirm and /cancel)
  updateStatus: async (id, status) => {
    const previous = get().bookings;

    set((state) => ({
      bookings: state.bookings.map((b) => (b.id === id ? { ...b, status } : b)),
    }));

    try {
      if (status === "Accepted") {
        await acceptBooking(id);
      } else if (status === "Rejected") {
        await rejectBooking(id, "Rejected by vendor");
      } else {
        console.log(`updateStatus("${status}") has no vendor-side API call — ignoring`);
      }
    } catch (error) {
      console.log("UPDATE BOOKING STATUS ERROR =>", error);
      set({ bookings: previous }); // rollback
    }
  },
}));