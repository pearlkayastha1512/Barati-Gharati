"use client";

import { motion } from "framer-motion";
import {
  UserCircle2,
  MapPin,
  ShieldCheck,
  Star,
} from "lucide-react";

import { useAuthStore } from "@/store/authStore";
import { getVendorByUserId } from "@/services/vendor.service";

export default function ProfileHero() {
  const { user } = useAuthStore();

  const vendor = user
    ? getVendorByUserId(user._id)
    : null;

  if (!vendor) {
    return null;
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="overflow-hidden rounded-[32px] bg-gradient-to-r from-blue-700 via-indigo-700 to-slate-800 p-8 text-white shadow-xl"
    >
      <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">

        <div className="flex items-center gap-6">

          <div className="flex h-28 w-28 items-center justify-center rounded-full bg-white/20 text-4xl font-bold backdrop-blur">
            {vendor.profileImage ? (
              <img
                src={vendor.profileImage}
                alt={vendor.businessName}
                className="h-full w-full rounded-full object-cover"
              />
            ) : (
              vendor.businessName.charAt(0).toUpperCase()
            )}
          </div>

          <div>

            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2">

              <UserCircle2 size={16} />

              Vendor Profile

            </div>

            <h1 className="mt-5 text-4xl font-bold lg:text-5xl">
              {vendor.businessName}
            </h1>

            <p className="mt-3 max-w-2xl text-slate-200">
              {vendor.description}
            </p>

            <div className="mt-6 flex flex-wrap gap-3">

              <span className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm">

                <MapPin size={16} />

                {vendor.city}

              </span>

              <span className="rounded-full bg-white/10 px-4 py-2 text-sm">
                {vendor.category}
              </span>

              <span className="flex items-center gap-2 rounded-full bg-emerald-500/20 px-4 py-2 text-sm text-emerald-100">

                <ShieldCheck size={16} />

                {vendor.isApproved
                  ? "Verified Vendor"
                  : "Verification Pending"}

              </span>

            </div>

          </div>

        </div>

        <div className="grid grid-cols-2 gap-5 lg:w-80">

          <div className="rounded-3xl bg-white/10 p-5 backdrop-blur">

            <p className="text-sm text-slate-300">
              Rating
            </p>

            <div className="mt-2 flex items-center gap-2">

              <Star
                size={18}
                fill="currentColor"
                className="text-yellow-400"
              />

              <span className="text-3xl font-bold">
                4.9
              </span>

            </div>

          </div>

          <div className="rounded-3xl bg-white/10 p-5 backdrop-blur">

            <p className="text-sm text-slate-300">
              Reviews
            </p>

            <h3 className="mt-2 text-3xl font-bold">
              0
            </h3>

          </div>

          <div className="rounded-3xl bg-white/10 p-5 backdrop-blur">

            <p className="text-sm text-slate-300">
              City
            </p>

            <h3 className="mt-2 text-xl font-bold">
              {vendor.city}
            </h3>

          </div>

          <div className="rounded-3xl bg-white/10 p-5 backdrop-blur">

            <p className="text-sm text-slate-300">
              Joined
            </p>

            <h3 className="mt-2 text-xl font-bold">
              {new Date(
                vendor.createdAt
              ).getFullYear()}
            </h3>

          </div>

        </div>

      </div>
    </motion.section>
  );
}