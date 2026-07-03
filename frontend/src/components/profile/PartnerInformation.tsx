"use client";

import { useCustomerProfileStore } from "@/store/customerProfileStore";

export default function PartnerInformation() {
  const profile =
    useCustomerProfileStore(
      (state) => state.profile
    );

  if (!profile) {
    return null;
  }

  return (
    <section className="rounded-3xl border border-gray-200 bg-white p-7 shadow-sm">

      <h2 className="text-2xl font-bold text-rose-500">
        Partner Information
      </h2>

      <div className="mt-8 space-y-6 text-rose-400">

        <Info
          label="Partner Name"
          value={
            profile.partnerName ||
            "Not Provided"
          }
        />

        <Info
          label="Email"
          value={
            profile.partnerEmail ||
            "Not Provided"
          }
        />

        <Info
          label="Phone"
          value={
            profile.partnerPhone ||
            "Not Provided"
          }
        />

        <Info
          label="Occupation"
          value={
            profile.partnerOccupation ||
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