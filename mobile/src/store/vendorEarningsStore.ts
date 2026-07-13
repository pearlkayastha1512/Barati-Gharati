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

export type PayoutBooking = {
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
    bookings: PayoutBooking[];
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

export const useVendorEarningsStore = create<VendorEarningsState>((set) => ({
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
    bookings: [],
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

      let totalRevenue = 0;
      let thisMonthRevenue = 0;
      let pendingAmount = 0;

      const now = new Date();

      const monthlyRevenue: MonthlyRevenue[] = MONTHS.map((m) => ({
        month: m,
        amount: 0,
      }));

      const transactions: Transaction[] = [];

      revenueBookings.forEach((booking: any) => {
        const total = Number(booking.amount);
        const paid = Number(booking.advancePaid);
        const balance = Number(booking.remainingAmount);

        totalRevenue += paid;
        if (booking.paymentStatus !== "paid") {
          pendingAmount += balance;
        }

        // Use createdAt (when the payment/booking activity actually happened),
        // not eventDate (the wedding date, which is often months in the future).
        const paymentDate = new Date(booking.createdAt);

        if (
          paymentDate.getMonth() === now.getMonth() &&
          paymentDate.getFullYear() === now.getFullYear()
        ) {
          thisMonthRevenue += paid;
        }

        const monthIndex = paymentDate.getMonth();

        if (
          monthIndex >= 0 &&
          monthIndex < 12 &&
          paymentDate.getFullYear() === now.getFullYear()
        ) {
          monthlyRevenue[monthIndex].amount += paid;
        }

        transactions.push({
          id: booking.id,
          customerName: booking.customerName,
          eventType: booking.eventType,
          date: new Date(booking.eventDate).toISOString().slice(0, 10),
          total,
          paid,
          balance,
          status: booking.paymentStatus,
        });
      });

      transactions.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );

      const averageBooking =
        revenueBookings.length > 0
          ? Math.round(totalRevenue / revenueBookings.length)
          : 0;

      const highestMonth =
        [...monthlyRevenue].sort((a, b) => b.amount - a.amount)[0] || {
          month: "",
          amount: 0,
        };

      const lowestMonth =
        [...monthlyRevenue].sort((a, b) => a.amount - b.amount)[0] || {
          month: "",
          amount: 0,
        };

      const monthlyAverage =
        monthlyRevenue.reduce((sum, m) => sum + m.amount, 0) / 12;

      // Bookings with an outstanding balance — these make up the upcoming payout.
      const pendingBookings = revenueBookings.filter(
        (booking: any) => booking.paymentStatus !== "paid"
      );

      const payoutBookings: PayoutBooking[] = pendingBookings.map(
        (booking: any) => ({
          id: booking.id,
          customerName: booking.customerName,
          eventDate: new Date(booking.eventDate).toLocaleDateString("en-GB"),
          advance: Number(booking.advancePaid),
          remaining: Number(booking.remainingAmount),
          status: booking.paymentStatus === "partial" ? "Partial" : "Pending",
        })
      );

      // Dynamic scheduled date: earliest upcoming event date among pending
      // bookings, since the remaining balance is typically expected around
      // the event. Falls back to 7 days from today if there are none.
      const upcomingEventDates = pendingBookings
        .map((b: any) => new Date(b.eventDate))
        .filter((d: Date) => d >= now)
        .sort((a: Date, b: Date) => a.getTime() - b.getTime());

      const scheduledDate =
        upcomingEventDates.length > 0
          ? upcomingEventDates[0].toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            })
          : new Date(
              now.getTime() + 7 * 24 * 60 * 60 * 1000
            ).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            });

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
          scheduledDate,
          includedPayments: pendingBookings.length,
          bookings: payoutBookings,
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