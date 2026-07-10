"use client";

import { motion } from "framer-motion";
import { BarChart3 } from "lucide-react";

export default function AnalyticsHero() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-[32px] bg-gradient-to-r from-[#e4005a] via-[#c90055] to-[#ffb703] p-8 shadow-xl"
    >
      <div>
        <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-gray-100">
          <BarChart3 size={16} />
          Analytics Dashboard
        </div>

        <h1 className="mt-5 text-5xl font-bold text-gray-100">
          Measure your
          <br />
          business growth.
        </h1>

        <p className="mt-5 max-w-xl text-gray-200">
          Understand your bookings, customers and revenue trends.
        </p>
      </div>
    </motion.section>
  );
}