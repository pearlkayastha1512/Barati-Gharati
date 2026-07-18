"use client";

import { X } from "lucide-react";
import { User } from "@/types/auth";
import { approveCustomerApi, rejectCustomerApi, reverifyCustomerApi } from "@/services/api/admin.api";
import { useState } from "react";
import { toast } from "sonner";

interface Props {
  customer: User | null;

  open: boolean;

  onClose: () => void;
  onVerificationChange: (status: "pending" | "approved" | "rejected") => void;
}

export default function CustomerDetailsModal({
  customer,
  open,
  onClose,
  onVerificationChange,
}: Props) {
  const [loading, setLoading] = useState(false);
  if (!open || !customer) {
    return null;
  }

  const updateVerification = async (action: "approve" | "reject" | "reverify") => {
    const reason = action === "reject" ? window.prompt("Rejection reason (optional):") ?? undefined : undefined;
    setLoading(true);
    const result = action === "approve"
      ? await approveCustomerApi(customer._id)
      : action === "reject"
      ? await rejectCustomerApi(customer._id, reason)
      : await reverifyCustomerApi(customer._id);
    setLoading(false);
    if (!result.ok) return toast.error(result.error ?? "Unable to update verification.");
    const status = action === "approve" ? "approved" : action === "reject" ? "rejected" : "pending";
    onVerificationChange(status);
    toast.success(result.data && typeof result.data === "object" && "message" in result.data ? String(result.data.message) : "Verification updated.");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-6">
      <div className="w-full max-w-3xl rounded-3xl bg-white shadow-2xl">

        {/* Header */}

        <div className="flex items-center justify-between border-b border-slate-200 p-6">

          <h2 className="text-3xl font-bold text-slate-800">
            Customer Details
          </h2>

          <button
            onClick={onClose}
            className="rounded-xl p-2 transition hover:bg-slate-100"
          >
            <X size={22} />
          </button>

        </div>

        <div className="space-y-8 p-8">

          {/* Profile */}

          <div className="flex items-center gap-6">

            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-blue-100 text-4xl font-bold text-blue-700">
              {customer.name.charAt(0).toUpperCase()}
            </div>

            <div>

              <h2 className="text-3xl font-bold text-slate-900">
                {customer.name}
              </h2>

              <p className="mt-2 text-slate-500">
                {customer.email}
              </p>

              <span
                className={`mt-4 inline-block rounded-full px-4 py-2 text-sm font-semibold ${
                  customer.isVerified
                    ? "bg-green-100 text-green-700"
                    : "bg-amber-100 text-amber-700"
                }`}
              >
                {customer.isVerified
                  ? "Verified"
                  : "Unverified"}
              </span>

            </div>

          </div>

          {/* Information */}

          <div className="grid gap-6 md:grid-cols-2">

            <Info
              label="Full Name"
              value={customer.name}
            />

            <Info
              label="Email"
              value={customer.email}
            />

            <Info
              label="Phone"
              value={customer.phone}
            />

            <Info
              label="Role"
              value={customer.role}
            />

            <Info label="Admin Verification" value={(customer.adminVerificationStatus ?? "pending").toUpperCase()} />

            <Info
              label="Created At"
              value={new Date(
                customer.createdAt
              ).toLocaleDateString()}
            />

            <Info
              label="Last Updated"
              value={new Date(
                customer.updatedAt
              ).toLocaleDateString()}
            />

          </div>

          <div className="flex flex-wrap justify-end gap-3">

            {customer.adminVerificationStatus !== "approved" && <button disabled={loading || !customer.isVerified} onClick={() => void updateVerification("approve")} className="rounded-2xl bg-green-600 px-6 py-3 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50">Approve Customer</button>}
            {customer.adminVerificationStatus !== "rejected" && <button disabled={loading} onClick={() => void updateVerification("reject")} className="rounded-2xl bg-red-600 px-6 py-3 font-semibold text-white disabled:opacity-50">Reject</button>}
            {customer.adminVerificationStatus === "approved" && <button disabled={loading} onClick={() => void updateVerification("reverify")} className="rounded-2xl bg-amber-500 px-6 py-3 font-semibold text-white disabled:opacity-50">Require Re-verification</button>}

            <button
              onClick={onClose}
              className="rounded-2xl bg-slate-800 px-6 py-3 font-semibold text-white transition hover:bg-slate-700"
            >
              Close
            </button>

          </div>

        </div>
      </div>
    </div>
  );
}

function Info({
  label,
  value,
}: {
  label: string;
  value?: string;
}) {
  return (
    <div>
      <p className="text-sm font-medium text-slate-500">
        {label}
      </p>

      <p className="mt-1 break-words text-base font-medium text-slate-700">
        {value || "-"}
      </p>
    </div>
  );
}
