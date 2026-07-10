"use client";

import { useState } from "react";

import EditVendorProfileModal from "./EditVendorProfileModal";

import { useVendorProfile } from "@/hooks/useVendorProfile";

import { ShieldCheck } from "lucide-react";

export default function BusinessProfileCard() {
  const { vendor, isLoading } = useVendorProfile();

  const [open, setOpen] = useState(false);

  if (isLoading || !vendor) {
    return null;
  }

  if (!vendor) return null;

  return (
    <>
      <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">

        <div className="flex flex-col items-center gap-6 md:flex-row">

          <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-full bg-gradient-to-r from-[#e4005a] to-[#ffb703]">

            {vendor.profileImage ? (
              <img
                src={vendor.profileImage}
                alt={vendor.businessName}
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="text-4xl font-bold text-white">
                {vendor.businessName.charAt(0)}
              </span>
            )}

          </div>

          <div className="flex-1">

            <h2 className="text-3xl font-bold text-slate-900">
              {vendor.businessName}
            </h2>

            <p className="mt-2 text-slate-500">
              {vendor.category}
            </p>

            <div className="mt-5 flex flex-wrap gap-3">

             <span
  className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm text-gray-700  ${
    vendor.approvalStatus === "approved"
      ? "bg-emerald-500/20 text-emerald-100"
      : vendor.approvalStatus === "rejected"
      ? "bg-red-500/20 text-red-100"
      : "bg-amber-500/20 text-amber-100"
  }`}
>
  <ShieldCheck size={16} />

  {vendor.approvalStatus === "approved"
    ? "Verified Vendor"
    : vendor.approvalStatus === "rejected"
    ? "Verification Rejected"
    : "Verification Pending"}
</span>

              <span className="rounded-full bg-slate-100 px-4 py-2 text-sm text-slate-700">
                Since{" "}
                {new Date(
                  vendor.createdAt
                ).getFullYear()}
              </span>

            </div>

          </div>

          <button
            onClick={() => setOpen(true)}
            className="rounded-2xl bg-[#e4005a] px-6 py-3 font-semibold text-white transition hover:bg-[#c8004e]"
          >
            Edit Profile
          </button>

        </div>

      </section>

      <EditVendorProfileModal
        open={open}
        onClose={() => setOpen(false)}
      />
    </>
  );
}