"use client";

import { useEffect, useState } from "react";

import { useAuthStore } from "@/store/authStore";

import {
  getVendorByUserId,
  StoredVendor,
} from "@/services/vendor.service";

export default function AccountSettings() {
  const { user } = useAuthStore();

  const [vendor, setVendor] =
    useState<StoredVendor | null>(null);

  useEffect(() => {
    if (!user) return;

    const vendorData = getVendorByUserId(user._id);

    if (vendorData) {
      setVendor(vendorData);
    }
  }, [user]);

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
      <h2 className="text-2xl font-bold text-gray-800">
        Account
      </h2>

      <div className="mt-8 space-y-4">
        <input
          type="text"
          placeholder="Business Name"
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-gray-700 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
          value={vendor?.businessName ?? ""}
          readOnly
        />

        <input
          type="email"
          placeholder="Email"
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-gray-700 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
          value={vendor?.email ?? ""}
          readOnly
        />

        <input
          type="tel"
          placeholder="Phone Number"
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-gray-700 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
          value={vendor?.phone ?? ""}
          readOnly
        />
      </div>
    </section>
  );
}