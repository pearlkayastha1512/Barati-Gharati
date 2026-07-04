"use client";

import { X } from "lucide-react";

import { Email } from "@/types/email";

interface Props {
  email: Email | null;

  open: boolean;

  onClose: () => void;
}

export default function EmailDetailsModal({
  email,
  open,
  onClose,
}: Props) {
  if (!open || !email) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-6">
      <div className="w-full max-w-3xl rounded-3xl bg-white shadow-2xl">

        {/* Header */}

        <div className="flex items-center justify-between border-b border-slate-200 p-6">

          <h2 className="text-3xl font-bold text-slate-900">
            Email Details
          </h2>

          <button
            onClick={onClose}
            className="rounded-xl p-2 transition hover:bg-slate-100 text-gray-600"
          >
            <X />
          </button>

        </div>

        {/* Body */}

        <div className="space-y-6 p-8">

          <Info
            label="To"
            value={email.to}
          />

          <Info
            label="Subject"
            value={email.subject}
          />

          <Info
            label="Status"
            value={email.status}
          />

          <Info
            label="Sent At"
            value={new Date(
              email.createdAt
            ).toLocaleString()}
          />

          <div>
            <p className="text-sm font-medium text-slate-500">
              Message
            </p>

            <div className="mt-2 rounded-2xl bg-slate-50 p-5 whitespace-pre-wrap text-slate-700 leading-7">
              {email.message}
            </div>
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