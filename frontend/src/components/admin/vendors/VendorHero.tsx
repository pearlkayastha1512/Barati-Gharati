"use client";

import { motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";

export default function VendorHero() {
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
    </motion.section>
  );
}