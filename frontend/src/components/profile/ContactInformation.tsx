"use client";

import { useCustomerProfileStore } from "@/store/customerProfileStore";

export default function ContactInformation() {
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
        Contact Information
      </h2>

      <div className="mt-8 space-y-6 text-rose-400">

        <Info
          label="Address"
          value={
            profile.address ||
            "Not Provided"
          }
        />

        <Info
          label="City"
          value={
            profile.city ||
            "Not Provided"
          }
        />

        <Info
          label="State"
          value={
            profile.state ||
            "Not Provided"
          }
        />

        <Info
          label="Country"
          value={
            profile.country ||
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