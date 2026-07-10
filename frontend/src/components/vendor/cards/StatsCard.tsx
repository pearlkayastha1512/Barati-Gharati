"use client";

import { LucideIcon } from "lucide-react";

interface Props {
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
}: Props) {
  return (
    <div className="rounded-3xl border border-[#f4c8a0] bg-white/90 p-6 shadow-sm shadow-[#e4005a]/5 transition hover:-translate-y-1 hover:border-[#ffc43d] hover:shadow-lg hover:shadow-[#e4005a]/10">

      <div className="flex justify-between">

        <div className="rounded-2xl bg-[#ffe1ec] p-3 ring-1 ring-[#e4005a]/10">

          <Icon
            size={24}
            className="text-[#e4005a]"
          />

        </div>

      </div>

      <h3 className="mt-6 text-sm text-[#946176]">
        {title}
      </h3>

      <p className="mt-2 text-4xl font-bold text-[#4d1730]">
        {value}
      </p>

      <p className="mt-2 text-sm text-[#946176]">
        {subtitle}
      </p>

    </div>
  );
}
