"use client";

import { useCustomerProfileData } from "@/hooks/useCustomerProfileData";

export default function ContactInformation() {
  const { user, contact } =
    useCustomerProfileData();

  if (!user) {
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
            contact.address ||
            "Not Provided"
          }
        />

        <Info
          label="City"
          value={
            contact.city ||
            "Not Provided"
          }
        />

        <Info
          label="State"
          value={
            contact.state ||
            "Not Provided"
          }
        />

        <Info
          label="Country"
          value={
            contact.country ||
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
