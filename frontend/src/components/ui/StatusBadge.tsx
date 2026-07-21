"use client";

import React from "react";
import {
  Clock,
  CheckCircle2,
  Sparkles,
  AlertCircle,
  XCircle,
  CreditCard,
  PartyPopper,
  ShieldCheck,
  RefreshCw,
  LucideIcon,
} from "lucide-react";
import { BookingStatus } from "@/types/booking";

interface StatusBadgeProps {
  status: BookingStatus | string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

interface StatusConfig {
  label: string;
  icon: LucideIcon;
  bg: string;
  text: string;
  border: string;
  pulseColor?: string;
  animate?: boolean;
}

const STATUS_CONFIGS: Record<string, StatusConfig> = {
  pending: {
    label: "Matching Vendor",
    icon: RefreshCw,
    bg: "bg-amber-100",
    text: "text-amber-950 font-extrabold",
    border: "border-amber-300",
    pulseColor: "bg-amber-600",
    animate: true,
  },
  matching: {
    label: "Matching Vendor",
    icon: RefreshCw,
    bg: "bg-amber-100",
    text: "text-amber-950 font-extrabold",
    border: "border-amber-300",
    pulseColor: "bg-amber-600",
    animate: true,
  },
  waiting_primary_vendor: {
    label: "Awaiting Vendor Response",
    icon: Clock,
    bg: "bg-indigo-100",
    text: "text-indigo-950 font-extrabold",
    border: "border-indigo-300",
    pulseColor: "bg-indigo-600",
    animate: true,
  },
  primary_accepted: {
    label: "Accepted • Payment Pending",
    icon: CreditCard,
    bg: "bg-emerald-100",
    text: "text-emerald-950 font-extrabold",
    border: "border-emerald-300",
    pulseColor: "bg-emerald-600",
    animate: true,
  },
  waiting_payment: {
    label: "Advance Payment Pending",
    icon: CreditCard,
    bg: "bg-amber-100",
    text: "text-amber-950 font-extrabold",
    border: "border-amber-300",
    pulseColor: "bg-amber-600",
    animate: true,
  },
  primary_rejected: {
    label: "Primary Vendor Unavailable",
    icon: AlertCircle,
    bg: "bg-rose-100",
    text: "text-rose-950 font-extrabold",
    border: "border-rose-300",
  },
  promote_standby: {
    label: "Standby Vendor Promoted",
    icon: Sparkles,
    bg: "bg-violet-100",
    text: "text-violet-950 font-black tracking-wide",
    border: "border-violet-300",
    pulseColor: "bg-violet-600",
    animate: true,
  },
  standby_accepted: {
    label: "Standby Vendor Accepted",
    icon: CheckCircle2,
    bg: "bg-teal-100",
    text: "text-teal-950 font-extrabold",
    border: "border-teal-300",
  },
  advance_paid: {
    label: "Advance Paid",
    icon: PartyPopper,
    bg: "bg-emerald-100",
    text: "text-emerald-950 font-black",
    border: "border-emerald-300",
  },
  in_progress: {
    label: "Event In Progress",
    icon: Clock,
    bg: "bg-sky-100",
    text: "text-sky-950 font-extrabold",
    border: "border-sky-300",
    pulseColor: "bg-sky-600",
    animate: true,
  },
  event_completed: {
    label: "Event Completed",
    icon: Sparkles,
    bg: "bg-purple-100",
    text: "text-purple-950 font-black",
    border: "border-purple-300",
  },
  awaiting_admin_review: {
    label: "Under Admin Review",
    icon: ShieldCheck,
    bg: "bg-amber-100",
    text: "text-amber-950 font-extrabold",
    border: "border-amber-300",
    pulseColor: "bg-amber-600",
    animate: true,
  },
  payment_approved: {
    label: "Payment Approved",
    icon: CheckCircle2,
    bg: "bg-emerald-100",
    text: "text-emerald-950 font-black",
    border: "border-emerald-300",
  },
  completed: {
    label: "Booking Completed",
    icon: CheckCircle2,
    bg: "bg-emerald-200",
    text: "text-slate-950 font-black",
    border: "border-emerald-400",
  },
  cancelled: {
    label: "Cancelled",
    icon: XCircle,
    bg: "bg-slate-200",
    text: "text-slate-950 font-extrabold",
    border: "border-slate-400",
  },
  rejected: {
    label: "Rejected",
    icon: XCircle,
    bg: "bg-red-100",
    text: "text-red-950 font-extrabold",
    border: "border-red-300",
  },
};


export default function StatusBadge({
  status,
  size = "md",
  className = "",
}: StatusBadgeProps) {
  const normalizedStatus = (status || "").toLowerCase();
  const config: StatusConfig = STATUS_CONFIGS[normalizedStatus] || {
    label: normalizedStatus.replaceAll("_", " ").replace(/\b\w/g, (l) => l.toUpperCase()),
    icon: Clock,
    bg: "bg-slate-50",
    text: "text-slate-700 font-semibold",
    border: "border-slate-200",
  };

  const IconComponent = config.icon;

  const sizeClasses = {
    sm: "px-2.5 py-1 text-xs gap-1.5",
    md: "px-3.5 py-1.5 text-sm gap-2",
    lg: "px-4 py-2 text-base gap-2.5",
  }[size];

  const iconSizes = {
    sm: 13,
    md: 15,
    lg: 18,
  }[size];

  return (
    <span
      className={`inline-flex items-center rounded-full border shadow-xs transition-all duration-300 ${config.bg} ${config.text} ${config.border} ${sizeClasses} ${className}`}
    >
      {/* Pulse Dot Animation if active */}
      {config.animate && config.pulseColor && (
        <span className="relative flex h-2 w-2">
          <span
            className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 ${config.pulseColor}`}
          />
          <span
            className={`relative inline-flex h-2 w-2 rounded-full ${config.pulseColor}`}
          />
        </span>
      )}

      {/* Icon */}
      <IconComponent
        size={iconSizes}
        className={`${config.animate ? "animate-spin-slow" : ""} shrink-0`}
      />

      {/* Formatted Text */}
      <span className="whitespace-nowrap">{config.label}</span>
    </span>
  );
}
