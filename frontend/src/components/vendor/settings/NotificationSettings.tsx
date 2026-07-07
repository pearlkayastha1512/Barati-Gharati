"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import { useVendorProfile } from "@/hooks/useVendorProfile";
import {
  updateVendor,
  StoredVendor,
} from "@/services/vendor.service";

export default function NotificationSettings() {
  const { vendor, isLoading } = useVendorProfile();

  const [loading, setLoading] =
    useState(false);

  if (isLoading || !vendor) return null;

  const toggle = (
    field:
      | "newBookingNotifications"
      | "paymentAlerts"
      | "customerMessages"
      | "marketingEmails"
  ) => {
    setVendor({
      ...vendor,

      settings: {
        ...vendor.settings,

        notifications: {
          ...vendor.settings.notifications,

          [field]:
            !vendor.settings.notifications[field],
        },
      },
    });
  };

  const handleSave = () => {
    setLoading(true);

    updateVendor(vendor);

    toast.success(
      "Notification settings updated successfully."
    );

    setLoading(false);
  };

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">

      <h2 className="text-2xl font-bold text-gray-800">
        Notifications
      </h2>

      <p className="mt-2 text-sm text-slate-500">
        Choose which notifications you want to receive.
      </p>

      <div className="mt-8 space-y-5">

        <Toggle
          title="New Booking Notifications"
          description="Receive alerts whenever a customer books your service."
          checked={
            vendor.settings.notifications
              .newBookingNotifications
          }
          onChange={() =>
            toggle("newBookingNotifications")
          }
        />

        <Toggle
          title="Payment Alerts"
          description="Get notified whenever a payment is received."
          checked={
            vendor.settings.notifications
              .paymentAlerts
          }
          onChange={() =>
            toggle("paymentAlerts")
          }
        />

        <Toggle
          title="Customer Messages"
          description="Receive notifications for new customer chats."
          checked={
            vendor.settings.notifications
              .customerMessages
          }
          onChange={() =>
            toggle("customerMessages")
          }
        />

        <Toggle
          title="Marketing Emails"
          description="Receive promotional offers and platform updates."
          checked={
            vendor.settings.notifications
              .marketingEmails
          }
          onChange={() =>
            toggle("marketingEmails")
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