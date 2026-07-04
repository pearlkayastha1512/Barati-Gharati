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

export default function AdminDashboardPage() {
  const { stats, loadDashboard } =
    useAdminStore();

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  return (
    <div className="space-y-8">
      <AdminHero />

      {/* Stats */}

      <section className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
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
          <QuickActionCard
            title="Vendor Management"
            description="Approve and manage vendors."
            href="/admin/vendors"
            icon={BadgeCheck}
          />

          <QuickActionCard
            title="Bookings"
            description="Monitor all bookings."
            href="/admin/bookings"
            icon={CalendarDays}
          />

          <QuickActionCard
            title="Notifications"
            description="Send platform announcements."
            href="/admin/notifications"
            icon={Bell}
          />

          <QuickActionCard
            title="Settings"
            description="Configure platform settings."
            href="/admin/settings"
            icon={Settings}
          />
        </div>
      </section>
    </div>
  );
}