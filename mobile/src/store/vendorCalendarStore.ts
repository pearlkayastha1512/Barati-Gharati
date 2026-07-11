import { create } from "zustand";
import {
  getMyAvailability,
  blockAvailabilityDate,
  unblockAvailabilityDate,
} from "../api/availability.api";
import { getMyBookings } from "../api/bookings.api";
import { AvailabilityItem } from "../api/availability.api";

export type BlockedDate = {
  id: string;
  date: string; // "YYYY-MM-DD"
  reason?: string;
};

export type BookedDate = {
  date: string; // "YYYY-MM-DD"
};

export type UpcomingEvent = {
  bookingId: string;
  date: string; // "YYYY-MM-DD"
  customerName: string;
  eventType?: string;
};

interface VendorCalendarState {
  selectedDate: string;
  blockedDates: BlockedDate[];
  bookedDates: BookedDate[];
  upcomingEvents: UpcomingEvent[];
  isLoading: boolean;
  error: string | null;

  setSelectedDate: (date: string) => void;
  isBlocked: (date: string) => boolean;
  isBooked: (date: string) => boolean;
  fetchCalendarData: () => Promise<void>;
  blockDate: (date: string, reason?: string) => Promise<void>;
  unblockDate: (date: string) => Promise<void>;
  getMonthStats: (year: number, month: number) => {
    totalDays: number;
    blockedDays: number;
    bookedDays: number;
    availableDays: number;
    availablePercent: number;
  };
}

const todayStr = new Date().toISOString().split("T")[0];

const ACTIVE_BOOKING_STATUSES = ["accepted", "confirmed", "completed"];

export const useVendorCalendarStore = create<VendorCalendarState>((set, get) => ({
  selectedDate: todayStr,
  blockedDates: [],
  bookedDates: [],
  upcomingEvents: [],
  isLoading: false,
  error: null,

  setSelectedDate: (date) => set({ selectedDate: date }),

  isBlocked: (date) => get().blockedDates.some((b) => b.date === date),
  isBooked: (date) => get().bookedDates.some((b) => b.date === date),

  fetchCalendarData: async () => {
    set({ isLoading: true, error: null });

    try {
      let availability: AvailabilityItem[] = [];
let bookings: any[] = [];

try {
  availability = await getMyAvailability();
  console.log(
    "Availability:",
    JSON.stringify(availability, null, 2)
  );
} catch (e) {
  console.log("Availability API Error:", e);
}

try {
  bookings = await getMyBookings();
  console.log(
    "Bookings:",
    JSON.stringify(bookings, null, 2)
  );
} catch (e) {
  console.log("Bookings API Error:", e);
}

      const blockedDates: BlockedDate[] = availability
        .filter((item: any) => item.status === "blocked")
        .map((item: any) => ({ id: item.id, date: item.date, reason: item.reason }));

      const bookedDates: BookedDate[] = availability
        .filter((item: any) => item.status === "booked")
        .map((item: any) => ({ date: item.date }));

      const upcomingEvents: UpcomingEvent[] = bookings
        .filter((b: any) => ACTIVE_BOOKING_STATUSES.includes(b.bookingStatus))
        .map((b: any) => ({
          bookingId: b.id,
          date: new Date(b.eventDate).toISOString().slice(0, 10),
          customerName: b.customerName,
          eventType: b.eventType,
        }))
        .filter((e: UpcomingEvent) => e.date >= todayStr)
        .sort((a: UpcomingEvent, b: UpcomingEvent) => a.date.localeCompare(b.date));

      set({ blockedDates, bookedDates, upcomingEvents, isLoading: false });
    } catch (error) {
      console.log("Failed to fetch calendar data", error);
      set({ isLoading: false, error: "Failed to load calendar" });
    }
  },

  blockDate: async (date, reason) => {
    if (get().isBlocked(date)) return;

    try {
      const created = await blockAvailabilityDate(date, reason);

      set((state) => ({
        blockedDates: [
          ...state.blockedDates,
          { id: created.id, date: created.date, reason: created.reason },
        ],
      }));
    } catch (error) {
      console.log("Failed to block date", error);
      throw error;
    }
  },

  unblockDate: async (date) => {
    const existing = get().blockedDates.find((b) => b.date === date);
    if (!existing) return;

    try {
      await unblockAvailabilityDate(existing.id);

      set((state) => ({
        blockedDates: state.blockedDates.filter((b) => b.date !== date),
      }));
    } catch (error) {
      console.log("Failed to unblock date", error);
      throw error;
    }
  },

  getMonthStats: (year, month) => {
    const totalDays = new Date(year, month + 1, 0).getDate();
    const monthPrefix = `${year}-${String(month + 1).padStart(2, "0")}`;

    const blockedDays = get().blockedDates.filter((b) => b.date.startsWith(monthPrefix)).length;
    const bookedDays = get().bookedDates.filter((b) => b.date.startsWith(monthPrefix)).length;
    const availableDays = totalDays - blockedDays - bookedDays;
    const availablePercent = totalDays > 0 ? Math.round((availableDays / totalDays) * 100) : 0;

    return { totalDays, blockedDays, bookedDays, availableDays, availablePercent };
  },
}));