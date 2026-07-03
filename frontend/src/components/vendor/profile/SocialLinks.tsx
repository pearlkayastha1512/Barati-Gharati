"use client";

import {
  Globe,
  MapPin,
  Mail,
  Phone,
} from "lucide-react";

import { useAuthStore } from "@/store/authStore";
import { getVendorByUserId } from "@/services/vendor.service";

export default function SocialLinks() {
  const { user } = useAuthStore();

  const vendor = user
    ? getVendorByUserId(user._id)
    : null;

  if (!vendor) {
    return null;
  }

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">

      <h2 className="text-2xl font-bold text-slate-900">
        Business Contact
      </h2>

      <p className="mt-2 text-sm text-slate-500">
        Public contact information visible to customers.
      </p>

      <div className="mt-8 space-y-5">

        <Row
          icon={
            <Globe
              size={18}
              className="text-blue-600"
            />
          }
          label="Business Name"
          value={vendor.businessName}
        />

        <Row
          icon={
            <MapPin
              size={18}
              className="text-red-500"
            />
          }
          label="Address"
          value={vendor.address}
        />

        <Row
          icon={
            <Mail
              size={18}
              className="text-emerald-600"
            />
          }
          label="Email"
          value={vendor.email}
        />

        <Row
          icon={
            <Phone
              size={18}
              className="text-violet-600"
            />
          }
          label="Phone"
          value={vendor.phone}
        />

      </div>

    </section>
  );
}

function Row({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between border-b border-slate-100 pb-4">

      <div className="flex items-center gap-3">

        {icon}

        <span className="text-slate-600">
          {label}
        </span>

      </div>

      <span className="max-w-[60%] text-right font-medium text-slate-900">
        {value}
      </span>

    </div>
  );
}