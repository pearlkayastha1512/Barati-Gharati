"use client";

import { useMemo } from "react";

import {
  Wallet,
  CircleDollarSign,
  BadgeCheck,
  Clock3,
} from "lucide-react";

import { Booking } from "@/types/booking";

interface PaymentStatsProps {
  bookings: Booking[];
}

export default function PaymentStats({
  bookings,
}: PaymentStatsProps) {
  const stats = useMemo(() => {
    return {
      totalPayments: bookings.length,

      totalRevenue: bookings.reduce(
        (sum, booking) =>
          sum + booking.advancePaid,
        0
      ),

      paid: bookings.filter(
        (booking) =>
          booking.paymentStatus === "paid"
      ).length,

      pending: bookings.filter(
        (booking) =>
          booking.paymentStatus ===
            "pending" ||
          booking.paymentStatus ===
            "partial"
      ).length,
    };
  }, [bookings]);

  return (
    <section className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
      <Card
        title="Transactions"
        value={stats.totalPayments.toString()}
        icon={Wallet}
        color="blue"
      />

      <Card
        title="Revenue"
        value={`₹${stats.totalRevenue.toLocaleString(
          "en-IN"
        )}`}
        icon={CircleDollarSign}
        color="green"
      />

      <Card
        title="Completed"
        value={stats.paid.toString()}
        icon={BadgeCheck}
        color="blue"
      />

      <Card
        title="Pending"
        value={stats.pending.toString()}
        icon={Clock3}
        color="amber"
      />
    </section>
  );
}

interface CardProps {
  title: string;
  value: string;
  icon: React.ElementType;
  color:
    | "blue"
    | "green"
    | "amber";
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
