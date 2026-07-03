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
          border-gray-200
          bg-white
          p-6
          shadow-sm
          transition-all
          hover:border-rose-200
          hover:shadow-xl
        "
      >
        {/* Icon */}

        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 transition group-hover:bg-rose-500">

          <Icon
            size={26}
            className="text-rose-500 transition group-hover:text-white"
          />

        </div>

        {/* Content */}

        <div className="mt-6 flex-1">

          <h3 className="text-xl font-semibold text-gray-900">
            {title}
          </h3>

          <p className="mt-2 text-gray-500">
            {description}
          </p>

        </div>

        {/* Footer */}


           
        <div className="mt-6 flex items-center gap-2 font-semibold text-rose-500">
           
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