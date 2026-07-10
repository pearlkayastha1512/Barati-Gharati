import { create } from "zustand";

export type BlockedDate = {
  date: string; // "YYYY-MM-DD"
  reason?: string;
};

export type BookedDate = {
  date: string; // "YYYY-MM-DD"
  customerName: string;
  eventType?: string;
};

interface VendorCalendarState {
  selectedDate: string;
  blockedDates: BlockedDate[];
  bookedDates: BookedDate[]; // TODO: populate from Booking table once backend connected (bookings with status ACCEPTED/CONFIRMED for this vendor)

  setSelectedDate: (date: string) => void;
  isBlocked: (date: string) => boolean;
  isBooked: (date: string) => boolean;
  blockDate: (date: string, reason?: string) => void;
  unblockDate: (date: string) => void;
  getMonthStats: (year: number, month: number) => {
    totalDays: number;
    blockedDays: number;
    bookedDays: number;
    availableDays: number;
    availablePercent: number;
  };
}

const todayStr = new Date().toISOString().split("T")[0];

export const useVendorCalendarStore = create<VendorCalendarState>((set, get) => ({
  selectedDate: todayStr,
  blockedDates: [],
  bookedDates: [], // TODO: fetch via GET /vendor/bookings?status=ACCEPTED,CONFIRMED once connected

  setSelectedDate: (date) => set({ selectedDate: date }),

  isBlocked: (date) => get().blockedDates.some((b) => b.date === date),
  isBooked: (date) => get().bookedDates.some((b) => b.date === date),

  blockDate: (date, reason) => {
    if (get().isBlocked(date)) return;
    // TODO: call POST /vendor/availability { date, status: "BLOCKED", reason } once backend connected
    // On success, push the real record returned by the API instead of this local object.
    set((state) => ({
      blockedDates: [...state.blockedDates, { date, reason }],
    }));
  },

  unblockDate: (date) => {
    // TODO: call DELETE /vendor/availability/:date (or /:id) once backend connected
    set((state) => ({
      blockedDates: state.blockedDates.filter((b) => b.date !== date),
    }));
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