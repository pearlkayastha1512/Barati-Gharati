import { create } from "zustand";
import { getMyBookings, acceptBooking, completeBookingEvent, BackendBooking } from "../api/vendorBookings.api";

export type VendorBookingStatus = "Pending" | "Accepted" | "Completed" | "Cancelled" | "Rejected";

export type VendorBookingRecord = {
  id: string;
  customerName: string;
  eventType: string;
  date: string;
  eventDateRaw: string; // ISO date string, used for date comparisons (e.g. "has the event happened yet")
  amount: number;
  status: VendorBookingStatus;

  packageName: string;
  advancePaid: number;
  remainingAmount: number;
  paymentStatus: string;
  eventTime: string;
  customerEmail: string;
  customerPhone: string;
  adminApproved: boolean;

  venue: string;
  city: string;
  guests: number;

  brideName: string;
  groomName: string;
  eventTitle: string;
  primaryPersonName: string;
  primaryPersonAge: number | null;
  eventTheme: string;

  partnerName: string;
  partnerEmail: string;
  partnerPhone: string;
  partnerOccupation: string;

  contactAddress: string;
  contactState: string;
  contactCountry: string;
  specialRequirements: string;
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
    case "advance_paid":
    case "awaiting_admin_review":
      return "Pending";
    case "accepted":
    case "payment_approved":
    case "payment_held":
      return "Accepted";
    case "completed":
    case "event_completed":
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
  eventDateRaw: b.eventDate,
  amount: b.amount,
  status: mapStatus(b.bookingStatus),
  adminApproved: b.adminApproved,
  packageName: b.packageName,
  advancePaid: b.advancePaid,
  remainingAmount: b.remainingAmount,
  paymentStatus: b.paymentStatus,
  eventTime: b.eventTime,
  customerEmail: b.customerEmail,
  customerPhone: b.customerPhone,

  venue: b.venue,
  city: b.city,
  guests: b.guests,

  brideName: b.brideName,
  groomName: b.groomName,
  eventTitle: b.eventTitle,
  primaryPersonName: b.primaryPersonName,
  primaryPersonAge: b.primaryPersonAge,
  eventTheme: b.eventTheme,

  partnerName: b.partnerName,
  partnerEmail: b.partnerEmail,
  partnerPhone: b.partnerPhone,
  partnerOccupation: b.partnerOccupation,

  contactAddress: b.contactAddress,
  contactState: b.contactState,
  contactCountry: b.contactCountry,
  specialRequirements: b.specialRequirements,
});

export const useVendorBookingsStore = create<VendorBookingsState>((set, get) => ({
  bookings: [],
  isLoading: false,

  fetchBookings: async () => {
    try {
      set({ isLoading: true });
      let data = await getMyBookings();

      const needsAutoAccept = data.filter(
        (b) =>
          b.adminApproved &&
          (b.bookingStatus === "pending" || b.bookingStatus === "advance_paid")
      );

      if (needsAutoAccept.length > 0) {
        await Promise.all(
          needsAutoAccept.map((b) =>
            acceptBooking(b.id).catch((err) => {
              console.log(`AUTO-ACCEPT FAILED for booking ${b.id} =>`, err);
            })
          )
        );
        data = await getMyBookings();
      }

      set({ bookings: data.map(mapBooking), isLoading: false });
    } catch (error) {
      console.log("FETCH VENDOR BOOKINGS ERROR =>", error);
      set({ isLoading: false });
    }
  },

  updateStatus: async (id, status) => {
    const previous = get().bookings;
    set((state) => ({
      bookings: state.bookings.map((b) => (b.id === id ? { ...b, status } : b)),
    }));
    try {
      if (status === "Completed") {
        await completeBookingEvent(id);
      }
    } catch (error) {
      console.log("UPDATE BOOKING STATUS ERROR =>", error);
      set({ bookings: previous });
      throw error;
    }
  },
}));