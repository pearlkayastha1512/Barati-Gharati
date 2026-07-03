"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import { useAuthStore } from "@/store/authStore";

import {
  getVendorByUserId,
  updateVendor,
  StoredVendor,
} from "@/services/vendor.service";

export default function DangerZone() {
  const { user } = useAuthStore();

  const [vendor, setVendor] =
    useState<StoredVendor | null>(null);

  const [loading, setLoading] =
    useState(false);

  useEffect(() => {
    if (!user) return;

    const vendorData = getVendorByUserId(user._id);

    if (vendorData) {
      setVendor(vendorData);
    }
  }, [user]);

  const handleDeactivate = () => {
    if (!vendor) return;

    if (!vendor.isActive) {
      toast.info("Business is already deactivated.");
      return;
    }

    setLoading(true);

    const updatedVendor: StoredVendor = {
      ...vendor,
      isActive: false,
    };

    updateVendor(updatedVendor);

    setVendor(updatedVendor);

    toast.success("Business has been deactivated.");

    setLoading(false);
  };

  return (
    <section className="rounded-3xl border border-red-200 bg-red-50 p-8">
      <h2 className="text-2xl font-bold text-red-600">
        Danger Zone
      </h2>

      <p className="mt-4 text-gray-600">
        These actions affect your business visibility on the platform.
      </p>

      <div className="mt-6 flex items-center gap-3">
        <span className="text-sm font-medium text-gray-600">
          Current Status:
        </span>

        <span
          className={`rounded-full px-3 py-1 text-sm font-semibold ${
            vendor?.isActive
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {vendor?.isActive ? "Active" : "Inactive"}
        </span>
      </div>

      <div className="mt-8 flex flex-wrap gap-4">
        <button
          disabled
          className="cursor-not-allowed rounded-2xl bg-red-300 px-6 py-3 font-semibold text-white"
        >
          Delete Account
          <span className="ml-2 text-xs">
            (Coming Soon)
          </span>
        </button>

        <button
          onClick={handleDeactivate}
          disabled={
            loading || !vendor?.isActive
          }
          className="rounded-2xl border border-red-300 px-6 py-3 font-semibold text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading
            ? "Updating..."
            : vendor?.isActive
            ? "Deactivate Business"
            : "Business Deactivated"}
        </button>
      </div>
    </section>
  );
}