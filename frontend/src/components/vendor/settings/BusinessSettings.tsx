"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import { useVendorProfile } from "@/hooks/useVendorProfile";
import {
  updateVendor,
  StoredVendor,
} from "@/services/vendor.service";

export default function BusinessSettings() {
  const { vendor, isLoading } = useVendorProfile();

  const [loading, setLoading] =
    useState(false);

  if (isLoading || !vendor) return null;

  const toggleBusinessSetting = (
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

  const toggleVisibility = () => {
    setVendor({
      ...vendor,

      isActive: !vendor.isActive,
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

      <p className="mt-2 text-sm text-slate-500">
        Control how your business appears on Wedding Planner.
      </p>

      <div className="mt-8 space-y-6">

        <Toggle
          title="Business Visibility"
          description="Show your business to customers."
          checked={vendor.isActive}
          onChange={toggleVisibility}
        />

        <Toggle
          title="Accept New Bookings"
          description="Allow customers to send new booking requests."
          checked={
            vendor.settings.business
              .acceptNewBookings
          }
          onChange={() =>
            toggleBusinessSetting(
              "acceptNewBookings"
            )
          }
        />

        <Toggle
          title="Display Pricing Publicly"
          description="Show service prices on your public profile."
          checked={
            vendor.settings.business
              .displayPricingPublicly
          }
          onChange={() =>
            toggleBusinessSetting(
              "displayPricingPublicly"
            )
          }
        />

        <Toggle
          title="Availability Calendar"
          description="Display your available dates to customers."
          checked={
            vendor.settings.business
              .showAvailabilityCalendar
          }
          onChange={() =>
            toggleBusinessSetting(
              "showAvailabilityCalendar"
            )
          }
        />

      </div>

      <button
        onClick={handleSave}
        disabled={loading}
        className="mt-8 w-full rounded-2xl bg-blue-700 py-3 font-semibold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading
          ? "Saving..."
          : "Save Changes"}
      </button>

    </section>
  );
}

interface ToggleProps {
  title: string;

  description: string;

  checked: boolean;

  onChange: () => void;
}

function Toggle({
  title,
  description,
  checked,
  onChange,
}: ToggleProps) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-slate-200 p-5">

      <div>

        <h3 className="font-semibold text-slate-800">
          {title}
        </h3>

        <p className="mt-1 text-sm text-slate-500">
          {description}
        </p>

      </div>

      <button
        onClick={onChange}
        className={`relative h-7 w-14 rounded-full transition ${
          checked
            ? "bg-blue-700"
            : "bg-slate-300"
        }`}
      >
        <span
          className={`absolute top-1 h-5 w-5 rounded-full bg-white transition ${
            checked
              ? "right-1"
              : "left-1"
          }`}
        />
      </button>

    </div>
  );
}