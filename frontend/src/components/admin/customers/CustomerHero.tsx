"use client";

import { motion } from "framer-motion";
import { Users } from "lucide-react";

export default function CustomerHero() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-[32px] bg-gradient-to-r from-slate-800 via-blue-700 to-slate-900 p-8 text-white shadow-xl"
    >
      <div>
        <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2">
          <Users size={16} />

          Customer Management
        </div>

        <h1 className="mt-5 text-5xl font-bold">
          Manage Platform
          <br />
          Customers
        </h1>

        <p className="mt-5 max-w-xl text-slate-200">
          View registered customers and manage platform users.
        </p>
      </div>
    </motion.section>
  );
}