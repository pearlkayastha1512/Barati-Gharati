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
} from "lucide-react";
import BrandLogo from "@/components/brand/BrandLogo";

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
    <aside className="hidden h-screen w-72 shrink-0 border-r border-[#f4c8a0] bg-[#fffaf3] lg:flex">

      <div className="flex h-full w-full flex-col">

<Link href="/">
        <div className="border-b border-[#f7dcb8] p-6">
          <div className="rounded-3xl bg-white px-3 py-4 shadow-xl shadow-[#e4005a]/10 ring-1 ring-[#ffc43d]/35">
            <BrandLogo className="h-24 w-full min-w-[190px]" />
          </div>
        </div>

        </Link>

        {/* Navigation */}

        <nav className="flex-1 overflow-y-auto px-4 py-6">

          <p className="mb-5 px-4 text-xs font-semibold uppercase tracking-[0.2em] text-[#b85f7b]">
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
                      ? "bg-gradient-to-r from-[#e4005a] to-[#ffb703] text-white shadow-lg shadow-[#e4005a]/25"
                      : "text-[#6d4052] hover:bg-[#ffe9bf] hover:text-[#b00045]"
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

        <div className="border-t border-[#f7dcb8] p-5">

          <div className="rounded-3xl border border-[#ffd37a] bg-[#fff1cf] p-5 shadow-sm">

            <h3 className="font-semibold text-[#5b243a]">
              Vendor Support
            </h3>

            <p className="mt-2 text-sm text-[#8f5870]">
              Need help managing your business?
            </p>
            <Link href={"/contact"}>
              <button className="mt-5 w-full rounded-2xl bg-[#e4005a] py-3 font-semibold text-white transition hover:bg-[#c8004e]">

              Contact Support

            </button>
            </Link>
            

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
