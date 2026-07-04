"use client";

import { motion } from "framer-motion";
import { HelpCircle } from "lucide-react";

export default function FaqHero() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="overflow-hidden rounded-[32px] bg-gradient-to-r from-rose-500 via-pink-500 to-orange-500 p-10 text-white shadow-xl pt-2"
    >
      <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 backdrop-blur">
            <HelpCircle size={18} />
            Frequently Asked Questions
          </div>

          <h1 className="mt-6 text-5xl font-bold leading-tight">
            We're here
            <br />
            to help.
          </h1>

          <p className="mt-5 max-w-2xl text-lg text-rose-100">
            Find answers to the most commonly asked questions about
            bookings, vendors, payments, reviews and using WedPlan.
          </p>
        </div>

        <div className="rounded-3xl bg-white/10 p-8 backdrop-blur">
          <p className="text-sm text-rose-100">
            Need more help?
          </p>

          <h3 className="mt-3 text-3xl font-bold">
            Contact Our
            <br />
            Support Team
          </h3>

          <p className="mt-4 text-sm text-rose-100">
            We usually respond within
            <br />
            24 hours.
          </p>

          <a
            href="/contact"
            className="mt-6 inline-flex rounded-2xl bg-white px-6 py-3 font-semibold text-rose-600 transition hover:scale-105"
          >
            Contact Us
          </a>
        </div>
      </div>
    </motion.section>
  );
}