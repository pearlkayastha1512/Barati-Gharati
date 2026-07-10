"use client";

import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";

export default function MessagesHero() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-[28px] bg-gradient-to-r from-[#e4005a] via-[#c90055] to-[#ffb703] px-10 py-7 text-white shadow-xl"
    >
      <div>

        <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2">

          <MessageCircle size={16} />

          Customer Messages

        </div>

       <h1 className="mt-4 text-4xl font-bold leading-tight">

          Stay connected
          <br />

          with your clients.

        </h1>
<p className="mt-3 max-w-2xl text-slate-200">

          Discuss bookings, quotations and event details.

        </p>

      </div>

    </motion.section>
  );
}