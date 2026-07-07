"use client";

import { useMemo } from "react";
import {
  Users,
  ShieldCheck,
  UserCheck,
  UserX,
} from "lucide-react";

import { User } from "@/types/auth";

interface CustomerStatsProps {
  customers: User[];
}

export default function CustomerStats({
  customers,
}: CustomerStatsProps) {
  const stats = useMemo(() => {
    return {
      total: customers.length,

      verified: customers.filter(
        (customer) => customer.isVerified
      ).length,

      unverified: customers.filter(
        (customer) => !customer.isVerified
      ).length,
    };
  }, [customers]);

  return (
    <section className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
      <Card
        title="Total Customers"
        value={stats.total}
        icon={Users}
        color="blue"
      />

      <Card
        title="Verified"
        value={stats.verified}
        icon={ShieldCheck}
        color="green"
      />

      <Card
        title="Unverified"
        value={stats.unverified}
        icon={UserX}
        color="amber"
      />

      <Card
        title="Active Accounts"
        value={stats.total}
        icon={UserCheck}
        color="blue"
      />
    </section>
  );
}

interface CardProps {
  title: string;
  value: number;
  icon: React.ElementType;
  color: "blue" | "green" | "amber";
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
