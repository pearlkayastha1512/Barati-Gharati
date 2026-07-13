import { create } from "zustand";
import { getMyBookings, BackendBooking } from "../api/vendorBookings.api";
import { getAverageRating } from "../api/vendorReviews.api";

export type MonthlyBookingCount = { month: string; count: number };
export type MonthlyRevenue = { month: string; amount: number };

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
  isLoading: boolean;
  customers: number;
  growthPercent: number;
  rating: number;
  monthlyBookings: MonthlyBookingCount[];
  monthlyRevenue: MonthlyRevenue[];
  totalBookingsThisYear: number;
  bestRevenueMonth: string;
  topServices: TopService[];
  insights: Insight[];
  fetchAnalytics: () => Promise<void>;
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const INACTIVE_STATUSES = ["cancelled", "rejected"];

function computeAnalytics(bookings: BackendBooking[]) {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonthIndex = now.getMonth();

  const activeBookings = bookings.filter(
    (b) => !INACTIVE_STATUSES.includes(b.bookingStatus)
  );

  const uniqueCustomers = new Set(
    activeBookings.map((b) => b.customerEmail || b.customerId)
  );

  const monthlyBookingCounts = MONTHS.map((month) => ({ month, count: 0 }));
  const monthlyRevenueTotals = MONTHS.map((month) => ({ month, amount: 0 }));

  let totalBookingsThisYear = 0;

  activeBookings.forEach((b) => {
    const eventDate = new Date(b.eventDate);
    if (eventDate.getFullYear() !== currentYear) return;

    const monthIdx = eventDate.getMonth();
    monthlyBookingCounts[monthIdx].count += 1;
    monthlyRevenueTotals[monthIdx].amount += b.advancePaid || 0;
    totalBookingsThisYear += 1;
  });

  const bestMonth = monthlyRevenueTotals.reduce(
    (best, curr) => (curr.amount > best.amount ? curr : best),
    monthlyRevenueTotals[0]
  );

  const thisMonthCount = monthlyBookingCounts[currentMonthIndex]?.count ?? 0;
  const lastMonthIndex = currentMonthIndex === 0 ? 11 : currentMonthIndex - 1;
  const lastMonthCount = monthlyBookingCounts[lastMonthIndex]?.count ?? 0;

  let growthPercent = 0;
  if (lastMonthCount > 0) {
    growthPercent = Math.round(((thisMonthCount - lastMonthCount) / lastMonthCount) * 100);
  } else if (thisMonthCount > 0) {
    growthPercent = 100;
  }

  const serviceMap = new Map<string, { bookings: number; revenue: number }>();
  activeBookings.forEach((b) => {
    const key = b.packageName || "Unnamed Package";
    const existing = serviceMap.get(key) ?? { bookings: 0, revenue: 0 };
    existing.bookings += 1;
    existing.revenue += b.advancePaid || 0;
    serviceMap.set(key, existing);
  });

  const topServices: TopService[] = Array.from(serviceMap.entries())
    .map(([name, data]) => ({ id: name, name, ...data, rank: 0 }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5)
    .map((s, idx) => ({ ...s, rank: idx + 1 }));

  const insights: Insight[] = [];

  if (activeBookings.length === 0) {
    insights.push({
      id: "no-data",
      icon: "information-outline",
      text: "No bookings yet — insights will appear once you start receiving bookings.",
    });
  } else {
    if (bestMonth.amount > 0) {
      insights.push({
        id: "best-month",
        icon: "trending-up",
        text: `${bestMonth.month} was your best month, generating ₹${bestMonth.amount.toLocaleString("en-IN")} in advance payments.`,
      });
    }

    if (topServices.length > 0) {
      insights.push({
        id: "top-service",
        icon: "star-outline",
        text: `${topServices[0].name} is your top-performing service with ${topServices[0].bookings} booking${topServices[0].bookings > 1 ? "s" : ""}.`,
      });
    }

    if (growthPercent !== 0) {
      insights.push({
        id: "growth",
        icon: growthPercent > 0 ? "arrow-up-bold" : "arrow-down-bold",
        text:
          growthPercent > 0
            ? `Bookings are up ${growthPercent}% compared to last month.`
            : `Bookings are down ${Math.abs(growthPercent)}% compared to last month — consider reaching out to leads.`,
      });
    }

    insights.push({
      id: "customers",
      icon: "account-group-outline",
      text: `You've worked with ${uniqueCustomers.size} unique customer${uniqueCustomers.size !== 1 ? "s" : ""} so far.`,
    });
  }

  return {
    customers: uniqueCustomers.size,
    growthPercent,
    monthlyBookings: monthlyBookingCounts,
    monthlyRevenue: monthlyRevenueTotals,
    totalBookingsThisYear,
    bestRevenueMonth: bestMonth.amount > 0 ? bestMonth.month : "—",
    topServices,
    insights,
  };
}

export const useVendorAnalyticsStore = create<VendorAnalyticsState>((set) => ({
  isLoading: false,
  customers: 0,
  growthPercent: 0,
  rating: 0,
  monthlyBookings: MONTHS.map((month) => ({ month, count: 0 })),
  monthlyRevenue: MONTHS.map((month) => ({ month, amount: 0 })),
  totalBookingsThisYear: 0,
  bestRevenueMonth: "—",
  topServices: [],
  insights: [],

  fetchAnalytics: async () => {
    try {
      set({ isLoading: true });
      const bookings = await getMyBookings();
      const computed = computeAnalytics(bookings);

      let rating = 0;
      const vendorId = bookings[0]?.vendorId;
      if (vendorId) {
        try {
          const ratingData = await getAverageRating(String(vendorId));
          rating = ratingData.averageRating ?? 0;
        } catch (err) {
          console.log("FETCH VENDOR RATING ERROR =>", err);
        }
      }

      set({ ...computed, rating, isLoading: false });
    } catch (error) {
      console.log("FETCH VENDOR ANALYTICS ERROR =>", error);
      set({ isLoading: false });
    }
  },
}));