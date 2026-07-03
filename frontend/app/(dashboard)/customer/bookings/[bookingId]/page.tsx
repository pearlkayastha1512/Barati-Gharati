"use client";

import { useMemo } from "react";
import {
  useParams,
  notFound,
} from "next/navigation";

import BookingDetailsHero from "@/components/bookings/details/BookingDetailsHero";
import VendorInformation from "@/components/bookings/details/VendorInformation";
import BookingTimeline from "@/components/bookings/details/BookingTimeline";
import PaymentInformation from "@/components/bookings/details/PaymentInformation";
import BookingActions from "@/components/bookings/details/BookingActions";

import { getBookingById } from "@/services/booking.service";

export default function BookingDetailsPage() {
  const params = useParams();

 const booking = useMemo(() => {
  return getBookingById(
    params.bookingId as string
  );
}, [params.bookingId]);

  if (!booking) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <BookingDetailsHero booking={booking} />

      <section className="grid gap-6 xl:grid-cols-3">
        <div className="space-y-6 xl:col-span-2">
         <VendorInformation booking={booking} />
<BookingTimeline booking={booking} />
        </div>

        <div className="space-y-6">
         <PaymentInformation booking={booking} />

          <BookingActions booking={booking} />
        </div>
      </section>
    </div>
  );
}