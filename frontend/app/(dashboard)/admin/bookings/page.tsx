"use client";

import { useMemo, useState } from "react";

import BookingHero from "@/components/admin/bookings/BookingHero";
import BookingStats from "@/components/admin/bookings/BookingStats";
import BookingFilters from "@/components/admin/bookings/BookingFilters";
import BookingTable from "@/components/admin/bookings/BookingTable";
import BookingDetailsModal from "@/components/admin/bookings/BookingDetailsModal";

import { getAllBookings } from "@/services/booking.service";
import { Booking } from "@/types/booking";

export default function BookingManagementPage() {
  const bookings = useMemo(
    () => getAllBookings(),
    []
  );

  const [search, setSearch] = useState("");

  const [bookingStatus, setBookingStatus] =
    useState("all");

  const [paymentStatus, setPaymentStatus] =
    useState("all");

  const [selectedBooking, setSelectedBooking] =
    useState<Booking | null>(null);

  const [isModalOpen, setIsModalOpen] =
    useState(false);

  const filteredBookings = useMemo(() => {
    return bookings.filter((booking) => {
      const matchesSearch =
        booking.bookingNumber
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        booking.customerName
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        booking.vendorName
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchesBookingStatus =
        bookingStatus === "all" ||
        booking.bookingStatus ===
          bookingStatus;

      const matchesPaymentStatus =
        paymentStatus === "all" ||
        booking.paymentStatus ===
          paymentStatus;

      return (
        matchesSearch &&
        matchesBookingStatus &&
        matchesPaymentStatus
      );
    });
  }, [
    bookings,
    search,
    bookingStatus,
    paymentStatus,
  ]);

  const handleViewBooking = (
    booking: Booking
  ) => {
    setSelectedBooking(booking);

    setIsModalOpen(true);
  };

  return (
    <div className="space-y-8">
      <BookingHero />

      <BookingStats />

      <BookingFilters
        search={search}
        setSearch={setSearch}
        bookingStatus={bookingStatus}
        setBookingStatus={
          setBookingStatus
        }
        paymentStatus={paymentStatus}
        setPaymentStatus={
          setPaymentStatus
        }
      />

      <BookingTable
        bookings={filteredBookings}
        onView={handleViewBooking}
      />

      <BookingDetailsModal
        booking={selectedBooking}
        open={isModalOpen}
        onClose={() => {
          setSelectedBooking(null);

          setIsModalOpen(false);
        }}
      />
    </div>
  );
}