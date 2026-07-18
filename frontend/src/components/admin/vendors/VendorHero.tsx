"use client";

import { motion } from "framer-motion";
import { Plus, ShieldCheck } from "lucide-react";

export default function VendorHero({ onAddVendor }: { onAddVendor?: () => void }) {
  return (
    <motion.section
      initial={{
        opacity: 0,
        y: 20,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.4,
      }}
      className="rounded-[32px] bg-gradient-to-r from-slate-800 via-blue-700 to-slate-900 p-8 text-white shadow-xl"
    >
      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
        <div>
        <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 backdrop-blur">
          <ShieldCheck size={16} />

          Vendor Management
        </div>

        <h1 className="mt-5 text-5xl font-bold">
          Manage
          <br />
          Platform Vendors
        </h1>

        <p className="mt-5 max-w-2xl text-slate-200">
          Approve new vendors, review business details,
          manage registrations and monitor vendor activity
          across the platform.
        </p>
        </div>

        {onAddVendor && (
          <button
            type="button"
            onClick={onAddVendor}
            className="inline-flex items-center justify-center gap-2 self-start rounded-2xl bg-white px-6 py-3 font-bold text-blue-800 shadow-lg transition hover:-translate-y-0.5 hover:bg-blue-50 md:self-center"
          >
            <Plus size={20} /> Add Vendor
          </button>
        )}
      </div>
    </motion.section>
  );
}
