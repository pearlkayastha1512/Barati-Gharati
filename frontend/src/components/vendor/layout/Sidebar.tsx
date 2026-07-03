"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  CalendarCheck2,
  BriefcaseBusiness,
  Images,
  Star,
  MessageCircle,
  CalendarDays,
  Wallet,
  BarChart3,
  User,
  Settings,
  LogOut,
  ChevronRight,
  Building2,
} from "lucide-react";

import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";

const menuItems = [
  {
    title: "Dashboard",
    href: "/vendor",
    icon: LayoutDashboard,
  },
  {
    title: "Bookings",
    href: "/vendor/bookings",
    icon: CalendarCheck2,
  },
  {
    title: "Services",
    href: "/vendor/services",
    icon: BriefcaseBusiness,
  },
  {
    title: "Portfolio",
    href: "/vendor/portfolio",
    icon: Images,
  },
  {
    title: "Reviews",
    href: "/vendor/reviews",
    icon: Star,
  },
  {
    title: "Messages",
    href: "/vendor/messages",
    icon: MessageCircle,
  },
  {
    title: "Calendar",
    href: "/vendor/calendar",
    icon: CalendarDays,
  },
  {
    title: "Earnings",
    href: "/vendor/earnings",
    icon: Wallet,
  },
  {
    title: "Analytics",
    href: "/vendor/analytics",
    icon: BarChart3,
  },
  {
    title: "Profile",
    href: "/vendor/profile",
    icon: User,
  },
  {
    title: "Settings",
    href: "/vendor/settings",
    icon: Settings,
  },
];

export default function Sidebar() {
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

        {/* Logo */}


<Link href="/">
        <div className="border-b border-slate-100 p-6">

          <div className="rounded-3xl bg-gradient-to-br from-slate-800 to-blue-700 p-5 text-white shadow-xl">

            <div className="flex items-center gap-4">

              <div className="rounded-2xl bg-white/20 p-3">

                <Building2 size={24} />

              </div>

              <div>

                <h2 className="text-2xl font-bold">
                  Vendor Hub
                </h2>

                <p className="text-sm text-slate-200">
                  Business Dashboard
                </p>

              </div>

            </div>

          </div>

        </div>

        </Link>

        {/* Navigation */}

        <nav className="flex-1 overflow-y-auto px-4 py-6">

          <p className="mb-5 px-4 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
            Business
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
                  className={`group flex items-center justify-between rounded-2xl px-4 py-3 transition-all duration-300

                  ${
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

        {/* Bottom */}

        <div className="border-t border-slate-100 p-5">

          <div className="rounded-3xl bg-slate-100 p-5">

            <h3 className="font-semibold text-slate-800">
              Vendor Support
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              Need help managing your business?
            </p>

            <button className="mt-5 w-full rounded-2xl bg-slate-800 py-3 font-semibold text-white transition hover:bg-slate-700">

              Contact Support

            </button>

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