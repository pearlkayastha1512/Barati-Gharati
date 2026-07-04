"use client";

import { X } from "lucide-react";
import { User } from "@/types/auth";

interface Props {
  customer: User | null;

  open: boolean;

  onClose: () => void;
}

export default function CustomerDetailsModal({
  customer,
  open,
  onClose,
}: Props) {
  if (!open || !customer) {
    return null;
  }

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

          <div className="flex justify-end">

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