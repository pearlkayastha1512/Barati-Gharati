

"use client";

//import { useMemo } from "react";

import VendorHero from "@/components/vendor/hero/VendorHero";
import StatsCard from "@/components/vendor/cards/StatsCard";
import QuickActionCard from "@/components/vendor/cards/QuickActionCard";

import PerformanceSection from "@/components/vendor/dashboard/PerformanceSection";
import RevenueOverview from "@/components/vendor/dashboard/RevenueOverview";
//import UpcomingBookings from "@/components/vendor/dashboard/UpcomingBookings";
//import RecentReviews from "@/components/vendor/dashboard/RecentReviews";
import VendorBadgeSummary from "@/components/vendor/dashboard/VendorBadgeSummary";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

import { useBookingStore } from "@/store/bookingStore";
import { useEffect, useMemo } from "react";

import { useVendorProfile } from "@/hooks/useVendorProfile";
import { useReviewStore } from "@/store/reviewStore";
import { getBookingRevenueDate } from "@/utils/bookingRevenue";

import {
  CalendarCheck2,
  Wallet,
  Star,
  Users,
  BriefcaseBusiness,
  Images,
  CalendarDays,
  MessageCircle,
} from "lucide-react";

export default function VendorDashboardPage() {
  const bookings = useBookingStore(
    (state) => state.bookings
  );
  const loadVendorBookings = useBookingStore(
    (state) => state.loadVendorBookings
  );
  const { vendor } = useVendorProfile();

const reviews = useReviewStore((state) => state.reviews);

const loadVendorReviews = useReviewStore(
  (state) => state.loadVendorReviews
);

useEffect(() => {
  if (!vendor) return;

  const refresh = () => {
    void loadVendorBookings(vendor.id);
    void loadVendorReviews(vendor.id);
  };

  refresh();
  window.addEventListener("focus", refresh);
  const interval = window.setInterval(
    refresh,
    30_000
  );

  return () => {
    window.removeEventListener("focus", refresh);
    window.clearInterval(interval);
  };
}, [vendor, loadVendorBookings, loadVendorReviews]);
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const stats = useMemo(() => {
    const monthlyBookings = bookings.filter((booking) => {
      const date = new Date(booking.createdAt);

      return (
        date.getMonth() === currentMonth &&
        date.getFullYear() === currentYear &&
        booking.bookingStatus !== "cancelled"
      );
    });

    const monthlyRevenue = bookings
      .filter((booking) => {
        const paymentDate =
          getBookingRevenueDate(booking);

        return (
          paymentDate.getMonth() === currentMonth &&
          paymentDate.getFullYear() === currentYear &&
          booking.bookingStatus !== "cancelled"
        );
      })
      .reduce(
        (sum, booking) =>
          sum + (booking.vendorNetAmount ?? 0),
        0
      );

    const customers = new Set(
      bookings.map(
        (booking) => booking.customerId
      )
    );
    const averageRating =
  reviews.length === 0
    ? "0"
    : (
        reviews.reduce(
          (sum, review) => sum + review.rating,
          0
        ) / reviews.length
      ).toFixed(1);
    return {
      monthlyBookings: monthlyBookings.length,
      monthlyRevenue,
      totalCustomers: customers.size,
      rating: averageRating,
    };
  }, [
    bookings,
    currentMonth,
    currentYear,
    reviews,
  ]);

  return (
    <ProtectedRoute role="vendor">
      <div className="space-y-8">
        <VendorHero />

        <VendorBadgeSummary />

        <section className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          <StatsCard
            title="Bookings"
            value={stats.monthlyBookings.toString()}
            subtitle="This Month"
            icon={CalendarCheck2}
          />

          <StatsCard
            title="Revenue"
            value={`₹${stats.monthlyRevenue.toLocaleString("en-IN")}`}
            subtitle="Monthly Earnings"
            icon={Wallet}
          />

          <StatsCard
            title="Rating"
            value={stats.rating}
            subtitle="Customer Reviews"
            icon={Star}
          />

          <StatsCard
            title="Customers"
            value={stats.totalCustomers.toString()}
            subtitle="Total Clients"
            icon={Users}
          />
        </section>

        <section>
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-[#4d1730]">
              Quick Actions
            </h2>

            <p className="mt-1 text-[#946176]">
              Manage your business efficiently.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            <QuickActionCard
              title="Services"
              description="Manage your wedding services."
              href="/vendor/services"
              icon={BriefcaseBusiness}
            />

            <QuickActionCard
              title="Portfolio"
              description="Upload photos and videos."
              href="/vendor/portfolio"
              icon={Images}
            />

            <QuickActionCard
              title="Calendar"
              description="Check your availability."
              href="/vendor/calendar"
              icon={CalendarDays}
            />

            <QuickActionCard
              title="Messages"
              description="Talk with customers."
              href="/vendor/messages"
              icon={MessageCircle}
            />
          </div>
        </section>

        <PerformanceSection />

        <section className="grid gap-6 xl:grid-cols-2">
          {/* <UpcomingBookings /> */}
          <RevenueOverview />
        </section>

        {/* <RecentReviews /> */}
      </div>
    </ProtectedRoute>
  );
}
