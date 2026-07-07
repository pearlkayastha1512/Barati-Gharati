"use client";

import { useCustomerProfileData } from "@/hooks/useCustomerProfileData";

export default function WeddingInformation() {
  const { user, wedding } =
    useCustomerProfileData();

  if (!user) {
    return null;
  }

  return (
    <section className="rounded-3xl border border-gray-200 bg-white p-7 shadow-sm">

      <h2 className="text-2xl font-bold text-rose-500">
        Wedding Information
      </h2>

      <div className="mt-8 space-y-6 text-rose-400">

        <Info
          label="Wedding Date"
          value={
            wedding.formattedDate ||
            "Not Provided"
          }
        />

        <Info
          label="Venue"
          value={
            wedding.venue ||
            "Not Provided"
          }
        />

        <Info
          label="Guests"
          value={
            wedding.guests > 0
              ? wedding.guests.toString()
              : "Not Provided"
          }
        />

        <Info
          label="Theme"
          value={
            wedding.theme ||
            "Not Provided"
          }
        />

      </div>

    </section>
  );
}

function Info({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>

      <p className="text-sm text-gray-500">
        {label}
      </p>

      <p className="mt-1 font-semibold text-gray-700">
        {value}
      </p>

    </div>
  );
}
