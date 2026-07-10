import {
  VendorStats,
  MonthSummary,
  BusinessPerformance,
  RevenueOverview,
  UpcomingBooking,
  VendorReview,
  VendorService,
  PortfolioItem,
  VendorMessage,
  VendorBooking,
} from "../types/vendorDashboard";

export const MOCK_STATS: VendorStats = {
  bookingsThisMonth: 0,
  revenueThisMonth: 0,
  rating: 4.9,
  totalCustomers: 0,
};

export const MOCK_MONTH_SUMMARY: MonthSummary = {
  revenue: 0,
  bookings: 0,
  upcoming: 0,
};

export const MOCK_PERFORMANCE: BusinessPerformance = {
  totalBookings: 0,
  pendingRequests: 0,
  conversionRate: 0,
  customerSatisfaction: 4.9,
};

export const MOCK_REVENUE_OVERVIEW: RevenueOverview = {
  today: 0,
  thisWeek: 0,
  thisMonth: 0,
  thisYear: 0,
};

export const MOCK_UPCOMING_BOOKINGS: UpcomingBooking[] = [];

export const MOCK_REVIEWS: VendorReview[] = [
  { id: "1", customerName: "Rahul", comment: "Amazing service!", rating: 5 },
  { id: "2", customerName: "Priya", comment: "Highly recommended.", rating: 5 },
  { id: "3", customerName: "Anjali", comment: "Very professional.", rating: 4 },
];

export const MOCK_SERVICES: VendorService[] = [
  { id: "1", name: "Wedding Photography Package", category: "Photographer", price: 45000, active: true },
  { id: "2", name: "Pre-Wedding Shoot", category: "Photographer", price: 15000, active: true },
  { id: "3", name: "Full Day Coverage", category: "Photographer", price: 60000, active: false },
];

export const MOCK_PORTFOLIO: PortfolioItem[] = [];

export const MOCK_MESSAGES: VendorMessage[] = [];

export const MOCK_BOOKINGS: VendorBooking[] = [];