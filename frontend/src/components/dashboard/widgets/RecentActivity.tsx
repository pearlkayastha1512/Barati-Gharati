"use client";

import { useMemo } from "react";
import {
  CalendarDays,
  Heart,
  Star,
} from "lucide-react";

import { useBookingStore } from "@/store/bookingStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { useReviewStore } from "@/store/reviewStore";

export default function RecentActivity() {
  const bookings = useBookingStore(
    (state) => state.bookings
  );

  const wishlist = useWishlistStore(
    (state) => state.wishlist
  );

  const reviews = useReviewStore(
    (state) => state.reviews
  );

  const activities = useMemo(() => {
    const bookingActivities = bookings.map((booking) => ({
      id: booking.id,
      title: `Booked ${booking.vendorName}`,
      time: new Date(
        booking.createdAt
      ).toLocaleDateString("en-GB"),
      icon: CalendarDays,
      createdAt: booking.createdAt,
    }));

   const wishlistActivities = wishlist.map((item) => ({
  id: item.vendorId,

  title: `Added ${item.vendorName} to Wishlist`,

  time: new Date(
    item.addedAt
  ).toLocaleDateString("en-GB"),

  icon: Heart,

  createdAt: item.addedAt,
}));

    const reviewActivities = reviews.map((review) => ({
      id: review.id,
      title: `Reviewed ${review.vendorName}`,
      time: new Date(
        review.createdAt
      ).toLocaleDateString("en-GB"),
      icon: Star,
      createdAt: review.createdAt,
    }));

    return [
      ...bookingActivities,
      ...wishlistActivities,
      ...reviewActivities,
    ]
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() -
          new Date(a.createdAt).getTime()
      )
      .slice(0, 6);
  }, [bookings, wishlist, reviews]);

  return (
    <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
      <h2 className="text-3xl font-bold text-gray-900">
        Recent Activity
      </h2>

      <p className="mt-2 text-gray-500">
        Your latest wedding planning updates.
      </p>

      <div className="mt-8 space-y-5">
        {activities.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-200 p-10 text-center text-gray-500">
            No recent activity.
          </div>
        ) : (
          activities.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={`${item.title}-${item.id}`}
                className="
                  flex
                  items-center
                  gap-5
                  rounded-2xl
                  border
                  border-gray-100
                  p-5
                  transition
                  hover:border-rose-200
                  hover:bg-rose-50
                "
              >
                <div className="rounded-2xl bg-rose-50 p-4">
                  <Icon
                    size={24}
                    className="text-rose-500"
                  />
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900">
                    {item.title}
                  </h3>

                  <p className="text-gray-500">
                    {item.time}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}