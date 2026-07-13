"use client";

import Image from "next/image";
import { useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  Loader2,
  ShieldCheck,
} from "lucide-react";

import { useVendorRegistrationStore } from "@/store/vendorRegistrationStore";
import { registerVendorApi } from "@/services/api/auth.api";
import {
  VendorBadge,
  VENDOR_BADGE_LABELS,
  VENDOR_BADGE_LIMITS,
} from "@/constants/vendor-badges";
import { createVendorRegistrationBadgeOrderApi } from "@/services/api/payment.api";

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

const badgePlans: Array<{
  badge: VendorBadge;
  price: number;
  className: string;
}> = [
  {
    badge: "bronze",
    price: 0,
    className:
      "border-amber-300 bg-amber-50 text-amber-900",
  },
  {
    badge: "silver",
    price: 999,
    className:
      "border-slate-300 bg-slate-50 text-slate-800",
  },
  {
    badge: "gold",
    price: 1999,
    className:
      "border-yellow-300 bg-yellow-50 text-yellow-900",
  },
];

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

export default function ReviewStep() {
  const {
    formData,
    previousStep,
    nextStep,
  } = useVendorRegistrationStore();
  const [selectedBadge, setSelectedBadge] =
    useState<VendorBadge>("bronze");
  const [isSubmitting, setIsSubmitting] =
    useState(false);
  const [error, setError] = useState("");

//  const handleSubmit = () => {
//   const result = registerVendor(formData);

//   if (!result.success) {
//     alert(result.message);
//     return;
//   }

//   nextStep();
// };






const submitRegistration = async (
  payment?: RazorpayResponse
) => {
  const result = await registerVendorApi({
    ownerName: formData.ownerName,
    email: formData.email,
    phone: formData.phone,
    password: formData.password,

    businessName: formData.businessName,
    category: formData.category,
    city: formData.city,
    address: formData.address,
    description: formData.description,

    website: formData.website,
    instagram: formData.instagram,
    facebook: formData.facebook,
    youtube: formData.youtube,
    linkedin: formData.linkedin,

    experience: formData.experience,
    gstNumber: formData.gstNumber,
    profileImage: formData.profileImage,
    coverImage: formData.coverImage,

    selectedBadge:
      selectedBadge.toUpperCase() as
        | "BRONZE"
        | "SILVER"
        | "GOLD",
    badgePaymentOrderId:
      payment?.razorpay_order_id,
    badgePaymentId:
      payment?.razorpay_payment_id,
    badgePaymentSignature:
      payment?.razorpay_signature,
  });

  if (!result.ok) {
    throw new Error(
      result.data.message ??
        "Vendor registration failed."
    );
  }

  nextStep();
};

const handleSubmit = async () => {
  setError("");
  setIsSubmitting(true);

  if (selectedBadge === "bronze") {
    try {
      await submitRegistration();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Vendor registration failed."
      );
      setIsSubmitting(false);
    }
    return;
  }

  const order =
    await createVendorRegistrationBadgeOrderApi(
      selectedBadge as "silver" | "gold"
    );

  if (!order.ok || !order.data) {
    setIsSubmitting(false);
    setError(
      order.error ??
        "Unable to start badge payment."
    );
    return;
  }

  const loaded = await loadRazorpayScript();

  if (!loaded || !window.Razorpay) {
    setIsSubmitting(false);
    setError(
      "Payment gateway could not be loaded."
    );
    return;
  }

  const razorpay = new window.Razorpay({
    key: order.data.keyId,
    amount: order.data.amountInPaise,
    currency: order.data.currency,
    name: "Barati Gharati",
    description: `${VENDOR_BADGE_LABELS[selectedBadge]} vendor registration badge`,
    order_id: order.data.orderId,
    prefill: {
      name: formData.ownerName,
      email: formData.email,
      contact: formData.phone,
    },
    theme: {
      color: "#e4005a",
    },
    modal: {
      ondismiss: () => {
        setIsSubmitting(false);
      },
    },
    handler: async (response) => {
      try {
        await submitRegistration(response);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Vendor registration failed."
        );
        setIsSubmitting(false);
      }
    },
  });

  razorpay.open();
};












  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-10">
        <h2 className="text-3xl font-bold text-gray-700">
          Review Your Information
        </h2>

        <p className="mt-2 text-gray-500">
          Please verify everything before submitting.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Account */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6">
          <h3 className="mb-5 text-xl font-semibold text-gray-700">
            Account Information
          </h3>

          <div className="space-y-3">
            <Info
              label="Owner Name"
              value={formData.ownerName}
            />

            <Info
              label="Email"
              value={formData.email}
            />

            <Info
              label="Phone"
              value={formData.phone}
            />
          </div>
        </div>

        {/* Business */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6">
          <h3 className="mb-5 text-xl font-semibold text-gray-700">
            Business Information
          </h3>

          <div className="space-y-3">
            <Info
              label="Business"
              value={formData.businessName}
            />

            <Info
              label="Category"
              value={formData.category}
            />

            <Info
              label="City"
              value={formData.city}
            />

            <Info
              label="Address"
              value={formData.address}
            />
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-6">
        <h3 className="mb-4 text-xl font-semibold text-gray-700">
          Description
        </h3>

        <p className="leading-7 text-gray-600">
          {formData.description || "-"}
        </p>
      </div>

      <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-6">
        <div className="flex items-center gap-3">
          <ShieldCheck className="text-rose-600" />
          <div>
            <h3 className="text-xl font-semibold text-gray-700">
              Choose Your Vendor Badge
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Start free with Bronze or choose a paid plan for a higher monthly booking limit.
            </p>
          </div>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {badgePlans.map((plan) => {
            const active =
              selectedBadge === plan.badge;

            return (
              <button
                type="button"
                key={plan.badge}
                disabled={isSubmitting}
                onClick={() =>
                  setSelectedBadge(plan.badge)
                }
                className={`rounded-2xl border p-5 text-left transition ${
                  active
                    ? "border-rose-500 bg-rose-50 shadow-md"
                    : `${plan.className} hover:border-rose-300`
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <h4 className="text-lg font-bold">
                    {
                      VENDOR_BADGE_LABELS[
                        plan.badge
                      ]
                    }{" "}
                    Badge
                  </h4>

                  {active && (
                    <CheckCircle2
                      size={20}
                      className="text-rose-600"
                    />
                  )}
                </div>

                <p className="mt-4 text-3xl font-black">
                  {plan.price === 0
                    ? "Free"
                    : `₹${plan.price.toLocaleString("en-IN")}`}
                </p>

                <p className="mt-3 text-sm font-medium text-gray-600">
                  Up to{" "}
                  {
                    VENDOR_BADGE_LIMITS[
                      plan.badge
                    ]
                  }{" "}
                  bookings per month
                </p>
              </button>
            );
          })}
        </div>

        {error && (
          <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
            {error}
          </p>
        )}
      </div>

      {/* Images */}
      <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-6">
        <h3 className="mb-5 text-xl font-semibold text-gray-700">
          Uploaded Images
        </h3>

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <p className="mb-3 font-medium text-gray-600">
              Profile Image
            </p>

            {formData.profileImage ? (
              <Image
                src={formData.profileImage}
                alt="Profile"
                width={300}
                height={220}
                className="rounded-xl object-cover"
              />
            ) : (
              <p className="text-gray-400">
                Not Uploaded
              </p>
            )}
          </div>

          <div>
            <p className="mb-3 font-medium text-gray-600">
              Cover Image
            </p>

            {formData.coverImage ? (
              <Image
                src={formData.coverImage}
                alt="Cover"
                width={300}
                height={220}
                className="rounded-xl object-cover"
              />
            ) : (
              <p className="text-gray-400">
                Not Uploaded
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="mt-12 flex justify-between">
        <button
          onClick={previousStep}
          className="flex items-center gap-2 rounded-xl border border-gray-300 px-6 py-3 font-medium text-gray-600 transition hover:bg-gray-100"
        >
          <ArrowLeft size={18} />
          Previous
        </button>

        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="flex items-center gap-3 rounded-xl bg-green-600 px-8 py-3 font-semibold text-white shadow-lg transition-all duration-200 hover:bg-green-700 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? (
            <Loader2
              size={20}
              className="animate-spin"
            />
          ) : (
            <CheckCircle2 size={20} />
          )}
          {isSubmitting
            ? selectedBadge === "bronze"
              ? "Submitting Registration"
              : "Processing Payment"
            : selectedBadge === "bronze"
              ? "Submit Registration"
              : "Pay & Submit Registration"}
        </button>
      </div>
    </div>
  );
}

interface InfoProps {
  label: string;
  value: string;
}

function Info({
  label,
  value,
}: InfoProps) {
  return (
    <div className="flex justify-between border-b border-gray-100 pb-3">
      <span className="text-gray-500">
        {label}
      </span>

      <span className="font-medium text-gray-700">
        {value || "-"}
      </span>
    </div>
  );
}
