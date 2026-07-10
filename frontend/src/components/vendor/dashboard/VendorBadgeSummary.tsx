"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Award,
  ChevronRight,
  Sparkles,
  TrendingUp,
} from "lucide-react";

import { useVendorProfile } from "@/hooks/useVendorProfile";
import {
  VENDOR_BADGE_LABELS,
} from "@/constants/vendor-badges";
import { VendorBadge } from "@/constants/vendor-badges";
import VendorBadgeUpgradeModal from "./VendorBadgeUpgradeModal";

const badgeStyles: Record<
  VendorBadge,
  {
    shell: string;
    glow: string;
    chip: string;
    emblem: string;
    meter: string;
    text: string;
    muted: string;
    cta: string;
  }
> = {
  bronze: {
    shell:
      "border-[#ffb703]/35 bg-[linear-gradient(135deg,#fff8ef_0%,#ffe3af_45%,#e4005a_100%)]",
    glow: "bg-[#ffc43d]/60",
    chip: "bg-white/45 text-[#5b243a]",
    emblem:
      "border-[#ffd37a]/80 bg-[linear-gradient(145deg,#ffb703,#e4005a)] text-white shadow-[#e4005a]/25",
    meter: "bg-[linear-gradient(90deg,#e4005a,#ffb703)]",
    text: "text-[#4d1730]",
    muted: "text-[#6d4052]",
    cta: "bg-[#e4005a] text-white hover:bg-[#c8004e]",
  },
  silver: {
    shell:
      "border-[#e4005a]/25 bg-[linear-gradient(135deg,#fff8ef_0%,#fff0bf_45%,#e4005a_100%)]",
    glow: "bg-[#e4005a]/25",
    chip: "bg-white/50 text-[#4d1730]",
    emblem:
      "border-white/70 bg-[linear-gradient(145deg,#ffffff,#e4005a)] text-[#4d1730] shadow-[#e4005a]/20",
    meter: "bg-[linear-gradient(90deg,#e4005a,#ffb703)]",
    text: "text-[#4d1730]",
    muted: "text-[#4d1730]/75",
    cta: "bg-[#e4005a] text-white hover:bg-[#c8004e]",
  },
  gold: {
    shell:
      "border-[#ffb703]/40 bg-[linear-gradient(135deg,#fff8ef_0%,#ffd36a_45%,#e4005a_100%)]",
    glow: "bg-[#ffc43d]/75",
    chip: "bg-white/45 text-[#5b243a]",
    emblem:
      "border-[#fff1b8] bg-[linear-gradient(145deg,#fff0bf,#ffb703,#e4005a)] text-white shadow-[#b00045]/25",
    meter: "bg-[linear-gradient(90deg,#b00045,#ffb703)]",
    text: "text-[#4d1730]",
    muted: "text-[#6d4052]",
    cta: "bg-[#4d1730] text-white hover:bg-[#6f1f43]",
  },
};

export default function VendorBadgeSummary() {
  const { vendor, isLoading } = useVendorProfile();
  const [upgradeOpen, setUpgradeOpen] =
    useState(false);

  if (isLoading || !vendor) {
    return null;
  }

  const remaining = Math.max(
    vendor.monthlyBookingLimit -
      vendor.currentMonthBookings,
    0
  );

  const usage =
    vendor.monthlyBookingLimit === 0
      ? 0
      : Math.min(
          Math.round(
            (vendor.currentMonthBookings /
              vendor.monthlyBookingLimit) *
              100
          ),
          100
        );

  const styles = badgeStyles[vendor.badge];

  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className={`relative overflow-hidden rounded-[30px] border p-8 shadow-xl ${styles.shell}`}
    >
      <motion.div
        aria-hidden
        className="absolute inset-y-0 -left-1/3 w-1/3 skew-x-[-18deg] bg-white/25"
        animate={{ x: ["0%", "430%"] }}
        transition={{
          duration: 4,
          repeat: Infinity,
          repeatDelay: 2.8,
          ease: "easeInOut",
        }}
      />

      <div className="relative grid gap-8 xl:grid-cols-[1.1fr_0.9fr] xl:items-center">
        <div className="flex flex-col gap-6 md:flex-row md:items-center">
          <motion.div
            animate={{
              rotate: [-3, 3, -3],
              scale: [1, 1.04, 1],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className={`relative flex h-32 w-32 shrink-0 items-center justify-center rounded-[28px] border text-5xl shadow-2xl ${styles.emblem}`}
          >
            <div
              className={`absolute -inset-3 -z-10 rounded-[34px] blur-2xl ${styles.glow}`}
            />
            <Award size={58} strokeWidth={1.8} />
          </motion.div>

          <div>
            <div
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold ${styles.chip}`}
            >
              <Sparkles size={16} />
              Vendor Badge
            </div>

            <h2
              className={`mt-4 text-5xl font-black ${styles.text}`}
            >
              {VENDOR_BADGE_LABELS[vendor.badge]} Plan
            </h2>

            <p
              className={`mt-3 max-w-2xl text-base font-medium ${styles.muted}`}
            >
              This badge lets you receive up to{" "}
              <span className="font-black">
                {vendor.monthlyBookingLimit}
              </span>{" "}
              bookings this month.
            </p>

            <button
              onClick={() => setUpgradeOpen(true)}
              className={`mt-6 inline-flex items-center gap-2 rounded-2xl px-5 py-3 text-sm font-bold transition ${styles.cta}`}
            >
              Upgrade Badge
              <ChevronRight size={17} />
            </button>
          </div>
        </div>

        <div className="rounded-[26px] border border-white/45 bg-white/55 p-6 shadow-lg backdrop-blur">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p
                className={`text-sm font-bold ${styles.muted}`}
              >
                Monthly Usage
              </p>

              <p
                className={`mt-2 text-6xl font-black ${styles.text}`}
              >
                {vendor.currentMonthBookings}
                <span className="text-3xl font-black opacity-55">
                  /{vendor.monthlyBookingLimit}
                </span>
              </p>
            </div>

            <div
              className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-black ${styles.chip}`}
            >
              <TrendingUp size={16} />
              {remaining} left
            </div>
          </div>

          <div className="mt-7 h-4 overflow-hidden rounded-full bg-white/70 shadow-inner">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${usage}%` }}
              transition={{
                duration: 0.8,
                ease: "easeOut",
              }}
              className={`h-full rounded-full ${styles.meter}`}
            />
          </div>

          <div
            className={`mt-4 flex items-center justify-between text-sm font-semibold ${styles.muted}`}
          >
            <span>{usage}% used</span>
            <span>
              Resets monthly
            </span>
          </div>
        </div>
      </div>

      <VendorBadgeUpgradeModal
        open={upgradeOpen}
        currentBadge={vendor.badge}
        onClose={() => setUpgradeOpen(false)}
        onUpgraded={() => {
          window.dispatchEvent(
            new Event("vendor-profile-updated")
          );
        }}
      />
    </motion.section>
  );
}
