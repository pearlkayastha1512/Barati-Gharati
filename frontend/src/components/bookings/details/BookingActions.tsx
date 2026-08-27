"use client";

import { useState } from "react";

import {
  CalendarClock,
  CreditCard,
  FileText,
  AlertTriangle,
  Loader2,
  X,
} from "lucide-react";
import { regenerateInvoiceApi } from "@/services/api/involve.api";

import { Booking } from "@/types/booking";

import { useBookingStore } from "@/store/bookingStore";
import { toast } from "sonner";
import {
  createPaymentOrderApi,
  createRemainingPaymentOrderApi,
  verifyPaymentApi,
  verifyRemainingPaymentApi,
} from "@/services/api/payment.api";
import { downloadInvoiceApi } from "@/services/api/invoice.api";
import { rescheduleBookingApi } from "@/services/api/booking.api";
import { getAdvancePercentage, getAdvanceAmountDue } from "@/utils/advance-payment";


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
  const [payingAdvance, setPayingAdvance] = useState(false);
  const [payingRemaining, setPayingRemaining] = useState(false);
  const [downloadingInvoice, setDownloadingInvoice] = useState(false);
  const [rescheduleOpen, setRescheduleOpen] = useState(false);
  const [rescheduleDate, setRescheduleDate] = useState("");
  const [rescheduleReason, setRescheduleReason] = useState("");
  const [rescheduling, setRescheduling] = useState(false);

  const {
    updateStatus,
    loadBooking,
  } = useBookingStore();

  const currentBooking = booking;

  const advancePercentage = getAdvancePercentage(currentBooking.amount);
  const advanceDueAmount = getAdvanceAmountDue(currentBooking.amount);

  const canPayAdvance =
    [
      "waiting_payment",
      "primary_accepted",
      "standby_accepted",
      "accepted",
    ].includes(currentBooking.bookingStatus) &&
    currentBooking.paymentStatus === "pending";

  const canCancel =
    currentBooking.bookingStatus === "pending" ||
    currentBooking.bookingStatus === "waiting_primary_vendor";

  const handleAdvancePayment = async () => {
    if (!canPayAdvance) return;

    setPayingAdvance(true);

    const orderResult = await createPaymentOrderApi(currentBooking.id);

    if (!orderResult.ok || !orderResult.data) {
      setPayingAdvance(false);
      toast.error(orderResult.error ?? "Unable to prepare payment.");
      return;
    }

    const order = orderResult.data;

    if (order.orderId && order.orderId.startsWith("order_mock_")) {
      const verified = await verifyPaymentApi({
        bookingId: currentBooking.id,
        orderId: order.orderId,
        paymentId: `pay_mock_${Date.now()}`,
        signature: `sig_mock_${Date.now()}`,
      });

      setPayingAdvance(false);
      if (!verified.ok) {
        toast.error(verified.error ?? "Payment verification failed.");
        return;
      }
      toast.success("Advance payment completed successfully!");
      await loadBooking(currentBooking.id);
      return;
    }

    const scriptLoaded = await loadRazorpayScript();
    if (!scriptLoaded || !window.Razorpay) {
      setPayingAdvance(false);
      toast.error("Payment gateway could not be loaded.");
      return;
    }
    const razorpay = new window.Razorpay({
      key: order.keyId,
      amount: order.amountInPaise,
      currency: order.currency,
      name: "Barati Gharati",
      description: `${order.advancePercentage ?? advancePercentage}% advance for ${currentBooking.vendorName}`,
      order_id: order.orderId,
      prefill: {
        name: currentBooking.customerName,
        email: currentBooking.customerEmail,
        contact: currentBooking.customerPhone,
      },
      theme: {
        color: "#ff4d6d",
      },
      modal: {
        ondismiss: () => setPayingAdvance(false),
      },
      handler: async (response) => {
        const verified = await verifyPaymentApi({
          bookingId: currentBooking.id,
          orderId: response.razorpay_order_id,
          paymentId: response.razorpay_payment_id,
          signature: response.razorpay_signature,
        });

        setPayingAdvance(false);

        if (!verified.ok) {
          toast.error(verified.error ?? "Payment verification failed.");
          return;
        }

        toast.success("Advance payment completed successfully!");
        await loadBooking(currentBooking.id);
      },
    });

    razorpay.open();
  };


  const canPayRemaining =
    currentBooking.bookingStatus ===
      "payment_approved" &&
    currentBooking.remainingAmount > 0;

  const canReschedule = ![
    "cancelled",
    "rejected",
    "event_completed",
    "awaiting_admin_review",
    "payment_held",
  ].includes(currentBooking.bookingStatus);

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minimumDate = [
    tomorrow.getFullYear(),
    String(tomorrow.getMonth() + 1).padStart(2, "0"),
    String(tomorrow.getDate()).padStart(2, "0"),
  ].join("-");

  const originalEventDate = new Date(currentBooking.eventDate);
  const originalEventDateValue = [
    originalEventDate.getUTCFullYear(),
    String(originalEventDate.getUTCMonth() + 1).padStart(2, "0"),
    String(originalEventDate.getUTCDate()).padStart(2, "0"),
  ].join("-");

  const canSubmitReschedule =
    Boolean(rescheduleDate) &&
    rescheduleDate >= minimumDate &&
    rescheduleDate !== originalEventDateValue;

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

    const order = orderResult.data;

    if (order.orderId && order.orderId.startsWith("order_mock_")) {
      const verified = await verifyRemainingPaymentApi({
        bookingId: currentBooking.id,
        orderId: order.orderId,
        paymentId: `pay_mock_${Date.now()}`,
        signature: `sig_mock_${Date.now()}`,
      });

      setPayingRemaining(false);
      if (!verified.ok) {
        toast.error(verified.error ?? "Payment verification failed.");
        return;
      }
      toast.success("Remaining payment completed successfully!");
      await loadBooking(currentBooking.id);
      return;
    }

    const scriptLoaded = await loadRazorpayScript();
    if (!scriptLoaded || !window.Razorpay) {
      setPayingRemaining(false);
      toast.error("Payment gateway could not be loaded.");
      return;
    }
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

  const openRescheduleModal = () => {
    if (!canReschedule) return;

    const currentDate = new Date(currentBooking.eventDate);
    setRescheduleDate(
      [
        currentDate.getUTCFullYear(),
        String(currentDate.getUTCMonth() + 1).padStart(2, "0"),
        String(currentDate.getUTCDate()).padStart(2, "0"),
      ].join("-")
    );
    setRescheduleReason("");
    setRescheduleOpen(true);
  };

  const handleReschedule = async () => {
    if (!canSubmitReschedule || !canReschedule) return;

    setRescheduling(true);

    const result = await rescheduleBookingApi(
      currentBooking.id,
      rescheduleDate,
      rescheduleReason
    );

    setRescheduling(false);

    if (!result.ok) {
      toast.error(result.error);
      return;
    }

    await loadBooking(currentBooking.id);
    setRescheduleOpen(false);
    toast.success("Booking rescheduled successfully.");
  };

  return (
    <>
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
          onClick={openRescheduleModal}
          disabled={!canReschedule}
          className={`flex w-full items-center justify-between rounded-2xl border px-5 py-4 transition ${
            canReschedule
              ? "border-gray-200 text-gray-700 hover:bg-gray-50"
              : "cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400"
          }`}
        >
          <div className="flex items-center gap-3">
            <CalendarClock size={20} />
            {canReschedule
              ? "Reschedule Booking"
              : "Rescheduling Unavailable"}
          </div>
        </button>

        {/* Pay Advance Button */}
        {canPayAdvance ? (
          <button
            onClick={handleAdvancePayment}
            disabled={payingAdvance}
            className="flex w-full items-center justify-between rounded-2xl bg-[#ff4d6d] px-5 py-4 font-semibold text-white transition hover:bg-[#e4005a] disabled:cursor-not-allowed disabled:opacity-70 shadow-lg shadow-rose-100"
          >
            <div className="flex items-center gap-3">
              {payingAdvance ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                <CreditCard size={20} />
              )}
              {payingAdvance
                ? "Preparing Payment..."
                : `Pay Advance ₹${advanceDueAmount.toLocaleString("en-IN")} (${advancePercentage}%)`}
            </div>
          </button>
        ) : (currentBooking.bookingStatus === "waiting_primary_vendor" ||
            currentBooking.bookingStatus === "matching" ||
            currentBooking.bookingStatus === "promote_standby") && (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-xs font-semibold text-amber-800">
            ⏳ Waiting for vendor acceptance before advance payment can be made.
          </div>
        )}


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

      {rescheduleOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/55 p-5">
          <div className="w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-200 px-7 py-5">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Reschedule Booking
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Choose a new available date for {currentBooking.vendorName}.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setRescheduleOpen(false)}
                disabled={rescheduling}
                aria-label="Close reschedule modal"
                className="rounded-full p-2 text-gray-500 transition hover:bg-gray-100"
              >
                <X size={21} />
              </button>
            </div>

            <div className="space-y-5 p-7">
              <div>
                <label
                  htmlFor="reschedule-date"
                  className="mb-2 block font-semibold text-gray-700"
                >
                  New Event Date
                </label>
                <input
                  id="reschedule-date"
                  type="date"
                  min={minimumDate}
                  value={rescheduleDate}
                  onChange={(event) => setRescheduleDate(event.target.value)}
                  className="w-full rounded-2xl border border-gray-300 px-4 py-3 text-gray-700 outline-none transition focus:border-rose-500 focus:ring-2 focus:ring-rose-100"
                />
              </div>

              <div>
                <label
                  htmlFor="reschedule-reason"
                  className="mb-2 block font-semibold text-gray-700"
                >
                  Reason <span className="font-normal text-gray-400">(Optional)</span>
                </label>
                <textarea
                  id="reschedule-reason"
                  rows={3}
                  maxLength={500}
                  value={rescheduleReason}
                  onChange={(event) => setRescheduleReason(event.target.value)}
                  placeholder="Tell the vendor why the date is changing..."
                  className="w-full resize-none rounded-2xl border border-gray-300 px-4 py-3 text-gray-700 outline-none transition focus:border-rose-500 focus:ring-2 focus:ring-rose-100"
                />
              </div>

              <div className="rounded-2xl bg-amber-50 p-4 text-sm leading-6 text-amber-800">
                The new date will be checked against the vendor&apos;s calendar. The vendor and admin will be notified after rescheduling.
              </div>
            </div>

            <div className="flex justify-end gap-3 border-t border-gray-200 px-7 py-5">
              <button
                type="button"
                onClick={() => setRescheduleOpen(false)}
                disabled={rescheduling}
                className="rounded-xl border border-gray-300 px-5 py-3 font-semibold text-gray-600 transition hover:bg-gray-50 disabled:opacity-60"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => void handleReschedule()}
                disabled={!canSubmitReschedule || rescheduling}
                className="inline-flex min-w-44 items-center justify-center gap-2 rounded-xl bg-rose-500 px-5 py-3 font-semibold text-white transition hover:bg-rose-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {rescheduling && <Loader2 size={18} className="animate-spin" />}
                {rescheduling ? "Checking Date..." : "Confirm Reschedule"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
