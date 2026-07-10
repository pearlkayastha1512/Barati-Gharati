"use client";

import { motion } from "framer-motion";
import {
  Settings,
  ShieldCheck,
  Clock3,
  XCircle,
  MapPin,
  BriefcaseBusiness,
} from "lucide-react";

import { useVendorProfile } from "@/hooks/useVendorProfile";

export default function SettingsHero() {
  const { vendor, isLoading } = useVendorProfile();

  if (isLoading || !vendor) {
    return null;
  }

  const approved =
    vendor.approvalStatus === "approved";

  const pending =
    vendor.approvalStatus === "pending";

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="overflow-hidden rounded-[32px] bg-gradient-to-r from-[#e4005a] via-[#c90055] to-[#ffb703] p-8 text-white shadow-xl"
    >
      <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">

        <div>

          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 backdrop-blur">

            <Settings size={16} />

            Vendor Settings

          </div>

          <h1 className="mt-6 text-4xl font-bold lg:text-5xl">
            {vendor.businessName}
          </h1>

          <p className="mt-3 max-w-2xl text-slate-200">
            Manage your business preferences,
            notifications and security settings.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">

            <span className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm">

              <BriefcaseBusiness size={16} />

              {vendor.category}

            </span>

            <span className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm">

              <MapPin size={16} />

              {vendor.city}

            </span>

            <span
              className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm ${
                approved
                  ? "bg-green-500/20 text-green-100"
                  : pending
                  ? "bg-amber-500/20 text-amber-100"
                  : "bg-red-500/20 text-red-100"
              }`}
            >
              {approved ? (
                <ShieldCheck size={16} />
              ) : pending ? (
                <Clock3 size={16} />
              ) : (
                <XCircle size={16} />
              )}

              {approved
                ? "Verified Vendor"
                : pending
                ? "Pending Approval"
                : "Rejected"}

            </span>

          </div>

        </div>

        <div className="grid w-full gap-5 md:grid-cols-2 lg:w-96">

          <Card
            title="Business Status"
            value={
              vendor.isActive
                ? "Active"
                : "Inactive"
            }
          />

          <Card
            title="Approval"
            value={
              approved
                ? "Approved"
                : pending
                ? "Pending"
                : "Rejected"
            }
          />

          <Card
            title="Joined"
            value={String(
              new Date(
                vendor.createdAt
              ).getFullYear()
            )}
          />

          <Card
            title="Last Updated"
            value={new Date(
              vendor.updatedAt
            ).toLocaleDateString("en-IN")}
          />

        </div>

      </div>
    </motion.section>
  );
}

function Card({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  return (
    <div className="rounded-3xl bg-white/10 p-5 backdrop-blur">

      <p className="text-sm text-slate-300">
        {title}
      </p>

      <h3 className="mt-2 text-2xl font-bold">
        {value}
      </h3>

    </div>
  );
}
