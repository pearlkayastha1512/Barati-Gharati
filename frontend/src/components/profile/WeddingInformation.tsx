"use client";

import { useCustomerProfileStore } from "@/store/customerProfileStore";

export default function WeddingInformation() {
  const profile = useCustomerProfileStore(
    (state) => state.profile
  );

  if (!profile) {
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
            profile.weddingDate
              ? new Date(
                  profile.weddingDate
                ).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })
              : "Not Provided"
          }
        />

        <Info
          label="Venue"
          value={
            profile.weddingVenue ||
            "Not Provided"
          }
        />

        <Info
          label="Guests"
          value={
            profile.guestCount > 0
              ? profile.guestCount.toString()
              : "Not Provided"
          }
        />

        <Info
          label="Theme"
          value={
            profile.weddingTheme ||
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