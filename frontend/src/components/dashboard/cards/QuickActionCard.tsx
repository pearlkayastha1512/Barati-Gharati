"use client";

import Link from "next/link";
import { LucideIcon, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

interface QuickActionCardProps {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
}

export default function QuickActionCard({
  title,
  description,
  href,
  icon: Icon,
}: QuickActionCardProps) {
  return (
    <motion.div
      whileHover={{
        y: -6,
        scale: 1.02,
      }}
      transition={{ duration: 0.2 }}
    >
      <Link
        href={href}
        className="
          group
          flex
          h-full
          flex-col
          rounded-3xl
          border
          border-[#ffb3bf]
          bg-white/90
          p-6
          shadow-sm
          shadow-[#ff4d6d]/5
          transition-all
          hover:border-[#ff8fa1]
          hover:shadow-xl
          hover:shadow-[#ff4d6d]/10
        "
      >
        {/* Icon */}

        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#ffe6eb] transition group-hover:bg-[#ff4d6d]">

          <Icon
            size={26}
            className="text-[#ff4d6d] transition group-hover:text-white"
          />

        </div>

        {/* Content */}

        <div className="mt-6 flex-1">

          <h3 className="text-xl font-semibold text-[#3f1d2f]">
            {title}
          </h3>

          <p className="mt-2 text-[#8d6171]">
            {description}
          </p>

        </div>

        {/* Footer */}


           
        <div className="mt-6 flex items-center gap-2 font-semibold text-[#ff4d6d]">
           
          Open

          <ArrowRight
            size={18}
            className="transition group-hover:translate-x-1"
          />

        </div>
       

      </Link>
    </motion.div>
  );
}
