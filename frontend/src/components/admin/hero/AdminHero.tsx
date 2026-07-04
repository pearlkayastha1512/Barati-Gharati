"use client";

import { motion } from "framer-motion";
import {
  ShieldCheck,
  Users,
  UserRound,
  CalendarCheck2,
  Wallet,
} from "lucide-react";

export default function AdminHero() {
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
        duration: 0.5,
      }}
      className="overflow-hidden rounded-[32px] bg-gradient-to-r from-slate-800 via-blue-700 to-slate-900 p-8 text-white shadow-xl"
    >
      <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-center">
        {/* Left */}

        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 backdrop-blur-md">
            <ShieldCheck size={16} />

            Platform Administration
          </div>

          <h1 className="mt-6 text-5xl font-bold leading-tight">
            Welcome to
            <br />
            Admin Dashboard
          </h1>

          <p className="mt-5 max-w-2xl text-slate-200">
            Monitor vendors, customers, bookings,
            payments and overall platform performance
            from one centralized dashboard.
          </p>
        </div>

        {/* Right */}

        <div className="grid grid-cols-2 gap-4">
          <HeroBadge
            icon={Users}
            title="Vendors"
          />

          <HeroBadge
            icon={UserRound}
            title="Customers"
          />

          <HeroBadge
            icon={CalendarCheck2}
            title="Bookings"
          />

          <HeroBadge
            icon={Wallet}
            title="Revenue"
          />
        </div>
      </div>
    </motion.section>
  );
}

function HeroBadge({
  icon: Icon,
  title,
}: {
  icon: React.ElementType;
  title: string;
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/10 p-5 backdrop-blur-md">
      <Icon
        size={28}
        className="mb-4"
      />

      <p className="text-sm text-slate-200">
        Platform
      </p>

      <h3 className="mt-1 text-xl font-bold">
        {title}
      </h3>
    </div>
  );
}