import { create } from "zustand";

export type MonthlyBookingCount = { month: string; count: number };

export type TopService = {
  id: string;
  name: string;
  bookings: number;
  revenue: number;
  rank: number;
};

export type Insight = {
  id: string;
  icon: string;
  text: string;
};

interface VendorAnalyticsState {
  profileViews: number;        // No backend source — no view-tracking model exists
  customers: number;           // Future: distinct userId count across vendor's bookings
  growthPercent: number;       // No backend source — no period-over-period calc exists
  rating: number;              // Future: average of Review.rating for this vendor
  monthlyBookings: MonthlyBookingCount[]; // Future: group Booking by month for this vendor
  totalBookingsThisYear: number;
  bestRevenueMonth: string;    // Future: derived from monthly revenue grouping
  topServices: TopService[];   // Future: group bookings by Package/Category, sum revenue
  insights: Insight[];         // No backend source — these are narrative/derived text
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// TODO: once ready to connect, add a fetchAnalytics() action that calls
// GET /bookings (+ a reviews endpoint) and computes these values client-side,
// same approach as vendorEarningsStore. profileViews, growthPercent, and
// insights have no backend data source at all right now.
export const useVendorAnalyticsStore = create<VendorAnalyticsState>(() => ({
  profileViews: 0,
  customers: 0,
  growthPercent: 0,
  rating: 0,
  monthlyBookings: MONTHS.map((month) => ({ month, count: 0 })),
  totalBookingsThisYear: 0,
  bestRevenueMonth: "January",
  topServices: [],
  insights: [],
}));