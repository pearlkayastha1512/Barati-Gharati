"use client";

import { useEffect } from "react";
import {
  useParams,
  notFound,
} from "next/navigation";

import BookingDetailsHero from "@/components/bookings/details/BookingDetailsHero";
import VendorInformation from "@/components/bookings/details/VendorInformation";
import BookingTimeline from "@/components/bookings/details/BookingTimeline";
import PaymentInformation from "@/components/bookings/details/PaymentInformation";
import BookingActions from "@/components/bookings/details/BookingActions";

import AlternativeVendorsCard from "@/components/bookings/details/AlternativeVendorsCard";
import { useBookingStore } from "@/store/bookingStore";


export default function BookingDetailsPage() {
  const params = useParams();

  const {
    selectedBooking,
    loadBooking,
  } = useBookingStore();

  useEffect(() => {
    loadBooking(
      params.bookingId as string
    );
  }, [params.bookingId]);

  if (selectedBooking === null) {
    return null;
  }

  if (!selectedBooking) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <BookingDetailsHero
        booking={selectedBooking}
      />

      <AlternativeVendorsCard booking={selectedBooking} />

      <section className="grid gap-6 xl:grid-cols-3">
        <div className="space-y-6 xl:col-span-2">
          <VendorInformation
            booking={selectedBooking}
          />

          <BookingTimeline
            booking={selectedBooking}
          />
        </div>


        <div className="space-y-6">
          <PaymentInformation
            booking={selectedBooking}
          />

          <BookingActions
            booking={selectedBooking}
          />
        </div>
      </section>
    </div>
  );
}