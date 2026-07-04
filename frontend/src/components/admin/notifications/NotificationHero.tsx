"use client";

import { motion } from "framer-motion";
import { Bell } from "lucide-react";

export default function NotificationHero() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-[32px] bg-gradient-to-r from-slate-800 via-blue-700 to-slate-900 p-8 text-white shadow-xl"
    >
      <div>
        <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2">
          <Bell size={16} />
          Notifications
        </div>

        <h1 className="mt-5 text-5xl font-bold">
          Platform
          <br />
          Notifications
        </h1>

        <p className="mt-5 max-w-xl text-slate-200">
          Monitor recent activities happening across the platform.
        </p>
      </div>
    </motion.section>
  );
}