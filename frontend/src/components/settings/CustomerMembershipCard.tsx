"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Crown, Sparkles, CheckCircle2, ShieldCheck, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { useAuthStore } from "@/store/authStore";
import {
  createCustomerPremiumRegistrationOrderApi,
  verifyCustomerPremiumUpgradeApi,
} from "@/services/api/payment.api";

type RazorpayResponse = {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
};

function loadRazorpayScript() {
  return new Promise<boolean>((resolve) => {
    if ((window as any).Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export default function CustomerMembershipCard() {
  const { user, updateUser } = useAuthStore();
  const [loading, setLoading] = useState(false);

  if (!user) return null;

  const isPremium = user.membership === "PREMIUM";

  const handleUpgrade = async () => {
    try {
      setLoading(true);
      const res = await createCustomerPremiumRegistrationOrderApi();

      if (!res.ok || !res.data) {
        toast.error(res.error || "Unable to initiate payment.");
        setLoading(false);
        return;
      }

      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded || !(window as any).Razorpay) {
        toast.error("Payment gateway script failed to load. Please try again.");
        setLoading(false);
        return;
      }

      const orderData = res.data;

      const razorpay = new (window as any).Razorpay({
        key: orderData.keyId,
        amount: orderData.amountInPaise,
        currency: orderData.currency || "INR",
        name: "Barati Gharati",
        description: "Customer Premium Membership Upgrade",
        order_id: orderData.orderId,
        prefill: {
          name: user.name || "",
          email: user.email || "",
          contact: user.phone || "",
        },
        theme: {
          color: "#ff4d6d",
        },
        handler: async (response: RazorpayResponse) => {
          try {
            const verifyRes = await verifyCustomerPremiumUpgradeApi({
              orderId: response.razorpay_order_id,
              paymentId: response.razorpay_payment_id,
              signature: response.razorpay_signature,
            });

            if (verifyRes.ok) {
              toast.success("Congratulations! You are now a Premium VIP Member 🎉");
              updateUser({
                ...user,
                membership: "PREMIUM",
              });
            } else {
              toast.error(verifyRes.error || "Payment verification failed.");
            }
          } catch (err: unknown) {
            toast.error("Payment verification encountered an error.");
          } finally {
            setLoading(false);
          }
        },
      });

      razorpay.open();
    } catch (err: unknown) {
      toast.error("Something went wrong initiating the upgrade.");
      setLoading(false);
    }
  };

  if (isPremium) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl border border-amber-200 bg-gradient-to-br from-amber-50 via-rose-50 to-pink-50 p-7 shadow-sm"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500 text-white shadow-md">
              <Crown size={24} />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-200/60 px-3 py-0.5 text-xs font-bold text-amber-900">
                <Sparkles size={12} /> VIP MEMBER
              </div>
              <h2 className="text-xl font-bold text-gray-900 mt-1">Premium Planning Membership</h2>
            </div>
          </div>
          <span className="rounded-xl bg-emerald-100 px-3.5 py-1.5 text-xs font-bold text-emerald-800 flex items-center gap-1">
            <ShieldCheck size={14} /> Active
          </span>
        </div>

        <p className="mt-4 text-sm text-gray-600">
          You have full access to dedicated Barati Gharati wedding planners, consolidated quotations, and VIP vendor concierge service!
        </p>

        <div className="mt-5 grid gap-3.5 sm:grid-cols-2">
          {[
            "Dedicated Wedding Planning Team",
            "Personalized Venue & Vendor Shortlist",
            "Single Consolidated Quotation",
            "VIP Concierge & Booking Priority",
          ].map((item, idx) => (
            <div key={idx} className="flex items-center gap-2.5 text-xs font-medium text-gray-800">
              <CheckCircle2 size={16} className="text-amber-600 shrink-0" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-3xl border-2 border-rose-200 bg-gradient-to-br from-white via-rose-50/50 to-amber-50/50 p-7 shadow-md"
    >
      <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-rose-200/30 blur-2xl pointer-events-none" />

      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-3 max-w-xl">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 px-3.5 py-1 text-xs font-bold text-white shadow-sm">
            <Crown size={14} /> UPGRADE YOUR EXPERIENCE
          </div>

          <h2 className="text-2xl font-black tracking-tight text-gray-900">
            Become a <span className="text-[#ff4d6d]">Premium Member</span>
          </h2>

          <p className="text-sm text-gray-600 leading-relaxed">
            Get a dedicated Barati Gharati personal wedding planner, custom venue shortlisting, single consolidated quotes, and VIP priority booking for ₹4,999!
          </p>

          <div className="grid gap-2.5 sm:grid-cols-2 pt-1">
            {[
              "Dedicated Personal Wedding Planner",
              "Handpicked Venue & Vendor Shortlists",
              "Single Consolidated Quotations",
              "VIP Priority & Booking Support",
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-2 text-xs font-semibold text-gray-700">
                <CheckCircle2 size={15} className="text-[#ff4d6d] shrink-0" />
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col items-start lg:items-end gap-3 shrink-0">
          <div className="text-left lg:text-right">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">One-time Payment</span>
            <div className="text-3xl font-black text-gray-900">
              ₹4,999 <span className="text-xs font-normal text-gray-500">/ lifetime</span>
            </div>
          </div>

          <button
            onClick={handleUpgrade}
            disabled={loading}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#ff4d6d] to-[#ff758f] px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-rose-500/25 transition-all hover:scale-[1.02] hover:shadow-xl hover:shadow-rose-500/35 active:scale-95 disabled:opacity-70"
          >
            {loading ? (
              "Processing..."
            ) : (
              <>
                <Sparkles size={16} /> Upgrade to Premium Now <ArrowRight size={16} />
              </>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
