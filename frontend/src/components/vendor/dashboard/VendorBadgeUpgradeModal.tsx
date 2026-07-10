"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Loader2, X } from "lucide-react";
import { toast } from "sonner";

import {
  VendorBadge,
  VENDOR_BADGE_LABELS,
  VENDOR_BADGE_LIMITS,
} from "@/constants/vendor-badges";
import {
  createVendorBadgeOrderApi,
  verifyVendorBadgePaymentApi,
} from "@/services/api/payment.api";

type UpgradeBadge = "silver" | "gold";

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

interface VendorBadgeUpgradeModalProps {
  open: boolean;
  currentBadge: VendorBadge;
  onClose: () => void;
  onUpgraded: () => void;
}

const plans: Array<{
  badge: UpgradeBadge;
  price: number;
  accent: string;
}> = [
  {
    badge: "silver",
    price: 999,
    accent: "from-[#fff8ef] to-[#fff0bf] text-[#4d1730]",
  },
  {
    badge: "gold",
    price: 1999,
    accent: "from-[#fff0bf] to-[#ffb703] text-[#4d1730]",
  },
];

function rank(badge: VendorBadge) {
  return badge === "gold"
    ? 3
    : badge === "silver"
    ? 2
    : 1;
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

export default function VendorBadgeUpgradeModal({
  open,
  currentBadge,
  onClose,
  onUpgraded,
}: VendorBadgeUpgradeModalProps) {
  const [loadingBadge, setLoadingBadge] =
    useState<UpgradeBadge | null>(null);

  if (!open) {
    return null;
  }

  const handleUpgrade = async (
    badge: UpgradeBadge
  ) => {
    setLoadingBadge(badge);

    const order =
      await createVendorBadgeOrderApi(badge);

    if (!order.ok || !order.data) {
      setLoadingBadge(null);
      toast.error(
        order.error ??
          "Unable to start badge payment."
      );
      return;
    }

    const loaded =
      await loadRazorpayScript();

    if (!loaded || !window.Razorpay) {
      setLoadingBadge(null);
      toast.error(
        "Payment gateway could not be loaded."
      );
      return;
    }

    const razorpay = new window.Razorpay({
      key: order.data.keyId,
      amount: order.data.amountInPaise,
      currency: order.data.currency,
      name: "Barati Gharati",
      description: `${VENDOR_BADGE_LABELS[badge]} badge upgrade`,
      order_id: order.data.orderId,
      theme: {
        color:
          badge === "gold"
            ? "#e4005a"
            : "#e4005a",
      },
      modal: {
        ondismiss: () => setLoadingBadge(null),
      },
      handler: async (response) => {
        const verified =
          await verifyVendorBadgePaymentApi({
            badge,
            orderId:
              response.razorpay_order_id,
            paymentId:
              response.razorpay_payment_id,
            signature:
              response.razorpay_signature,
          });

        setLoadingBadge(null);

        if (!verified.ok) {
          toast.error(
            verified.error ??
              "Badge payment verification failed."
          );
          return;
        }

        toast.success(
          `${VENDOR_BADGE_LABELS[badge]} badge activated.`
        );
        onUpgraded();
        onClose();
      },
    });

    razorpay.open();
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 18 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-3xl rounded-[28px] border border-[#f4c8a0] bg-[#fffaf3] p-6 shadow-2xl shadow-[#e4005a]/15"
      >
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-black text-[#4d1730]">
              Upgrade Badge
            </h2>
            <p className="mt-1 text-[#946176]">
              Choose a higher plan to unlock more monthly bookings.
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-full p-2 text-[#946176] transition hover:bg-[#ffe9bf]"
          >
            <X />
          </button>
        </div>

        <div className="mt-7 grid gap-4 md:grid-cols-2">
          {plans.map((plan) => {
            const disabled =
              rank(plan.badge) <=
              rank(currentBadge);
            const loading =
              loadingBadge === plan.badge;

            return (
              <button
                key={plan.badge}
                disabled={disabled || Boolean(loadingBadge)}
                onClick={() =>
                  handleUpgrade(plan.badge)
                }
                className={`rounded-3xl border p-5 text-left transition ${
                  disabled
                    ? "cursor-not-allowed border-[#f4c8a0] bg-[#fff8ef] opacity-60"
                    : "border-[#f4c8a0] bg-white hover:-translate-y-1 hover:border-[#ffc43d] hover:shadow-xl hover:shadow-[#e4005a]/10"
                }`}
              >
                <div
                  className={`rounded-2xl bg-gradient-to-br p-5 ${plan.accent}`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-black">
                      {
                        VENDOR_BADGE_LABELS[
                          plan.badge
                        ]
                      }
                    </span>
                    {disabled ? (
                      <CheckCircle2 size={24} />
                    ) : loading ? (
                      <Loader2 className="animate-spin" />
                    ) : null}
                  </div>

                  <p className="mt-5 text-4xl font-black">
                    ₹
                    {plan.price.toLocaleString(
                      "en-IN"
                    )}
                  </p>
                </div>

                <p className="mt-4 text-sm font-semibold text-[#4d1730]">
                  Up to{" "}
                  {VENDOR_BADGE_LIMITS[plan.badge]}{" "}
                  bookings per month
                </p>

                <p className="mt-2 text-sm text-[#946176]">
                  {disabled
                    ? "Current or lower plan"
                    : "Pay securely and activate instantly"}
                </p>
              </button>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
