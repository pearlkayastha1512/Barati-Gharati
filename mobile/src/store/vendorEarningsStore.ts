import { create } from "zustand";

export type MonthlyRevenue = { month: string; amount: number };

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
  highestMonth: { month: string; amount: number };
  lowestMonth: { month: string; amount: number };
  monthlyAverage: number;
  monthlyRevenue: MonthlyRevenue[];
  nextPayout: { amount: number; scheduledDate: string; includedPayments: number };
  recentTransactions: Transaction[];
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// TODO: once ready, replace these static defaults with a fetchEarnings()
// action that calls GET /bookings and computes totals/monthly grouping
// client-side (backend has no dedicated earnings endpoint yet).
// nextPayout has no backend data source at all (no Payout model exists).
export const useVendorEarningsStore = create<VendorEarningsState>(() => ({
  totalRevenue: 0,
  thisMonthRevenue: 0,
  pendingAmount: 0,
  averageBooking: 0,
  highestMonth: { month: "Dec", amount: 0 },
  lowestMonth: { month: "Dec", amount: 0 },
  monthlyAverage: 0,
  monthlyRevenue: MONTHS.map((month) => ({ month, amount: 0 })),
  nextPayout: { amount: 0, scheduledDate: "15 July 2026", includedPayments: 0 },
  recentTransactions: [],
}));