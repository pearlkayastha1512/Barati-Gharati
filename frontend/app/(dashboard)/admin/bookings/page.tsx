"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import BookingHero from "@/components/admin/bookings/BookingHero";
import BookingStats from "@/components/admin/bookings/BookingStats";
import BookingFilters from "@/components/admin/bookings/BookingFilters";
import BookingTable from "@/components/admin/bookings/BookingTable";
import BookingDetailsModal from "@/components/admin/bookings/BookingDetailsModal";

import { Booking } from "@/types/booking";
import {
  approveBookingApi,
  approveBookingPaymentApi,
  getAllBookingsApi,
  holdBookingPaymentApi,
} from "@/services/api/admin.api";
import { toast } from "sonner";

type ApiBookingsResponse = {
  data?: Booking[];
};

export default function BookingManagementPage() {
  const [bookings, setBookings] =
    useState<Booking[]>([]);

  const loadBookings = useCallback(async () => {
    const result =
      await getAllBookingsApi();

    if (!result.ok) {
      setBookings([]);
      return;
    }

    setBookings(
      (result.data as ApiBookingsResponse)
        ?.data ?? []
    );
  }, []);

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    void loadBookings();
  }, [loadBookings]);
  /* eslint-enable react-hooks/set-state-in-effect */

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

  const handleApproveBooking = async (
    booking: Booking
  ) => {
    const result =
      await approveBookingApi(booking.id);

    if (!result.ok) {
      toast.error(
        result.error ??
          "Unable to approve booking."
      );
      return;
    }

    toast.success(
      "Booking approved. Chat is now unlocked."
    );
    await loadBookings();
  };

  const handleApprovePayment = async (
    booking: Booking
  ) => {
    const result =
      await approveBookingPaymentApi(
        booking.id
      );

    if (!result.ok) {
      toast.error(
        result.error ??
          "Unable to approve payment."
      );
      return;
    }

    toast.success(
      "Payment approved. Customer can pay the remaining balance."
    );
    await loadBookings();
  };

  const handleHoldPayment = async (
    booking: Booking
  ) => {
    const result =
      await holdBookingPaymentApi(
        booking.id
      );

    if (!result.ok) {
      toast.error(
        result.error ??
          "Unable to hold payment."
      );
      return;
    }

    toast.success("Payment held.");
    await loadBookings();
  };

  return (
    <div className="space-y-8">
      <BookingHero />

      <BookingStats bookings={bookings} />

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
        onApprove={handleApproveBooking}
        onApprovePayment={
          handleApprovePayment
        }
        onHoldPayment={handleHoldPayment}
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
