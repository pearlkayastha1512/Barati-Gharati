"use client";

import { useAuthStore } from "@/store/authStore";
import { getVendorByUserId } from "@/services/vendor.service";

import {
  User,
  Mail,
  Phone,
  BriefcaseBusiness,
  CalendarDays,
} from "lucide-react";

export default function OwnerInformation() {
  const { user } = useAuthStore();

  const vendor = user
    ? getVendorByUserId(user._id)
    : null;

  if (!user || !vendor) {
    return null;
  }

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">

      <h2 className="text-2xl font-bold text-slate-900">
        Owner Information
      </h2>

      <div className="mt-8 space-y-6">

        <Row
          icon={
            <User
              size={18}
              className="text-blue-600"
            />
          }
          label="Owner Name"
          value={vendor.ownerName}
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

        <Row
          icon={
            <BriefcaseBusiness
              size={18}
              className="text-orange-600"
            />
          }
          label="Business Name"
          value={vendor.businessName}
        />

        <Row
          icon={
            <CalendarDays
              size={18}
              className="text-red-500"
            />
          }
          label="Member Since"
          value={new Date(
            vendor.createdAt
          ).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
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

      <span className="font-semibold text-slate-900">
        {value}
      </span>

    </div>
  );
}