"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import { useAuthStore } from "@/store/authStore";

import {
  getVendorByUserId,
  updateVendor,
  StoredVendor,
} from "@/services/vendor.service";

export default function BusinessSettings() {
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

  if (!vendor) return null;

  const handleToggle = (
    field:
      | "acceptNewBookings"
      | "displayPricingPublicly"
      | "showAvailabilityCalendar"
  ) => {
    setVendor({
      ...vendor,

      settings: {
        ...vendor.settings,

        business: {
          ...vendor.settings.business,

          [field]:
            !vendor.settings.business[field],
        },
      },
    });
  };

  const handleSave = () => {
    if (!vendor) return;

    setLoading(true);

    updateVendor(vendor);

    toast.success(
      "Business settings updated successfully."
    );

    setLoading(false);
  };

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
      <h2 className="text-2xl font-bold text-gray-800">
        Business Settings
      </h2>

      <div className="mt-8 space-y-6">
        <label className="flex items-center justify-between">
          <span className="text-gray-700">
            Accept New Bookings
          </span>

          <input
            type="checkbox"
            checked={
              vendor.settings.business
                .acceptNewBookings
            }
            onChange={() =>
              handleToggle(
                "acceptNewBookings"
              )
            }
            className="h-5 w-5 rounded border-slate-300 text-blue-600 focus:ring-2 focus:ring-blue-100"
          />
        </label>

        <label className="flex items-center justify-between">
          <span className="text-gray-700">
            Display Pricing Publicly
          </span>

          <input
            type="checkbox"
            checked={
              vendor.settings.business
                .displayPricingPublicly
            }
            onChange={() =>
              handleToggle(
                "displayPricingPublicly"
              )
            }
            className="h-5 w-5 rounded border-slate-300 text-blue-600 focus:ring-2 focus:ring-blue-100"
          />
        </label>

        <label className="flex items-center justify-between">
          <span className="text-gray-700">
            Show Availability Calendar
          </span>

          <input
            type="checkbox"
            checked={
              vendor.settings.business
                .showAvailabilityCalendar
            }
            onChange={() =>
              handleToggle(
                "showAvailabilityCalendar"
              )
            }
            className="h-5 w-5 rounded border-slate-300 text-blue-600 focus:ring-2 focus:ring-blue-100"
          />
        </label>

        <button
          onClick={handleSave}
          disabled={loading}
          className="w-full rounded-2xl bg-blue-700 py-3 font-semibold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading
            ? "Saving..."
            : "Save Changes"}
        </button>
      </div>
    </section>
  );
}