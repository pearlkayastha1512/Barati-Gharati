"use client";

import { LucideIcon, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

interface StatsCardProps {
  title: string;
  value: string;
  subtitle: string;
  icon: LucideIcon;
}

export default function StatsCard({
  title,
  value,
  subtitle,
  icon: Icon,
}: StatsCardProps) {
  return (
    <motion.div
      whileHover={{
        y: -6,
      }}
      transition={{
        duration: 0.25,
      }}
      className="
        rounded-3xl
        border
        border-[#ffb3bf]
        bg-white/90
        p-6
        shadow-sm
        shadow-[#ff4d6d]/5
        transition
        hover:border-[#ff8fa1]
        hover:shadow-xl
        hover:shadow-[#ff4d6d]/10
      "
    >
      {/* Top */}

      <div className="flex items-center justify-between">

        <div className="rounded-2xl bg-[#ffe6eb] p-4 ring-1 ring-[#ff4d6d]/10">

          <Icon
            className="text-[#ff4d6d]"
            size={24}
          />

        </div>

        <TrendingUp
          size={18}
          className="text-[#ff4d6d]"
        />

      </div>

      {/* Content */}

      <div className="mt-8">

        <p className="text-sm text-[#8d6171]">
          {title}
        </p>

        <h2 className="mt-2 text-4xl font-bold text-[#3f1d2f]">
          {value}
        </h2>

        <p className="mt-3 text-sm font-medium text-[#ff4d6d]">
          {subtitle}
        </p>

      </div>

    </motion.div>
  );
}
