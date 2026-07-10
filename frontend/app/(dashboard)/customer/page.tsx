"use client";
import WelcomeHero from "@/components/dashboard/hero/WelcomeHero";
import StatsCard from "@/components/dashboard/cards/StatsCard";
import QuickActionCard from "@/components/dashboard/cards/QuickActionCard";

import InsightsSection from "@/components/dashboard/sections/InsightsSection";

import UpcomingBookings from "@/components/dashboard/widgets/UpcomingBookings";
import BudgetOverview from "@/components/dashboard/widgets/BudgetOverview";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { useEffect, useMemo } from "react";

import { useAuthStore } from "@/store/authStore";
import { useBookingStore } from "@/store/bookingStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { useReviewStore } from "@/store/reviewStore";

import {
  Search,
  
 
  Sparkles,
} from "lucide-react";

import {
  CalendarDays,
  Heart,
  Wallet,
  Star,
} from "lucide-react";

export default function CustomerDashboardPage() {

  const { user } = useAuthStore();

const {
  bookings,
  loadCustomerBookings,
} = useBookingStore();

const {
  wishlist,
  loadWishlist,
} = useWishlistStore();

const {
  reviews,
  loadCustomerReviews,
} = useReviewStore();

useEffect(() => {
  if (!user) return;

  loadCustomerBookings(user._id);

  loadWishlist();

  loadCustomerReviews(user._id);
}, [
  user,
  loadCustomerBookings,
  loadWishlist,
  loadCustomerReviews,
]);

const remainingBudget = useMemo(() => {
  const total = bookings.reduce(
    (sum, booking) => sum + booking.remainingAmount,
    0
  );

  return `₹${total.toLocaleString("en-IN")}`;
}, [bookings]);
  

  return (
     <ProtectedRoute role="customer">
    <div className="space-y-8">

      <WelcomeHero />

      <section className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">

        <StatsCard
          title="Bookings"
         value={bookings.length.toString()}
subtitle="Total Bookings"
          icon={CalendarDays}
        />

        <StatsCard
          title="Wishlist"
          value={wishlist.length.toString()}
subtitle="Saved Vendors"
          icon={Heart}
        />

        <StatsCard
          title="Budget"
          value={remainingBudget}
subtitle="Budget Remaining"
          icon={Wallet}
        />

        <StatsCard
          title="Reviews"
          value={reviews.length.toString()}
subtitle="Reviews Given"
          icon={Star}
        />

      </section>





      <section>

  <div className="mb-6">

    <h2 className="text-2xl font-bold text-[#3f1d2f]">
      Quick Actions
    </h2>

    <p className="mt-1 text-[#8d6171]">
      Plan faster with the next steps couples use most.
    </p>

  </div>

  <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

    <QuickActionCard
      title="Browse Vendors"
      description="Explore trusted wedding vendors."
      href="/vendors"
      icon={Search}
    />

    <QuickActionCard
      title="My Bookings"
      description="Track all your bookings."
      href="/customer/bookings"
      icon={CalendarDays}
    />

    <QuickActionCard
      title="Wishlist"
      description="View your saved vendors."
      href="/customer/wishlist"
      icon={Heart}
    />

    <QuickActionCard
      title="Planner"
      description="Organize tasks, timeline and priorities."
      href="/customer/planner"
      icon={Sparkles}
    />

  </div>

</section>



{/* <section className="grid gap-6 lg:grid-cols-3">

  <div className="lg:col-span-2">

    <RecentActivity />

  </div>

  <WeddingCountdown />

</section> */}



  
<InsightsSection />


<section className="grid gap-6 xl:grid-cols-2">
  <UpcomingBookings />

  {/* Budget Overview will go here next */}
 <BudgetOverview />
</section>

    </div>

    </ProtectedRoute>
  );

}
