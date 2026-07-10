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
    <div className="rounded-3xl border border-[#ffb3bf] bg-white/90 p-8 shadow-sm shadow-[#ff4d6d]/5">
      <h2 className="text-3xl font-bold text-[#3f1d2f]">
        Planning Journal
      </h2>

      <p className="mt-2 text-[#8d6171]">
        A quick trail of vendors saved, bookings made and reviews shared.
      </p>

      <div className="mt-8 space-y-5">
        {activities.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#ffe98a] bg-[#fff5f7] p-10 text-center text-[#8d6171]">
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
                  border-[#ffcad3]
                  bg-[#fff5f7]
                  p-5
                  transition
                  hover:border-[#ff8fa1]
                  hover:bg-[#ffe6eb]
                "
              >
                <div className="rounded-2xl bg-[#ffe6eb] p-4">
                  <Icon
                    size={24}
                    className="text-[#ff4d6d]"
                  />
                </div>

                <div>
                  <h3 className="font-semibold text-[#3f1d2f]">
                    {item.title}
                  </h3>

                  <p className="text-[#8d6171]">
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
