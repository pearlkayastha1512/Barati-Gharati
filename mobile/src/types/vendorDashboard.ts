export type VendorStats = {
  bookingsThisMonth: number;
  revenueThisMonth: number;
  rating: number;
  totalCustomers: number;
};

export type MonthSummary = {
  revenue: number;
  bookings: number;
  upcoming: number;
};

export type BusinessPerformance = {
  totalBookings: number;
  pendingRequests: number;
  conversionRate: number;
  customerSatisfaction: number;
};

export type RevenueOverview = {
  today: number;
  thisWeek: number;
  thisMonth: number;
  thisYear: number;
};

export type UpcomingBooking = {
  id: string;
  customerName: string;
  eventType: string;
  date: string;
  time?: string;
};

export type VendorReview = {
  id: string;
  customerName: string;
  comment: string;
  rating: number;
};

export type VendorService = {
  id: string;
  name: string;
  category: string;
  price: number;
  active: boolean;
};

export type PortfolioItem = {
  id: string;
  imageUri: string;
  caption?: string;
};

export type VendorMessage = {
  id: string;
  customerName: string;
  lastMessage: string;
  timestamp: string;
  unread: boolean;
};

export type BookingStatus = "pending" | "confirmed" | "completed" | "cancelled";

export type VendorBooking = {
  id: string;
  customerName: string;
  eventType: string;
  date: string;
  status: BookingStatus;
  amount: number;
};