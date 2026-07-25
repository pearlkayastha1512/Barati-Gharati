import { create } from "zustand";
import {
  getMyBookings,
  acceptBooking,
  rejectBooking,
  completeBookingEvent,
  primaryAccept,
  primaryReject,
  promotedAccept,
  promotedReject,
  standbyRespond,
  BackendBooking,
} from "../api/vendorBookings.api";

export type VendorBookingStatus = "Pending" | "Accepted" | "Completed" | "Cancelled" | "Rejected";

export type VendorBookingRecord = {
  id: string;
  customerName: string;
  eventType: string;
  date: string;
  eventDateRaw: string;
  amount: number;
  status: VendorBookingStatus;
  // Raw lowercase backend status (e.g. "waiting_primary_vendor") — used for
  // precise flow-stage logic in the modal, since `status` above is only a
  // simplified bucket for dashboard counts.
  rawStatus: string;

  packageName: string;
  advancePaid: number;
  platformCommission: number;
  vendorNetAmount: number;
  payoutStatus: string | null;
  payoutSimulated: boolean;
  payoutReleasedAt: string | null;
  vendorAcknowledgedAt: string | null;
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
  acceptBooking: (id: string) => Promise<void>;
  rejectBooking: (id: string, cancellationReason: string) => Promise<void>;
  primaryAccept: (id: string) => Promise<void>;
  primaryReject: (id: string, reason?: string) => Promise<void>;
  promotedAccept: (id: string) => Promise<void>;
  promotedReject: (id: string, reason?: string) => Promise<void>;
  standbyRespond: (id: string, response: "AVAILABLE" | "NOT_AVAILABLE") => Promise<void>;
}

// Ground-truth mapping, based on BookingsService.mapBookingStatus() on the backend.
const mapStatus = (backendStatus: string): VendorBookingStatus => {
  const s = backendStatus.toLowerCase();
  switch (s) {
    case "pending":
    case "matching":
    case "waiting_primary_vendor":
    case "promote_standby":
    case "awaiting_admin_review":
      return "Pending";

    case "primary_accepted":
    case "waiting_payment":
    case "standby_accepted":
    case "advance_paid":
    case "payment_approved":
    case "payment_held":
    case "in_progress":
    case "accepted":
      return "Accepted";

    // NOTE: backend currently maps both CONFIRMED and COMPLETED to the string
    // "completed" (a naming collision in mapBookingStatus() — worth flagging
    // to the backend team). We treat "completed" as the Completed bucket here,
    // and rely on rawStatus + event date in the modal to decide whether the
    // "Mark Event as Completed" action should still be offered.
    case "completed":
    case "event_completed":
    case "review_pending":
    case "closed":
      return "Completed";

    case "cancelled":
    case "primary_rejected":
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
  rawStatus: b.bookingStatus.toLowerCase(),
  adminApproved: b.adminApproved,
  packageName: b.packageName,
  advancePaid: b.advancePaid,
  platformCommission: b.platformCommission ?? 0,
  vendorNetAmount: b.vendorNetAmount ?? 0,
  payoutStatus: b.payoutStatus,
  payoutSimulated: b.payoutSimulated,
  payoutReleasedAt: b.payoutReleasedAt,
  vendorAcknowledgedAt: b.vendorAcknowledgedAt,
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
      const data = await getMyBookings();
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

  acceptBooking: async (id) => {
    const previous = get().bookings;
    set((state) => ({
      bookings: state.bookings.map((b) => (b.id === id ? { ...b, status: "Accepted" } : b)),
    }));
    try {
      await acceptBooking(id);
    } catch (error) {
      console.log("ACCEPT BOOKING ERROR =>", error);
      set({ bookings: previous });
      throw error;
    }
  },

  rejectBooking: async (id, cancellationReason) => {
    const previous = get().bookings;
    set((state) => ({
      bookings: state.bookings.map((b) => (b.id === id ? { ...b, status: "Rejected" } : b)),
    }));
    try {
      await rejectBooking(id, cancellationReason);
    } catch (error) {
      console.log("REJECT BOOKING ERROR =>", error);
      set({ bookings: previous });
      throw error;
    }
  },

  primaryAccept: async (id) => {
    const previous = get().bookings;
    set((state) => ({
      bookings: state.bookings.map((b) =>
        b.id === id ? { ...b, status: "Accepted", rawStatus: "waiting_payment" } : b
      ),
    }));
    try {
      await primaryAccept(id);
      await get().fetchBookings();
    } catch (error) {
      console.log("PRIMARY ACCEPT ERROR =>", error);
      set({ bookings: previous });
      throw error;
    }
  },

  primaryReject: async (id, reason) => {
    const previous = get().bookings;
    set((state) => ({
      bookings: state.bookings.map((b) =>
        b.id === id ? { ...b, status: "Rejected", rawStatus: "primary_rejected" } : b
      ),
    }));
    try {
      await primaryReject(id, reason);
      await get().fetchBookings();
    } catch (error) {
      console.log("PRIMARY REJECT ERROR =>", error);
      set({ bookings: previous });
      throw error;
    }
  },

  promotedAccept: async (id) => {
    const previous = get().bookings;
    set((state) => ({
      bookings: state.bookings.map((b) =>
        // Backend puts a promoted vendor's accept on the same "waiting_payment"
        // status as a normal primary accept (see BookingEngineService.handlePromotedAccept) —
        // this optimistic value is overwritten by the fetchBookings() call below
        // as soon as the real response lands.
        b.id === id ? { ...b, status: "Accepted", rawStatus: "waiting_payment" } : b
      ),
    }));
    try {
      await promotedAccept(id);
      await get().fetchBookings();
    } catch (error) {
      console.log("PROMOTED ACCEPT ERROR =>", error);
      set({ bookings: previous });
      throw error;
    }
  },

  promotedReject: async (id, reason) => {
    const previous = get().bookings;
    set((state) => ({
      bookings: state.bookings.map((b) =>
        b.id === id ? { ...b, status: "Rejected", rawStatus: "primary_rejected" } : b
      ),
    }));
    try {
      await promotedReject(id, reason);
      await get().fetchBookings();
    } catch (error) {
      console.log("PROMOTED REJECT ERROR =>", error);
      set({ bookings: previous });
      throw error;
    }
  },

  standbyRespond: async (id, response) => {
    try {
      await standbyRespond(id, response);
      await get().fetchBookings();
    } catch (error) {
      console.log("STANDBY RESPOND ERROR =>", error);
      throw error;
    }
  },
}));