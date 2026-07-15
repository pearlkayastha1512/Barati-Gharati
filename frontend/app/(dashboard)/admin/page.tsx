"use client";

import { useEffect } from "react";

import {
  CalendarCheck2,
  Users,
  UserRound,
  Wallet,
  CalendarDays,
  Bell,
  Settings,
  BadgeCheck,
} from "lucide-react";

import AdminHero from "@/components/admin/hero/AdminHero";
import StatsCard from "@/components/admin/cards/StatsCard";
import QuickActionCard from "@/components/admin/cards/QuickActionCard";

import { useAdminStore } from "@/store/adminStore";
import { useAuthStore } from "@/store/authStore";
import { hasAdminPermission } from "@/lib/adminAccess";

export default function AdminDashboardPage() {
  const user = useAuthStore((state) => state.user);
  const {
    stats,
    loadDashboard,
    isDashboardLoading,
    dashboardError,
  } =
    useAdminStore();

  useEffect(() => {
    loadDashboard();

    const refreshDashboard = () => {
      if (document.visibilityState === "visible") {
        loadDashboard();
      }
    };

    window.addEventListener("focus", refreshDashboard);
    document.addEventListener(
      "visibilitychange",
      refreshDashboard
    );

    return () => {
      window.removeEventListener(
        "focus",
        refreshDashboard
      );
      document.removeEventListener(
        "visibilitychange",
        refreshDashboard
      );
    };
  }, [loadDashboard]);

  return (
    <div className="space-y-8">
      <AdminHero />

      {dashboardError && (
        <div
          role="alert"
          className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          <span>{dashboardError}</span>
          <button
            type="button"
            onClick={loadDashboard}
            className="font-semibold text-red-800 underline underline-offset-4"
          >
            Try again
          </button>
        </div>
      )}

      {/* Stats */}

      <section
        aria-busy={isDashboardLoading}
        className={`grid gap-6 transition-opacity sm:grid-cols-2 xl:grid-cols-4 ${
          isDashboardLoading ? "opacity-60" : ""
        }`}
      >
        <StatsCard
          title="Vendors"
          value={stats.totalVendors.toString()}
          subtitle="Registered Vendors"
          icon={Users}
        />

        <StatsCard
          title="Customers"
          value={stats.totalCustomers.toString()}
          subtitle="Registered Customers"
          icon={UserRound}
        />

        <StatsCard
          title="Bookings"
          value={stats.totalBookings.toString()}
          subtitle="Platform Bookings"
          icon={CalendarCheck2}
        />

        <StatsCard
          title="Revenue"
          value={`₹${stats.totalRevenue.toLocaleString(
            "en-IN"
          )}`}
          subtitle="Advance Collected"
          icon={Wallet}
        />
      </section>

      {/* Quick Actions */}

      <section>
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-slate-900">
            Quick Actions
          </h2>

          <p className="mt-1 text-slate-500">
            Manage your platform efficiently.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {hasAdminPermission(user, "vendors.view") && <QuickActionCard
            title="Vendor Management"
            description="Approve and manage vendors."
            href="/admin/vendors"
            icon={BadgeCheck}
          />}

          {hasAdminPermission(user, "bookings.view") && <QuickActionCard
            title="Bookings"
            description="Monitor all bookings."
            href="/admin/bookings"
            icon={CalendarDays}
          />}

          {hasAdminPermission(user, "notifications.view") && <QuickActionCard
            title="Notifications"
            description="Send platform announcements."
            href="/admin/notifications"
            icon={Bell}
          />}

          {hasAdminPermission(user, "settings.view") && <QuickActionCard
            title="Settings"
            description="Configure platform settings."
            href="/admin/settings"
            icon={Settings}
          />}
        </div>
      </section>
    </div>
  );
}
