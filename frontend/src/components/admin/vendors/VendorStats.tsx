"use client";

import { useMemo } from "react";
import {
  CheckCircle2,
  Clock3,
  Users,
  XCircle,
} from "lucide-react";

import { StoredVendor } from "@/services/vendor.service";

interface VendorStatsProps {
  vendors: StoredVendor[];
}

export default function VendorStats({
  vendors,
}: VendorStatsProps) {
  const stats = useMemo(() => {
    return {
      total: vendors.length,

      pending: vendors.filter(
        (vendor) =>
          vendor.approvalStatus === "pending"
      ).length,

      approved: vendors.filter(
        (vendor) =>
          vendor.approvalStatus === "approved"
      ).length,

      rejected: vendors.filter(
        (vendor) =>
          vendor.approvalStatus === "rejected"
      ).length,
    };
  }, [vendors]);

  return (
    <section className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
      <Card
        title="Total Vendors"
        value={stats.total}
        icon={Users}
        color="blue"
      />

      <Card
        title="Pending"
        value={stats.pending}
        icon={Clock3}
        color="amber"
      />

      <Card
        title="Approved"
        value={stats.approved}
        icon={CheckCircle2}
        color="green"
      />

      <Card
        title="Rejected"
        value={stats.rejected}
        icon={XCircle}
        color="red"
      />
    </section>
  );
}

interface CardProps {
  title: string;
  value: number;
  icon: React.ElementType;
  color: "blue" | "green" | "amber" | "red";
}

function Card({
  title,
  value,
  icon: Icon,
  color,
}: CardProps) {
  const colors = {
    blue: {
      bg: "bg-blue-100",
      text: "text-blue-700",
    },

    green: {
      bg: "bg-green-100",
      text: "text-green-700",
    },

    amber: {
      bg: "bg-amber-100",
      text: "text-amber-700",
    },

    red: {
      bg: "bg-red-100",
      text: "text-red-700",
    },
  };

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <div
        className={`inline-flex rounded-2xl p-3 ${colors[color].bg}`}
      >
        <Icon
          size={24}
          className={colors[color].text}
        />
      </div>

      <p className="mt-6 text-sm text-slate-500">
        {title}
      </p>

      <h2 className="mt-2 text-4xl font-bold text-slate-900">
        {value}
      </h2>
    </div>
  );
}
