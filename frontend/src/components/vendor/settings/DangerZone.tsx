"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import { useVendorProfile } from "@/hooks/useVendorProfile";
import {
  updateVendor,
  StoredVendor,
} from "@/services/vendor.service";

export default function DangerZone() {
  const { vendor, isLoading } = useVendorProfile();

  const [loading, setLoading] =
    useState(false);

  if (isLoading || !vendor) return null;

  const handleToggleBusiness = () => {
    setLoading(true);

    const updatedVendor: StoredVendor = {
      ...vendor,

      isActive: !vendor.isActive,

      updatedAt: new Date().toISOString(),
    };

    updateVendor(updatedVendor);

    setVendor(updatedVendor);

    toast.success(
      updatedVendor.isActive
        ? "Business activated successfully."
        : "Business deactivated successfully."
    );

    setLoading(false);
  };

  return (
    <section className="rounded-3xl border border-red-200 bg-red-50 p-8">

      <h2 className="text-2xl font-bold text-red-600">
        Danger Zone
      </h2>

      <p className="mt-3 text-gray-600 leading-7">
        Deactivating your business hides it from customers.
        Existing bookings remain unaffected.
      </p>

      <div className="mt-8 flex items-center justify-between rounded-2xl border border-red-100 bg-white p-5">

        <div>

          <p className="font-semibold text-gray-800">
            Business Status
          </p>

          <p className="mt-1 text-sm text-gray-500">
            Customers can only book active businesses.
          </p>

        </div>

        <span
          className={`rounded-full px-4 py-2 text-sm font-semibold ${
            vendor.isActive
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {vendor.isActive
            ? "Active"
            : "Inactive"}
        </span>

      </div>

      <div className="mt-8 flex flex-wrap gap-4">

        <button
          onClick={handleToggleBusiness}
          disabled={loading}
          className={`rounded-2xl px-6 py-3 font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-60 ${
            vendor.isActive
              ? "bg-red-600 hover:bg-red-700"
              : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {loading
            ? "Updating..."
            : vendor.isActive
            ? "Deactivate Business"
            : "Activate Business"}
        </button>

      </div>

    </section>
  );
}