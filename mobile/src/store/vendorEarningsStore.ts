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

export type PendingPaymentBooking = {
  id: string;
  customerName: string;
  eventDate: string;
  advance: number;
  remaining: number;
  status: string;
};

interface VendorEarningsState {
  totalRevenue: number;
  thisMonthRevenue: number;
  pendingAmount: number;
  averageBooking: number;

  highestMonth: { month: string; amount: number };
  lowestMonth: { month: string; amount: number };
  monthlyAverage: number;
  monthlyRevenue: MonthlyRevenue[];

  pendingPayments: {
    totalAmount: number;
    count: number;
    nextExpectedDate: string;
    bookings: PendingPaymentBooking[];
  };

  recentTransactions: Transaction[];

  isLoading: boolean;
  error: string | null;

  fetchEarnings: () => Promise<void>;
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const EXCLUDED_BOOKING_STATUSES = ["cancelled", "rejected"];

export const useVendorEarningsStore = create<VendorEarningsState>((set) => ({
  totalRevenue: 0,
  thisMonthRevenue: 0,
  pendingAmount: 0,
  averageBooking: 0,

  highestMonth: { month: "", amount: 0 },
  lowestMonth: { month: "", amount: 0 },
  monthlyAverage: 0,
  monthlyRevenue: MONTHS.map((m) => ({ month: m, amount: 0 })),

  pendingPayments: {
    totalAmount: 0,
    count: 0,
    nextExpectedDate: "",
    bookings: [],
  },

  recentTransactions: [],

  isLoading: false,
  error: null,

  fetchEarnings: async () => {
    set({ isLoading: true, error: null });

    try {
      const bookings = await getMyBookings();
      const revenueBookings = bookings.filter(
        (booking: any) => !EXCLUDED_BOOKING_STATUSES.includes(booking.bookingStatus)
      );

      let totalRevenue = 0;
      let thisMonthRevenue = 0;
      let pendingAmount = 0;

      const now = new Date();
      const monthlyRevenue: MonthlyRevenue[] = MONTHS.map((m) => ({ month: m, amount: 0 }));
      const transactions: Transaction[] = [];

      revenueBookings.forEach((booking: any) => {
        const total = Number(booking.amount);
        const paid = Number(booking.vendorNetAmount ?? 0);
        const balance = Number(booking.remainingAmount);

        totalRevenue += paid;
        if (booking.paymentStatus !== "paid") {
          pendingAmount += balance;
        }

        const paymentDate = new Date(
          booking.lastPaymentAt ?? booking.updatedAt ?? booking.createdAt,
        );

        if (
          paymentDate.getMonth() === now.getMonth() &&
          paymentDate.getFullYear() === now.getFullYear()
        ) {
          thisMonthRevenue += paid;
        }

        const monthIndex = paymentDate.getMonth();
        if (monthIndex >= 0 && monthIndex < 12 && paymentDate.getFullYear() === now.getFullYear()) {
          monthlyRevenue[monthIndex].amount += paid;
        }

        transactions.push({
          id: booking.id,
          customerName: booking.customerName,
          eventType: booking.eventType,
          date: paymentDate.toISOString().slice(0, 10),
          total,
          paid,
          balance,
          status: booking.paymentStatus,
        });
      });

      transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

      const averageBooking =
        revenueBookings.length > 0 ? Math.round(totalRevenue / revenueBookings.length) : 0;

      const monthsWithActivity = monthlyRevenue.filter((m) => m.amount > 0);

      const highestMonth =
        [...monthsWithActivity].sort((a, b) => b.amount - a.amount)[0] || { month: "—", amount: 0 };

      const lowestMonth =
        [...monthsWithActivity].sort((a, b) => a.amount - b.amount)[0] || { month: "—", amount: 0 };

      const monthlyAverage = monthlyRevenue.reduce((sum, m) => sum + m.amount, 0) / 12;

      const pendingBookings = revenueBookings.filter(
        (booking: any) => booking.paymentStatus !== "paid"
      );

      const pendingPaymentBookings: PendingPaymentBooking[] = pendingBookings.map((booking: any) => ({
        id: booking.id,
        customerName: booking.customerName,
        eventDate: new Date(booking.eventDate).toLocaleDateString("en-GB"),
        advance: Number(booking.advancePaid),
        remaining: Number(booking.remainingAmount),
        status: booking.paymentStatus === "partial" ? "Partial" : "Pending",
      }));

      const upcomingEventDates = pendingBookings
        .map((b: any) => new Date(b.eventDate))
        .filter((d: Date) => d >= now)
        .sort((a: Date, b: Date) => a.getTime() - b.getTime());

      const nextExpectedDate =
        upcomingEventDates.length > 0
          ? upcomingEventDates[0].toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            })
          : "—";

      set({
        totalRevenue,
        thisMonthRevenue,
        pendingAmount,
        averageBooking,

        highestMonth,
        lowestMonth,
        monthlyAverage: Math.round(monthlyAverage),
        monthlyRevenue,

        pendingPayments: {
          totalAmount: pendingAmount,
          count: pendingBookings.length,
          nextExpectedDate,
          bookings: pendingPaymentBookings,
        },

        recentTransactions: transactions,
        isLoading: false,
      });
    } catch (error) {
      console.log("Failed to fetch earnings", error);
      set({ isLoading: false, error: "Failed to load earnings" });
    }
  },
}));
