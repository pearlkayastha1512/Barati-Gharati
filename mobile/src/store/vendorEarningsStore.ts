import { create } from "zustand";
import { getMyBookings } from "../api/bookings.api";

export type MonthlyRevenue = {
  month: string;
  amount: number;
};

export type Transaction = {
  id: string;
  customerName: string;
  eventType: string;
  date: string;
  total: number;
  paid: number;
  balance: number;
  status: string;
};

interface VendorEarningsState {
  totalRevenue: number;
  thisMonthRevenue: number;
  pendingAmount: number;
  averageBooking: number;

  highestMonth: {
    month: string;
    amount: number;
  };

  lowestMonth: {
    month: string;
    amount: number;
  };

  monthlyAverage: number;

  monthlyRevenue: MonthlyRevenue[];

  nextPayout: {
    amount: number;
    scheduledDate: string;
    includedPayments: number;
  };

  recentTransactions: Transaction[];

  isLoading: boolean;
  error: string | null;

  fetchEarnings: () => Promise<void>;
}

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
const REVENUE_BOOKING_STATUSES = [
  "accepted",
  "completed",
  "event_completed",
];

export const useVendorEarningsStore =
  create<VendorEarningsState>((set) => ({
    totalRevenue: 0,
    thisMonthRevenue: 0,
    pendingAmount: 0,
    averageBooking: 0,

    highestMonth: {
      month: "",
      amount: 0,
    },

    lowestMonth: {
      month: "",
      amount: 0,
    },

    monthlyAverage: 0,

    monthlyRevenue: MONTHS.map((m) => ({
      month: m,
      amount: 0,
    })),

    nextPayout: {
      amount: 0,
      scheduledDate: "",
      includedPayments: 0,
    },

    recentTransactions: [],

    isLoading: false,
    error: null,

    fetchEarnings: async () => {
      set({
        isLoading: true,
        error: null,
      });

      try {
        const bookings = await getMyBookings();
        const revenueBookings = bookings.filter((booking: any) =>
  REVENUE_BOOKING_STATUSES.includes(booking.bookingStatus)
);

       console.log(
  "Revenue Bookings:",
  JSON.stringify(revenueBookings, null, 2)
);
        let totalRevenue = 0;
        let thisMonthRevenue = 0;
        let pendingAmount = 0;

        const now = new Date();

        const monthlyRevenue: MonthlyRevenue[] = MONTHS.map((m) => ({
          month: m,
          amount: 0,
        }));

        const transactions: Transaction[] = [];

        revenueBookings.forEach((booking: any) =>  {
          const total = Number(booking.amount);
          const paid = Number(booking.advancePaid);
          const balance = Number(booking.remainingAmount);

          totalRevenue += paid;
          if (booking.paymentStatus !== "paid") {
  pendingAmount += balance;
}

          const date = new Date(booking.eventDate);

          if (
            date.getMonth() === now.getMonth() &&
            date.getFullYear() === now.getFullYear()
          ) {
            thisMonthRevenue += paid;
          }

          const monthIndex = date.getMonth();

if (monthIndex >= 0 && monthIndex < 12) {
  monthlyRevenue[monthIndex].amount += paid;
}

          transactions.push({
            id: booking.id,
            customerName: booking.customerName,
            eventType: booking.eventType,
            date: date.toISOString().slice(0, 10),
            total,
            paid,
            balance,
            status: booking.paymentStatus,
          });
        });
        transactions.sort(
  (a, b) =>
    new Date(b.date).getTime() -
    new Date(a.date).getTime()
);

        const averageBooking =
  revenueBookings.length > 0
    ? Math.round(totalRevenue / revenueBookings.length)
    : 0;

        const highestMonth =
          [...monthlyRevenue].sort(
            (a, b) => b.amount - a.amount
          )[0] || {
            month: "",
            amount: 0,
          };

        const lowestMonth =
          [...monthlyRevenue].sort(
            (a, b) => a.amount - b.amount
          )[0] || {
            month: "",
            amount: 0,
          };

        const monthlyAverage =
          monthlyRevenue.reduce(
            (sum, m) => sum + m.amount,
            0
          ) / 12;

        set({
          totalRevenue,
          thisMonthRevenue,
          pendingAmount,
          averageBooking,

          highestMonth,
          lowestMonth,
          monthlyAverage: Math.round(monthlyAverage),

          monthlyRevenue,

          nextPayout: {
            amount: pendingAmount,
            scheduledDate: "15 July 2026",
            includedPayments: revenueBookings.length,
          },

          recentTransactions: transactions,

          isLoading: false,
        });
      } catch (error) {
        console.log("Failed to fetch earnings", error);

        set({
          isLoading: false,
          error: "Failed to load earnings",
        });
      }
    },
  }));