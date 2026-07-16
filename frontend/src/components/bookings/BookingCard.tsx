

"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

import {
  CalendarDays,
  Clock3,
  MapPin,
  IndianRupee,
  Eye,
  Star,
  CreditCard,
} from "lucide-react";

import PayAdvanceModal from "./PayAdvanceModal";
import { isSupportedImageSrc } from "@/lib/image-url";

import {
  Booking,
  BookingStatus,
} from "@/types/booking";

interface BookingCardProps {
  booking: Booking;
}

export default function BookingCard({
  booking,
}: BookingCardProps) {
  const [openPayment, setOpenPayment] =
    useState(false);

  const statusColor: Record<
    BookingStatus,
    string
  > = {
    pending:
      "bg-[#fff3b0] text-[#111111]",

    advance_paid:
      "bg-blue-100 text-blue-700",

    accepted:
      "bg-[#fff8d8] text-[#111111]",

    event_completed:
      "bg-indigo-100 text-indigo-700",

    awaiting_admin_review:
      "bg-purple-100 text-purple-700",

    payment_approved:
      "bg-emerald-100 text-emerald-700",

    payment_held:
      "bg-red-100 text-red-700",

    completed:
      "bg-[#ffe6eb] text-[#ff4d6d]",

    cancelled:
      "bg-[#ffe6eb] text-[#e63b5f]",

    rejected:
      "bg-[#ffe6eb] text-[#e63b5f]",
  };

  return (
    <>
      <div
        className="
          rounded-3xl
          border
          border-[#ffb3bf]
          bg-[#fffdf0]
          p-6
          shadow-sm
          transition-all
          duration-300
          hover:-translate-y-1
          hover:shadow-xl
        "
      >
        <div className="flex flex-col gap-6 lg:flex-row">
          {/* Vendor Image */}

          <div className="relative h-52 w-full overflow-hidden rounded-3xl lg:h-44 lg:w-72">
            {isSupportedImageSrc(booking.vendorImage) ? (
              <Image
                src={booking.vendorImage}
                alt={`${booking.vendorName} profile`}
                fill
                sizes="(min-width: 1024px) 288px, 100vw"
                className="object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center bg-gradient-to-br from-[#ffe6eb] to-[#fff8d8] text-6xl font-bold text-[#e63b5f]">
                {booking.vendorName.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          {/* Details */}

          <div className="flex flex-1 flex-col justify-between">
            <div>
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-[#3f1d2f]">
                    {booking.vendorName}
                  </h2>

                  <p className="mt-1 text-[#8d6171]">
                    {booking.category} · {booking.eventType}
                  </p>
                </div>

                <span
                  className={`rounded-full px-4 py-2 text-sm font-semibold capitalize ${statusColor[booking.bookingStatus]}`}
                >
                  {booking.bookingStatus}
                </span>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <div className="flex items-center gap-3">
                  <CalendarDays
                    size={18}
                    className="text-[#ff4d6d]"
                  />

                  <span className="text-[#6c2d45]">
                    {booking.eventDate}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <Clock3
                    size={18}
                    className="text-[#ff4d6d]"
                  />

                  <span className="text-[#6c2d45]">
                    {booking.eventTime || "--"}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <MapPin
                    size={18}
                    className="text-[#ff4d6d]"
                  />

                  <span className="text-[#6c2d45]">
                    {booking.city || "--"}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <IndianRupee
                    size={18}
                    className="text-[#ff4d6d]"
                  />

                  <span className="text-[#6c2d45]">
                    ₹{booking.amount.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              {/* Payment Section */}

              <div className="mt-6 rounded-2xl border border-[#ffb3bf] bg-[#fff8d8] p-5">
                <div className="grid gap-4 sm:grid-cols-3">
                  <div>
                    <p className="text-xs text-[#8d6171]">
                      Total Amount
                    </p>

                    <p className="mt-1 font-semibold text-[#3f1d2f]">
                      ₹{booking.amount.toLocaleString("en-IN")}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-[#8d6171]">
                      Advance Paid
                    </p>

                    <p className="mt-1 font-semibold text-[#111111]">
                      ₹
                      {booking.advancePaid.toLocaleString(
                        "en-IN"
                      )}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-[#8d6171]">
                      Remaining
                    </p>

                    <p className="mt-1 font-semibold text-[#e63b5f]">
                      ₹
                      {booking.remainingAmount.toLocaleString(
                        "en-IN"
                      )}
                    </p>
                  </div>
                </div>



                {/* <button
                  disabled={
                    booking.paymentStatus ===
                    "paid"
                  }
                  onClick={() =>
                    setOpenPayment(true)
                  }
                  className={`
                    mt-5
                    flex
                    w-full
                    items-center
                    justify-center
                    gap-2
                    rounded-2xl
                    py-3
                    font-semibold
                    transition

                    ${
                      booking.paymentStatus ===
                      "paid"
                        ? "cursor-not-allowed bg-[#fff8d8] text-[#111111]"
                        : "bg-[#ff4d6d] text-white hover:bg-[#e63b5f]"
                    }
                  `}
                >
                  <CreditCard size={18} />

                  {booking.paymentStatus ===
                  "paid"
                    ? "Payment Completed"
                    : "Pay Advance"}
                </button> */}




<button
  disabled={
    booking.paymentStatus === "paid" ||
    booking.paymentStatus === "partial" ||
    booking.bookingStatus === "cancelled"
  }
  onClick={() => setOpenPayment(true)}
  className={`
    mt-5
    flex
    w-full
    items-center
    justify-center
    gap-2
    rounded-2xl
    py-3
    font-semibold
    transition

    ${
      booking.paymentStatus === "paid" ||
      booking.paymentStatus === "partial" ||
      booking.bookingStatus === "cancelled"
        ? "cursor-not-allowed bg-[#ffe6eb] text-[#8d6171]"
        : "bg-[#ff4d6d] text-white hover:bg-[#e63b5f]"
    }
  `}
>
  <CreditCard size={18} />

  {booking.bookingStatus === "cancelled"
    ? "Booking Cancelled"
    : booking.paymentStatus === "paid"
    ? "Payment Completed"
    : booking.paymentStatus === "partial"
    ? booking.adminApproved
      ? "Advance Paid"
      : "Awaiting Admin Approval"
    : "Pay Advance"}
</button>








              </div>
            </div>

            {/* Bottom Actions */}

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href={`/customer/bookings/${booking.id}`}
                className="flex items-center gap-2 rounded-2xl bg-[#ff4d6d] px-5 py-3 font-semibold text-white transition hover:bg-[#e63b5f]"
              >
                <Eye size={18} />

                View Details
              </Link>

              

              {booking.bookingStatus ===
                "completed" && (
                <button
                  className="
                    flex
                    items-center
                    gap-2
                    rounded-2xl
                    bg-[#ff4d6d]
                    px-5
                    py-3
                    font-semibold
                    text-white
                    transition
                    hover:bg-[#e63b5f]
                  "
                >
                  <Star size={18} />

                  Leave Review
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <PayAdvanceModal
        booking={booking}
        open={openPayment}
        onClose={() =>
          setOpenPayment(false)
        }
      />
    </>
  );
}
