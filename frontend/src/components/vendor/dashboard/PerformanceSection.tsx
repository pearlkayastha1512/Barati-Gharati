"use client";

import { useMemo,useEffect } from "react";

import { useBookingStore } from "@/store/bookingStore";
import { useVendorProfile } from "@/hooks/useVendorProfile";
import { useReviewStore } from "@/store/reviewStore";

export default function PerformanceSection() {
  const bookings = useBookingStore(
    (state) => state.bookings
  );
  const { vendor } = useVendorProfile();

const reviews = useReviewStore((state) => state.reviews);

const loadVendorReviews = useReviewStore(
  (state) => state.loadVendorReviews
);

useEffect(() => {
  if (!vendor) return;

  void loadVendorReviews(vendor.id);
}, [vendor, loadVendorReviews]);

  const metrics = useMemo(() => {
    const totalBookings =
      bookings.length;

    const pendingBookings =
      bookings.filter(
        (booking) =>
          booking.bookingStatus ===
          "pending"
      ).length;

    const acceptedBookings =
      bookings.filter(
        (booking) =>
          booking.bookingStatus ===
            "accepted" ||
          booking.bookingStatus ===
            "completed"
      ).length;

    const conversionRate =
      totalBookings === 0
        ? 0
        : Math.round(
            (acceptedBookings /
              totalBookings) *
              100
          );
    const reviewCount = reviews.length;

const averageRating =
  reviewCount === 0
    ? "0"
    : (
        reviews.reduce(
          (sum, review) => sum + review.rating,
          0
        ) / reviewCount
      ).toFixed(1);

    return [
      {
        title: "Total Bookings",
        value:
          totalBookings.toString(),
      },
      {
        title: "Pending Requests",
        value:
          pendingBookings.toString(),
      },
      {
        title: "Conversion Rate",
        value: `${conversionRate}%`,
      },
      {
  title: "Customer Satisfaction",
  value: `${averageRating} ★`,
},
    ];
  }, [bookings,reviews]);

  return (
    <section className="rounded-3xl border border-[#f4c8a0] bg-white/90 p-7 shadow-sm shadow-[#e4005a]/5">

      <h2 className="text-2xl font-bold text-[#4d1730]">
        Business Performance
      </h2>

      <p className="mt-2 text-[#946176]">
        Live insights based on your
        bookings.
      </p>

      <div className="mt-8 grid gap-5 md:grid-cols-2">

        {metrics.map((metric) => (
          <div
            key={metric.title}
            className="rounded-2xl border border-[#ffe0a3] bg-[#fff8ef] p-5 transition hover:bg-[#fff1cf]"
          >
            <p className="text-sm text-[#946176]">
              {metric.title}
            </p>

            <p className="mt-2 text-3xl font-bold text-[#4d1730]">
              {metric.value}
            </p>
          </div>
        ))}

      </div>

    </section>
  );
}
