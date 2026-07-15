import { create } from "zustand";
import {
  getMyVendorProfile,
  getVendorDashboard,
  getMyBookings,
  getVendorReviews,
  getVendorAverageRating,
  BackendBooking,
  BackendReview,
} from "../api/vendorDashboard.api";

type UpcomingBooking = { id: string; customerName: string; date: string };
type ReviewItem = { id: string; customerName: string; comment: string; rating: number };

interface VendorDashboardState {
  isLoading: boolean;
  isApproved: boolean;
  approvalChecked: boolean;
  error: string | null;

  vendorName: string;
  businessName: string;
  vendorBackendId: string;

  bookingsThisMonth: number;
  revenueThisMonth: number;
  rating: number;
  totalCustomers: number;

  monthRevenue: number;
  monthBookings: number;
  monthUpcoming: number;

  totalBookings: number;
  pendingRequests: number;
  conversionRate: number;
  customerSatisfaction: number;

  revenueToday: number;
  revenueThisWeek: number;
  revenueThisMonthTotal: number;
  revenueThisYear: number;

  upcomingBookings: UpcomingBooking[];
  recentReviews: ReviewItem[];

  fetchDashboard: () => Promise<void>;
}

const isSameMonth = (d: Date, ref: Date) =>
  d.getFullYear() === ref.getFullYear() && d.getMonth() === ref.getMonth();

const isSameYear = (d: Date, ref: Date) => d.getFullYear() === ref.getFullYear();

const isSameWeek = (d: Date, ref: Date) => {
  const start = new Date(ref);
  start.setDate(ref.getDate() - ref.getDay());
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setDate(start.getDate() + 7);
  return d >= start && d < end;
};

const isSameDay = (d: Date, ref: Date) =>
  d.getFullYear() === ref.getFullYear() && d.getMonth() === ref.getMonth() && d.getDate() === ref.getDate();

export const useVendorDashboardStore = create<VendorDashboardState>((set) => ({
  isLoading: false,
  isApproved: true,
  approvalChecked: false,
  error: null,

  vendorName: "",
  businessName: "",
  vendorBackendId: "",

  bookingsThisMonth: 0,
  revenueThisMonth: 0,
  rating: 0,
  totalCustomers: 0,

  monthRevenue: 0,
  monthBookings: 0,
  monthUpcoming: 0,

  totalBookings: 0,
  pendingRequests: 0,
  conversionRate: 0,
  customerSatisfaction: 0,

  revenueToday: 0,
  revenueThisWeek: 0,
  revenueThisMonthTotal: 0,
  revenueThisYear: 0,

  upcomingBookings: [],
  recentReviews: [],

  fetchDashboard: async () => {
    set({ isLoading: true, error: null });

    try {
      const profile = await getMyVendorProfile();

      if (profile.status !== "APPROVED") {
        set({ isLoading: false, isApproved: false, approvalChecked: true });
        return;
      }

      const [dashboard, bookings, reviews, avgRating] = await Promise.all([
        getVendorDashboard(),
        getMyBookings(),
        getVendorReviews(profile.id).catch(() => [] as BackendReview[]),
        getVendorAverageRating(profile.id).catch(() => 0),
      ]);

      const now = new Date();

      const convertedStatuses = ["accepted", "completed", "event_completed"];
      const isRevenueCounted = (b: BackendBooking) =>
        b.payoutStatus === "released" || b.payoutStatus === "settled";

      const confirmedOrAccepted = bookings.filter((b) =>
        convertedStatuses.includes(b.bookingStatus)
      );

      const thisMonthBookings = bookings.filter((b) => isSameMonth(new Date(b.eventDate), now));

      const thisMonthRevenue = thisMonthBookings
        .filter(isRevenueCounted)
        .reduce((sum, b) => sum + b.vendorNetAmount, 0);

      const upcoming = confirmedOrAccepted
        .filter((b) => new Date(b.eventDate) >= now)
        .sort((a, b) => new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime());

      const revenueToday = bookings
        .filter((b) => isRevenueCounted(b) && isSameDay(new Date(b.createdAt), now))
        .reduce((sum, b) => sum + b.vendorNetAmount, 0);

      const revenueThisWeek = bookings
        .filter((b) => isRevenueCounted(b) && isSameWeek(new Date(b.createdAt), now))
        .reduce((sum, b) => sum + b.vendorNetAmount, 0);

      const revenueThisYear = bookings
        .filter((b) => isRevenueCounted(b) && isSameYear(new Date(b.createdAt), now))
        .reduce((sum, b) => sum + b.vendorNetAmount, 0);

      const uniqueCustomers = new Set(bookings.map((b) => b.customerId)).size;

      const conversionRate =
        bookings.length > 0
          ? Math.round((confirmedOrAccepted.length / bookings.length) * 100)
          : 0;

      set({
        isLoading: false,
        isApproved: true,
        approvalChecked: true,
        vendorName: profile.user.name,
        businessName: profile.businessName,
        vendorBackendId: profile.id,

        bookingsThisMonth: thisMonthBookings.length,
        revenueThisMonth: thisMonthRevenue,
        rating: avgRating || dashboard.averageRating,
        totalCustomers: uniqueCustomers,

        monthRevenue: thisMonthRevenue,
        monthBookings: thisMonthBookings.length,
        monthUpcoming: upcoming.length,

        totalBookings: dashboard.totalBookings,
        pendingRequests: dashboard.pendingBookings,
        conversionRate,
        customerSatisfaction: avgRating || dashboard.averageRating,

        revenueToday,
        revenueThisWeek,
        revenueThisMonthTotal: thisMonthRevenue,
        revenueThisYear,

        upcomingBookings: upcoming.slice(0, 5).map((b) => ({
          id: b.id,
          customerName: b.customerName,
          date: new Date(b.eventDate).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          }),
        })),

        recentReviews: reviews.slice(0, 3).map((r) => ({
          id: r.id,
          customerName: r.user?.name ?? "Customer",
          comment: r.comment ?? "",
          rating: r.rating,
        })),
      });
    } catch (error: any) {
      console.log("FETCH VENDOR DASHBOARD ERROR =>", error?.response?.data ?? error.message);
      set({
        isLoading: false,
        approvalChecked: true,
        error: error?.response?.data?.message ?? "Unable to load dashboard.",
      });
    }
  },
}));
