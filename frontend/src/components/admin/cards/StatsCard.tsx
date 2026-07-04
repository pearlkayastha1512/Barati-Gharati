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
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <div className="flex justify-between">
        <div className="rounded-2xl bg-blue-100 p-3">
          <Icon
            size={24}
            className="text-blue-700"
          />
        </div>
      </div>

      <h3 className="mt-6 text-sm text-slate-500">
        {title}
      </h3>

      <p className="mt-2 text-4xl font-bold text-slate-900">
        {value}
      </p>

      <p className="mt-2 text-sm text-slate-500">
        {subtitle}
      </p>
    </div>
  );
}