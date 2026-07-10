"use client";

import { useEffect, useState } from "react";
import { CreditCard, Loader2, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

import {
  createPaymentOrderApi,
  PaymentOrderResponse,
  verifyPaymentApi,
} from "@/services/api/payment.api";

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

interface AdvancePaymentStepProps {
  bookingId: string;
  bookingNumber: string;
  vendorName: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  onPaid: () => void;
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

export default function AdvancePaymentStep({
  bookingId,
  bookingNumber,
  vendorName,
  customerName,
  customerEmail,
  customerPhone,
  onPaid,
}: AdvancePaymentStepProps) {
  const [order, setOrder] =
    useState<PaymentOrderResponse | null>(
      null
    );
  const [loading, setLoading] =
    useState(true);
  const [paying, setPaying] =
    useState(false);

  useEffect(() => {
    async function loadOrder() {
      setLoading(true);

      const result =
        await createPaymentOrderApi(
          bookingId
        );

      setLoading(false);

      if (!result.ok || !result.data) {
        toast.error(
          result.error ??
            "Unable to prepare payment."
        );
        return;
      }

      setOrder(result.data);
    }

    void loadOrder();
  }, [bookingId]);

  const handlePayment = async () => {
    if (!order) {
      return;
    }

    setPaying(true);

    const loaded =
      await loadRazorpayScript();

    if (!loaded || !window.Razorpay) {
      setPaying(false);
      toast.error(
        "Payment gateway could not be loaded."
      );
      return;
    }

    const razorpay = new window.Razorpay({
      key: order.keyId,
      amount: order.amountInPaise,
      currency: order.currency,
      name: "Barati Gharati",
      description: `10% advance for ${vendorName}`,
      order_id: order.orderId,
      prefill: {
        name: customerName,
        email: customerEmail,
        contact: customerPhone,
      },
      theme: {
        color: "#e11d48",
      },
      modal: {
        ondismiss: () => setPaying(false),
      },
      handler: async (response) => {
        const verified =
          await verifyPaymentApi({
            bookingId,
            orderId:
              response.razorpay_order_id,
            paymentId:
              response.razorpay_payment_id,
            signature:
              response.razorpay_signature,
          });

        setPaying(false);

        if (!verified.ok) {
          toast.error(
            verified.error ??
              "Payment verification failed."
          );
          return;
        }

        toast.success(
          "Advance payment received."
        );
        onPaid();
      },
    });

    razorpay.open();
  };

  return (
    <div className="p-8">
      <div className="mx-auto max-w-xl text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
          <ShieldCheck size={32} />
        </div>

        <h2 className="mt-5 text-3xl font-bold text-gray-900">
          Pay 10% Advance
        </h2>

        <p className="mt-3 text-gray-600">
          Your booking request #{bookingNumber} is ready. Pay the secure platform advance first; admin approval will unlock vendor chat.
        </p>

        <div className="mt-8 rounded-2xl border border-rose-100 bg-rose-50 p-6 text-left">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-600">
              Total Amount
            </span>
            <span className="font-semibold text-gray-900">
              ₹
              {(order?.totalAmount ?? 0).toLocaleString(
                "en-IN"
              )}
            </span>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <span className="text-sm font-medium text-gray-600">
              Advance Due
            </span>
            <span className="text-2xl font-bold text-rose-600">
              ₹
              {(order?.amount ?? 0).toLocaleString(
                "en-IN"
              )}
            </span>
          </div>
        </div>

        <button
          onClick={handlePayment}
          disabled={loading || paying || !order}
          className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 px-6 py-4 font-semibold text-white shadow-lg shadow-rose-200 transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading || paying ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <CreditCard size={20} />
          )}
          {paying
            ? "Processing..."
            : loading
              ? "Preparing..."
              : "Pay Secure Advance"}
        </button>
      </div>
    </div>
  );
}
