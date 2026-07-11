"use client";

import { useState } from "react";

import {
  CalendarClock,
  CreditCard,
  FileText,
  AlertTriangle,
  Loader2,
} from "lucide-react";

import { Booking } from "@/types/booking";

import { useBookingStore } from "@/store/bookingStore";
import { toast } from "sonner";
import {
  createRemainingPaymentOrderApi,
  verifyRemainingPaymentApi,
} from "@/services/api/payment.api";
import { downloadInvoiceApi } from "@/services/api/invoice.api";

type RazorpayResponse = {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
};

type RazorpayOptions = {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: RazorpayResponse) => void;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  theme?: {
    color?: string;
  };
  modal?: {
    ondismiss?: () => void;
  };
};

declare global {
  interface Window {
    Razorpay?: new (
      options: RazorpayOptions
    ) => {
      open: () => void;
    };
  }
}

function loadRazorpayScript() {
  return new Promise<boolean>((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script =
      document.createElement("script");
    script.src =
      "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);

    document.body.appendChild(script);
  });
}

interface BookingActionsProps {
  booking: Booking;
}

export default function BookingActions({
  booking,
}: BookingActionsProps) {
  const [payingRemaining, setPayingRemaining] =
    useState(false);
  const [downloadingInvoice, setDownloadingInvoice] =
    useState(false);

  const {
    bookings,
    updateStatus,
    loadBooking,
  } = useBookingStore();

  const currentBooking =
    bookings.find(
      (item) => item.id === booking.id
    ) ?? booking;

  const canCancel =
    currentBooking.bookingStatus ===
    "pending";

  const canPayRemaining =
    currentBooking.bookingStatus ===
      "payment_approved" &&
    currentBooking.remainingAmount > 0;

  const handleCancelBooking = () => {
    if (!canCancel) {
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to cancel this booking?"
    );

    if (!confirmed) return;

    updateStatus(
      currentBooking.id,
      "cancelled"
    );

    toast.success(
      "Booking cancelled successfully."
    );
  };

  const handleRemainingPayment = async () => {
    if (!canPayRemaining) {
      return;
    }

    setPayingRemaining(true);

    const orderResult =
      await createRemainingPaymentOrderApi(
        currentBooking.id
      );

    if (!orderResult.ok || !orderResult.data) {
      setPayingRemaining(false);
      toast.error(
        orderResult.error ??
          "Unable to prepare payment."
      );
      return;
    }

    const scriptLoaded =
      await loadRazorpayScript();

    if (!scriptLoaded || !window.Razorpay) {
      setPayingRemaining(false);
      toast.error(
        "Payment gateway could not be loaded."
      );
      return;
    }

    const order = orderResult.data;
    const razorpay = new window.Razorpay({
      key: order.keyId,
      amount: order.amountInPaise,
      currency: order.currency,
      name: "Barati Gharati",
      description: `Remaining payment for ${currentBooking.vendorName}`,
      order_id: order.orderId,
      prefill: {
        name: currentBooking.customerName,
        email: currentBooking.customerEmail,
        contact: currentBooking.customerPhone,
      },
      theme: {
        color: "#e4005a",
      },
      modal: {
        ondismiss: () =>
          setPayingRemaining(false),
      },
      handler: async (response) => {
        const verified =
          await verifyRemainingPaymentApi({
            bookingId: currentBooking.id,
            orderId:
              response.razorpay_order_id,
            paymentId:
              response.razorpay_payment_id,
            signature:
              response.razorpay_signature,
          });

        setPayingRemaining(false);

        if (!verified.ok) {
          toast.error(
            verified.error ??
              "Payment verification failed."
          );
          return;
        }

        toast.success(
          "Remaining payment completed."
        );
        await loadBooking(currentBooking.id);
      },
    });

    razorpay.open();
  };

  const handleDownloadInvoice = async () => {
    setDownloadingInvoice(true);

    const result = await downloadInvoiceApi(
      currentBooking.id
    );

    setDownloadingInvoice(false);

    if (!result.ok || !result.data) {
      toast.error(
        result.error ??
          "Unable to download invoice."
      );
      return;
    }

    const url = URL.createObjectURL(result.data);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${currentBooking.bookingNumber}.pdf`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <section className="rounded-3xl border border-gray-200 bg-white p-7 shadow-sm">

      <h2 className="text-2xl font-bold text-gray-900">
        Booking Actions
      </h2>

      <p className="mt-1 text-gray-500">
        Manage your booking quickly.
      </p>

        <div className="mt-8 space-y-4">

        <button
          onClick={handleDownloadInvoice}
          disabled={downloadingInvoice}
          className="flex w-full items-center justify-between rounded-2xl border border-gray-200 px-5 py-4 text-gray-700 transition hover:bg-gray-50"
        >
          <div className="flex items-center gap-3">
            {downloadingInvoice ? (
              <Loader2
                size={20}
                className="animate-spin"
              />
            ) : (
              <FileText size={20} />
            )}
            {downloadingInvoice
              ? "Preparing Invoice..."
              : "Download Invoice"}
          </div>
        </button>

        {canPayRemaining && (
          <button
            onClick={handleRemainingPayment}
            disabled={payingRemaining}
            className="flex w-full items-center justify-between rounded-2xl bg-[#ff4d6d] px-5 py-4 font-semibold text-white transition hover:bg-[#e4005a] disabled:cursor-not-allowed disabled:opacity-70"
          >
            <div className="flex items-center gap-3">
              {payingRemaining ? (
                <Loader2
                  size={20}
                  className="animate-spin"
                />
              ) : (
                <CreditCard size={20} />
              )}
              Pay Remaining ₹
              {currentBooking.remainingAmount.toLocaleString(
                "en-IN"
              )}
            </div>
          </button>
        )}

        {/* Reschedule */}

        <button
          className="flex w-full items-center justify-between rounded-2xl border border-gray-200 px-5 py-4 text-gray-700 transition hover:bg-gray-50"
        >
          <div className="flex items-center gap-3">
            <CalendarClock size={20} />
            Reschedule Booking
          </div>
        </button>

        {/* Cancel Booking */}

        <button
          onClick={handleCancelBooking}
          disabled={!canCancel}
          className={`
            flex
            w-full
            items-center
            justify-between
            rounded-2xl
            px-5
            py-4
            font-medium
            transition

            ${
              canCancel
                ? "border border-red-200 bg-red-50 text-red-600 hover:bg-red-100"
                : "cursor-not-allowed border border-gray-200 bg-gray-100 text-gray-400"
            }
          `}
        >
          <div className="flex items-center gap-3">

            <AlertTriangle size={20} />

            {currentBooking.bookingStatus ===
            "cancelled"
              ? "Booking Cancelled"
              : currentBooking.bookingStatus ===
                "pending"
              ? "Cancel Booking"
              : "Cancellation Unavailable"}

          </div>

        </button>

      </div>

    </section>
  );
}
