"use client";

import { useCustomerProfileData } from "@/hooks/useCustomerProfileData";

export default function PersonalInformation() {
  const { user, personal } =
    useCustomerProfileData();

  if (!user) {
    return null;
  }

  return (
    <section className="rounded-3xl border border-[#ffb3bf] bg-[linear-gradient(145deg,#fffdf0_0%,#fff8d8_100%)] p-7 shadow-md shadow-[#ff4d6d]/10">

      <h2 className="text-2xl font-bold text-[#ff4d6d]">
        Personal Information
      </h2>

      <div className="mt-8 space-y-6 text-[#ff8fa1]">

        <Info
          label="Full Name"
          value={personal.fullName}
        />

        <Info
          label="Email"
          value={personal.email}
        />

        <Info
          label="Phone"
          value={personal.phone}
        />

        <Info
          label="Gender"
          value={
            personal.gender ||
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

      <p className="text-sm text-[#8d6171]">
        {label}
      </p>

      <p className="mt-1 font-semibold text-[#6c2d45]">
        {value}
      </p>

    </div>
  );
}
