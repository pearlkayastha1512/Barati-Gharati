"use client";

import { useEffect, useMemo } from "react";

import {
  BriefcaseBusiness,
  CalendarCheck2,
  CheckCircle2,
  IndianRupee,
  MapPin,
  Star,
} from "lucide-react";

import { useAuthStore } from "@/store/authStore";
import { useBookingStore } from "@/store/bookingStore";
import { useReviewStore } from "@/store/reviewStore";
import { useServiceStore } from "@/store/serviceStore";

import { getVendorByUserId } from "@/services/vendor.service";

export default function BusinessDetails() {
  const { user } = useAuthStore();

  const vendor = user
    ? getVendorByUserId(user._id)
    : null;

  const bookings = useBookingStore(
    (state) => state.bookings
  );

  const services = useServiceStore(
    (state) => state.services
  );

  const reviews = useReviewStore(
    (state) => state.reviews
  );

  const loadVendorBookings =
    useBookingStore(
      (state) =>
        state.loadVendorBookings
    );

  const loadVendorServices =
    useServiceStore(
      (state) =>
        state.loadVendorServices
    );

  const loadVendorReviews =
    useReviewStore(
      (state) =>
        state.loadVendorReviews
    );

  useEffect(() => {
    if (!vendor) return;

    loadVendorBookings(vendor.id);

    loadVendorServices(vendor.id);

    loadVendorReviews(vendor.id);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vendor?.id]);

  const stats = useMemo(() => {
    const completed =
      bookings.filter(
        (booking) =>
          booking.bookingStatus ===
          "completed"
      ).length;

    const revenue =
      bookings.reduce(
        (sum, booking) =>
          sum + booking.advancePaid,
        0
      );

    const rating =
      reviews.length === 0
        ? 0
        : (
            reviews.reduce(
              (sum, review) =>
                sum + review.rating,
              0
            ) / reviews.length
          ).toFixed(1);

    return {
      services: services.length,

      bookings: bookings.length,

      completed,

      revenue,

      rating,
    };
  }, [
    bookings,
    services,
    reviews,
  ]);

  if (!vendor) {
    return null;
  }

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">

      <h2 className="text-2xl font-bold text-slate-900">
        Business Details
      </h2>

      <div className="mt-8 space-y-6">

        <Row
          icon={
            <BriefcaseBusiness
              size={18}
              className="text-blue-600"
            />
          }
          label="Category"
          value={vendor.category}
        />

        <Row
          icon={
            <MapPin
              size={18}
              className="text-red-500"
            />
          }
          label="City"
          value={vendor.city}
        />

        <Row
          icon={
            <BriefcaseBusiness
              size={18}
              className="text-violet-600"
            />
          }
          label="Services"
          value={stats.services}
        />

        <Row
          icon={
            <CalendarCheck2
              size={18}
              className="text-green-600"
            />
          }
          label="Bookings"
          value={stats.bookings}
        />

        <Row
          icon={
            <CheckCircle2
              size={18}
              className="text-emerald-600"
            />
          }
          label="Completed"
          value={stats.completed}
        />

        <Row
          icon={
            <IndianRupee
              size={18}
              className="text-orange-600"
            />
          }
          label="Revenue"
          value={`₹${stats.revenue.toLocaleString(
            "en-IN"
          )}`}
        />

        <Row
          icon={
            <Star
              size={18}
              className="text-yellow-500"
            />
          }
          label="Average Rating"
          value={
            stats.rating === 0
              ? "-"
              : `${stats.rating} ★`
          }
        />

      </div>

    </section>
  );
}

function Row({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;

  label: string;

  value: string | number;
}) {
  return (
    <div className="flex items-center justify-between border-b border-slate-100 pb-4">

      <div className="flex items-center gap-3">

        {icon}

        <span className="text-slate-600">
          {label}
        </span>

      </div>

      <span className="font-semibold text-slate-900">
        {value}
      </span>

    </div>
  );
}