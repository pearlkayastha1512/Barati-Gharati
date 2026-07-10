"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import PaymentHero from "@/components/admin/payments/PaymentHero";
import PaymentStats from "@/components/admin/payments/PaymentStats";
import PaymentFilters from "@/components/admin/payments/PaymentFilters";
import PaymentTable from "@/components/admin/payments/PaymentTable";
import PaymentDetailsModal from "@/components/admin/payments/PaymentDetailsModal";

import { Booking } from "@/types/booking";
import {
  approveBookingApi,
  getAllBookingsApi,
} from "@/services/api/admin.api";
import { toast } from "sonner";

type ApiBookingsResponse = {
  data?: Booking[];
};

export default function PaymentsManagementPage() {
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

      const matchesPayment =
        paymentStatus === "all" ||
        booking.paymentStatus === paymentStatus;

      return (
        matchesSearch &&
        matchesPayment
      );
    });
  }, [
    bookings,
    search,
    paymentStatus,
  ]);

  const handleViewPayment = (
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
      "Booking approved. Vendor can now confirm and chat is unlocked."
    );

    await loadBookings();

    setSelectedBooking((current) =>
      current?.id === booking.id
        ? {
            ...current,
            adminApproved: true,
            bookingStatus: "accepted",
          }
        : current
    );
  };

  return (
    <div className="space-y-8">
      <PaymentHero />

      <PaymentStats bookings={bookings} />

      <PaymentFilters
        search={search}
        setSearch={setSearch}
        paymentStatus={paymentStatus}
        setPaymentStatus={setPaymentStatus}
      />

      <PaymentTable
        bookings={filteredBookings}
        onView={handleViewPayment}
        onApprove={handleApproveBooking}
      />

      <PaymentDetailsModal
        booking={selectedBooking}
        open={isModalOpen}
        onClose={() => {
          setSelectedBooking(null);

          setIsModalOpen(false);
        }}
        onApprove={handleApproveBooking}
      />
    </div>
  );
}
