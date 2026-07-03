"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import BookingHero from "@/components/vendor/bookings/BookingHero";
import BookingStats from "@/components/vendor/bookings/BookingStats";
import BookingFilters from "@/components/vendor/bookings/BookingFilters";
import BookingTable from "@/components/vendor/bookings/BookingTable";
import BookingDetailsCard from "@/components/vendor/bookings/BookingDetailsCard";

import { useAuthStore } from "@/store/authStore";
import { useBookingStore } from "@/store/bookingStore";

import { getVendorByUserId } from "@/services/vendor.service";

export default function VendorBookingsPage() {
  const { user } =
    useAuthStore();

  const {
    bookings,
    loadVendorBookings,
  } = useBookingStore();

  const [search, setSearch] =
    useState("");

  const [status, setStatus] =
    useState("All");

  useEffect(() => {
    if (!user) return;

    const vendor =
      getVendorByUserId(
        user._id
      );

    if (!vendor) return;

    loadVendorBookings(
      vendor.id
    );
  }, [
    user,
    loadVendorBookings,
  ]);

  const filteredBookings =
    useMemo(() => {
      return bookings.filter(
        (booking) => {
          const searchMatch =
            booking.customerName
              .toLowerCase()
              .includes(
                search.toLowerCase()
              ) ||
            booking.eventType
              .toLowerCase()
              .includes(
                search.toLowerCase()
              ) ||
            booking.category
              .toLowerCase()
              .includes(
                search.toLowerCase()
              );

          const statusMatch =
            status === "All"
              ? true
              : booking.bookingStatus ===
                status.toLowerCase();

          return (
            searchMatch &&
            statusMatch
          );
        }
      );
    }, [
      bookings,
      search,
      status,
    ]);

  return (
    <div className="space-y-8">

      <BookingHero />

      <BookingStats />

      <BookingFilters
        search={search}
        setSearch={setSearch}
        status={status}
        setStatus={setStatus}
      />

      <BookingTable
        bookings={
          filteredBookings
        }
      />

      <BookingDetailsCard />

    </div>
  );
}