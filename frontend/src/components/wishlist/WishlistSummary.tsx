"use client";

import { useMemo } from "react";

import { motion } from "framer-motion";

import {
  Heart,
  Eye,
  CalendarDays,
  Star,
} from "lucide-react";

import { useWishlistStore } from "@/store/wishlistStore";
import { useBookingStore } from "@/store/bookingStore";

export default function WishlistSummary() {
  const wishlist = useWishlistStore(
    (state) => state.wishlist
  );

  const bookings = useBookingStore(
    (state) => state.bookings
  );

  const stats = useMemo(() => {
    const bookedVendorIds = new Set(
      bookings.map((booking) => booking.vendorId)
    );

    const readyToBook = wishlist.filter(
      (item) => !bookedVendorIds.has(item.vendorId)
    ).length;

    const favorites = wishlist.filter(
      (item) => item.rating >= 4.5
    ).length;

    return [
      {
        title: "Saved Vendors",
        value: wishlist.length.toString(),
        subtitle: "Currently saved",
        icon: Heart,
        color: "bg-rose-100 text-rose-600",
      },
      // {
      //   title: "Viewed",
      //   value: "-",
      //   subtitle: "Coming Soon",
      //   icon: Eye,
      //   color: "bg-blue-100 text-blue-600",
      // },
      {
        title: "Ready to Book",
        value: readyToBook.toString(),
        subtitle: "Not booked yet",
        icon: CalendarDays,
        color: "bg-green-100 text-green-600",
      },
      {
        title: "Favorites",
        value: favorites.toString(),
        subtitle: "Rated 4.5★ & above",
        icon: Star,
        color: "bg-yellow-100 text-yellow-600",
      },
    ];
  }, [wishlist, bookings]);

  return (
    <section className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((item, index) => {
        const Icon = item.icon;

        return (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: index * 0.08,
            }}
            className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
          >
            <div className="flex justify-between">
              <div className={`rounded-2xl p-3 ${item.color}`}>
                <Icon size={24} />
              </div>
            </div>

            <h3 className="mt-6 text-sm text-gray-500">
              {item.title}
            </h3>

            <p className="mt-2 text-4xl font-bold text-gray-900">
              {item.value}
            </p>

            <p className="mt-2 text-sm text-gray-500">
              {item.subtitle}
            </p>
          </motion.div>
        );
      })}
    </section>
  );
}