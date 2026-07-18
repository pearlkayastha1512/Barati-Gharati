"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import {
  LayoutDashboard,
  Users,
  UserRound,
  CalendarCheck2,
  Wallet,
  Star,
  Bell,
  Settings,
  LogOut,
  ChevronRight,
  ShieldAlert,
  UserCog,
  FilePenLine,
  ClipboardList,
  Crown,
} from "lucide-react";
import BrandLogo from "@/components/brand/BrandLogo";

import { useAuthStore } from "@/store/authStore";
import {
  ADMIN_ROLE_LABELS,
  hasAdminPermission,
} from "@/lib/adminAccess";

const menuItems = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
    permission: "dashboard.view",
  },
  {
    title: "Admin Accounts",
    href: "/admin/admins",
    icon: UserCog,
    permission: "admins.manage",
  },
  {
    title: "Audit Logs",
    href: "/admin/audit-logs",
    icon: ClipboardList,
    permission: "audit.view",
  },
  {
    title: "Vendor Management",
    href: "/admin/vendors",
    icon: Users,
    permission: "vendors.view",
  },
  {
    title: "Customer Management",
    href: "/admin/customers",
    icon: UserRound,
    permission: "customers.view",
  },
  {
    title: "Bookings",
    href: "/admin/bookings",
    icon: CalendarCheck2,
    permission: "premium-planning.view",
  },
  {
    title: "Premium Planning",
    href: "/admin/premium-planning",
    icon: Crown,
    permission: "bookings.view",
  },
  {
    title: "Payments",
    href: "/admin/payments",
    icon: Wallet,
    permission: "payments.view",
  },
  {
    title: "Reviews",
    href: "/admin/reviews",
    icon: Star,
    permission: "reviews.view",
  },
  // {
  //   title: "Email History",
  //   href: "/admin/emails",
  //   icon: Shapes,
  // },
  {
    title: "Notifications",
    href: "/admin/notifications",
    icon: Bell,
    permission: "notifications.view",
  },
  {
    title: "Chat Moderation",
    href: "/admin/chat-moderation",
    icon: ShieldAlert,
    permission: "chat.view",
  },
  {
    title: "Content",
    href: "/admin/content",
    icon: FilePenLine,
    permission: "content.view",
  },
//   {
//     title: "Analytics",
//     href: "/admin/analytics",
//     icon: BarChart3,
//   },
  {
    title: "Settings",
    href: "/admin/settings",
    icon: Settings,
    permission: "settings.view",
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  const router = useRouter();

  const { logout, user } = useAuthStore();
  const visibleMenuItems = menuItems.filter((item) =>
    hasAdminPermission(user, item.permission),
  );

  const handleLogout = () => {
    logout();

    router.push("/");
  };

  return (
    <aside className="hidden h-screen w-72 shrink-0 border-r border-[#ffb3bf] bg-[#fffef7] lg:flex">
      <div className="flex h-full w-full flex-col">
        <Link href="/">
          <div className="border-b border-[#ffcad3] p-6">
            <div className="rounded-3xl bg-white px-3 py-4 shadow-xl shadow-[#ff4d6d]/10 ring-1 ring-[#ff9aaa]/35">
              <BrandLogo className="h-24 w-full min-w-[190px]" />
            </div>
          </div>
        </Link>

        <nav className="flex-1 overflow-y-auto px-4 py-6">
          <p className="mb-5 px-4 text-xs font-semibold uppercase tracking-[0.2em] text-[#b85f7b]">
            Administration
          </p>

          <div className="space-y-2">
            {visibleMenuItems.map((item) => {
              const Icon = item.icon;

              const active =
                pathname === item.href;

              return (
                <Link
                  key={item.title}
                  href={item.href}
                  className={`group flex items-center justify-between rounded-2xl px-4 py-3 transition-all duration-300 ${
                    active
                      ? "bg-gradient-to-r from-[#ff4d6d] to-[#ffb703] text-[#3a1b2a] shadow-lg shadow-[#ff4d6d]/25"
                      : "text-[#7a4a5c] hover:bg-[#ffe6eb] hover:text-[#ff4d6d]"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon size={20} />

                    <span className="font-medium">
                      {item.title}
                    </span>
                  </div>

                  <ChevronRight
                    size={18}
                    className={`transition ${
                      active
                        ? "opacity-100"
                        : "opacity-0 group-hover:opacity-100"
                    }`}
                  />
                </Link>
              );
            })}
          </div>
        </nav>

        <div className="border-t border-[#ffcad3] p-5">
          <div className="rounded-3xl border border-[#ffb3bf] bg-[#ffe6eb] p-5 shadow-sm">
            <h3 className="font-semibold text-[#6c2d45]">
              {user?.adminRole
                ? ADMIN_ROLE_LABELS[user.adminRole]
                : "Super Admin"}
            </h3>

            <p className="mt-2 text-sm text-[#8d6171]">
              Only assigned modules and actions are available for this login.
            </p>

            {/* <button className="mt-5 w-full rounded-2xl bg-slate-800 py-3 font-semibold text-white transition hover:bg-slate-700">
              View Reports
            </button> */}
          </div>

          <button
            onClick={handleLogout}
            className="mt-5 flex w-full items-center gap-3 rounded-2xl px-4 py-3 font-medium text-red-500 transition hover:bg-red-50"
          >
            <LogOut size={20} />

            Logout
          </button>
        </div>
      </div>
    </aside>
  );
}
