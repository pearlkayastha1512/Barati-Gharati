"use client";

import {
  CreditCard,
  CheckCircle2,
  IndianRupee,
  Receipt,
  Clock3,
} from "lucide-react";

import { Booking } from "@/types/booking";

interface PaymentInformationProps {
  booking: Booking;
}

function getPaymentBadge(status: string) {
  switch (status) {
    case "paid":
      return {
        title: "Payment Completed",
        description: "Full payment has been received.",
        color: "green",
      };

    case "partial":
      return {
        title: "Advance Payment Received",
        description: "Remaining amount is pending.",
        color: "orange",
      };

    default:
      return {
        title: "Payment Pending",
        description: "No payment has been received yet.",
        color: "red",
      };
  }
}

export default function PaymentInformation({
  booking,
}: PaymentInformationProps) {
  const badge = getPaymentBadge(
    booking.paymentStatus
  );

  return (
    <section className="rounded-3xl border border-gray-200 bg-white p-7 shadow-sm">

      <div className="mb-6">

        <h2 className="text-2xl font-bold text-gray-900">
          Payment Details
        </h2>

        <p className="mt-1 text-gray-500">
          Booking payment summary.
        </p>

      </div>

      <div className="space-y-5">

        <div className="flex items-center justify-between">

          <div className="flex items-center gap-3">

            <IndianRupee
              size={20}
              className="text-indigo-600"
            />

            <span className="text-gray-600">
              Total Amount
            </span>

          </div>

          <span className="font-semibold text-gray-900">
            ₹{booking.amount.toLocaleString("en-IN")}
          </span>

        </div>

        <div className="flex items-center justify-between">

          <div className="flex items-center gap-3">

            <CreditCard
              size={20}
              className="text-green-600"
            />

            <span className="text-gray-600">
              Advance Paid
            </span>

          </div>

          <span className="font-semibold text-green-600">
            ₹{booking.advancePaid.toLocaleString(
              "en-IN"
            )}
          </span>

        </div>

        <div className="flex items-center justify-between">

          <div className="flex items-center gap-3">

            <Receipt
              size={20}
              className="text-orange-500"
            />

            <span className="text-gray-600">
              Remaining
            </span>

          </div>

          <span className="font-semibold text-orange-600">
            ₹{booking.remainingAmount.toLocaleString(
              "en-IN"
            )}
          </span>

        </div>

        <div className="flex items-center justify-between">

          <div className="flex items-center gap-3">

            <Clock3
              size={20}
              className="text-indigo-500"
            />

            <span className="text-gray-600">
              Payment Status
            </span>

          </div>

          <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold capitalize text-slate-700">
            {booking.paymentStatus}
          </span>

        </div>

      </div>

      <div
        className={`mt-8 rounded-2xl p-4 ${
          badge.color === "green"
            ? "bg-green-50"
            : badge.color === "orange"
            ? "bg-orange-50"
            : "bg-red-50"
        }`}
      >

        <div className="flex items-center gap-3">

          <CheckCircle2
            size={22}
            className={
              badge.color === "green"
                ? "text-green-600"
                : badge.color === "orange"
                ? "text-orange-600"
                : "text-red-600"
            }
          />

          <div>

            <h4
              className={`font-semibold ${
                badge.color === "green"
                  ? "text-green-700"
                  : badge.color === "orange"
                  ? "text-orange-700"
                  : "text-red-700"
              }`}
            >
              {badge.title}
            </h4>

            <p
              className={`text-sm ${
                badge.color === "green"
                  ? "text-green-600"
                  : badge.color === "orange"
                  ? "text-orange-600"
                  : "text-red-600"
              }`}
            >
              {badge.description}
            </p>

          </div>

        </div>

      </div>

    </section>
  );
}