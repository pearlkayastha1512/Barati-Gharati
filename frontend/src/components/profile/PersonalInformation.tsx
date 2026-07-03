"use client";

import { useAuthStore } from "@/store/authStore";
import { useCustomerProfileStore } from "@/store/customerProfileStore";

export default function PersonalInformation() {
  const user = useAuthStore(
    (state) => state.user
  );

  const profile =
    useCustomerProfileStore(
      (state) => state.profile
    );

  if (!user || !profile) {
    return null;
  }

  return (
    <section className="rounded-3xl border border-gray-200 bg-white p-7 shadow-sm">

      <h2 className="text-2xl font-bold text-rose-500">
        Personal Information
      </h2>

      <div className="mt-8 space-y-6 text-rose-400">

        <Info
          label="Full Name"
          value={user.name}
        />

        <Info
          label="Email"
          value={user.email}
        />

        <Info
          label="Phone"
          value={user.phone}
        />

        <Info
          label="Gender"
          value={
            profile.gender ||
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