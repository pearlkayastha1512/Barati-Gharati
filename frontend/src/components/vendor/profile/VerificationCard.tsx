"use client";

import {
  CheckCircle2,
  Clock3,
  XCircle,
} from "lucide-react";

import { useAuthStore } from "@/store/authStore";
import { getVendorByUserId } from "@/services/vendor.service";

export default function VerificationCard() {
  const { user } = useAuthStore();

  const vendor = user
    ? getVendorByUserId(user._id)
    : null;

  if (!vendor) {
    return null;
  }

  const approved =
    vendor.approvalStatus === "approved";

  const rejected =
    vendor.approvalStatus === "rejected";

  const pending =
    vendor.approvalStatus === "pending";

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">

      <h2 className="text-2xl font-bold text-gray-800">
        Verification Status
      </h2>

      <div className="mt-8 space-y-5">

        <Row
          label="Business Verification"
          verified={approved}
        />

        <Row
          label="GST Verification"
          verified={approved}
        />

        <Row
          label="Bank Verification"
          verified={approved}
        />

      </div>

      <div
        className={`mt-8 flex items-center gap-3 rounded-2xl p-4 ${
          approved
            ? "bg-green-50 border border-green-200"
            : rejected
            ? "bg-red-50 border border-red-200"
            : "bg-amber-50 border border-amber-200"
        }`}
      >
        {approved ? (
          <CheckCircle2
            className="text-green-600"
            size={24}
          />
        ) : rejected ? (
          <XCircle
            className="text-red-600"
            size={24}
          />
        ) : (
          <Clock3
            className="text-amber-600"
            size={24}
          />
        )}

        <div>
          <p
            className={`font-semibold ${
              approved
                ? "text-green-700"
                : rejected
                ? "text-red-700"
                : "text-amber-700"
            }`}
          >
            {approved
              ? "Verified by Admin"
              : rejected
              ? "Verification Rejected"
              : "Verification Pending"}
          </p>

          <p className="mt-1 text-sm text-gray-600">
            {approved
              ? "Your business has been verified. Customers can now book your services."
              : rejected
              ? "Your verification was rejected. Please contact the administrator."
              : "Your account is currently under review by our admin team."}
          </p>
        </div>
      </div>

    </section>
  );
}

function Row({
  label,
  verified,
}: {
  label: string;
  verified: boolean;
}) {
  return (
    <div className="flex items-center justify-between border-b border-slate-100 pb-4">

      <span className="text-gray-600">
        {label}
      </span>

      <span
        className={`font-semibold ${
          verified
            ? "text-green-600"
            : "text-amber-600"
        }`}
      >
        {verified
          ? "Verified"
          : "Pending"}
      </span>

    </div>
  );
}