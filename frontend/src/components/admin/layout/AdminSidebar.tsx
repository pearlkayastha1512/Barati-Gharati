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
} from "lucide-react";
import BrandLogo from "@/components/brand/BrandLogo";

import { useAuthStore } from "@/store/authStore";

const menuItems = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Vendor Management",
    href: "/admin/vendors",
    icon: Users,
  },
  {
    title: "Customer Management",
    href: "/admin/customers",
    icon: UserRound,
  },
  {
    title: "Bookings",
    href: "/admin/bookings",
    icon: CalendarCheck2,
  },
  {
    title: "Payments",
    href: "/admin/payments",
    icon: Wallet,
  },
  {
    title: "Reviews",
    href: "/admin/reviews",
    icon: Star,
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
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  const router = useRouter();

  const { logout } = useAuthStore();

  const handleLogout = () => {
    logout();

    router.push("/");
  };

  return (
    <aside className="hidden h-screen w-72 shrink-0 border-r border-slate-200 bg-white lg:flex">
      <div className="flex h-full w-full flex-col">
        <Link href="/">
          <div className="border-b border-slate-100 p-6">
            <div className="rounded-3xl bg-white p-4 shadow-xl ring-1 ring-slate-100">
              <BrandLogo className="h-24 w-full" />
            </div>
          </div>
        </Link>

        <nav className="flex-1 overflow-y-auto px-4 py-6">
          <p className="mb-5 px-4 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
            Administration
          </p>

          <div className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;

              const active =
                pathname === item.href;

              return (
                <Link
                  key={item.title}
                  href={item.href}
                  className={`group flex items-center justify-between rounded-2xl px-4 py-3 transition-all duration-300 ${
                    active
                      ? "bg-gradient-to-r from-slate-800 to-blue-700 text-white shadow-lg"
                      : "text-slate-600 hover:bg-slate-100"
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

        <div className="border-t border-slate-100 p-5">
          <div className="rounded-3xl bg-slate-100 p-5">
            <h3 className="font-semibold text-slate-800">
              Platform Status
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              Monitor vendors, customers, bookings and payments.
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
