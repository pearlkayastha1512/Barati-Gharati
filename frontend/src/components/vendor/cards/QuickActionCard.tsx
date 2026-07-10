"use client";

import Link from "next/link";
import { LucideIcon, ArrowRight } from "lucide-react";

interface Props {
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
}: Props) {
  return (
    <Link
      href={href}
      className="group rounded-3xl border border-[#f4c8a0] bg-white/90 p-6 shadow-sm shadow-[#e4005a]/5 transition-all duration-300 hover:-translate-y-1 hover:border-[#ffc43d] hover:shadow-xl hover:shadow-[#e4005a]/10"
    >
      <div className="flex items-center justify-between">

        <div className="rounded-2xl bg-[#fff0bf] p-3 ring-1 ring-[#ffb703]/25">

          <Icon
            size={24}
            className="text-[#b00045]"
          />

        </div>

        <ArrowRight
          size={20}
          className="text-[#e4005a] transition group-hover:translate-x-1"
        />

      </div>

      <h3 className="mt-6 text-xl font-semibold text-[#4d1730]">
        {title}
      </h3>

      <p className="mt-2 text-sm text-[#946176]">
        {description}
      </p>

    </Link>
  );
}
