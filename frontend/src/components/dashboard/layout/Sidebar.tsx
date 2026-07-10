"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import {
  LayoutDashboard,
  CalendarDays,
  Heart,
  User,
  Wallet,
  MessageCircle,
  Settings,
  LogOut,
  ChevronRight,
} from "lucide-react";
import BrandLogo from "@/components/brand/BrandLogo";

const menuItems = [
  {
    title: "Dashboard",
    href: "/customer",
    icon: LayoutDashboard,
  },
  {
    title: "Wedding Planner",
    href: "/customer/planner",
    icon: CalendarDays,
  },
  {
    title: "Bookings",
    href: "/customer/bookings",
    icon: CalendarDays,
  },
  {
    title: "Wishlist",
    href: "/customer/wishlist",
    icon: Heart,
  },
  {
    title: "Messages",
    href: "/customer/messages",
    icon: MessageCircle,
  },
  {
    title: "Budget",
    href: "/customer/budget",
    icon: Wallet,
  },
  {
    title: "Profile",
    href: "/customer/profile",
    icon: User,
  },
  {
    title: "Settings",
    href: "/customer/settings",
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
    // <aside className="hidden w-72 shrink-0 border-r border-gray-200 bg-white lg:flex">
<aside className="sticky left-0 top-0 hidden h-screen w-72 border-r border-[#ffb3bf] bg-[#fffef7] lg:flex">

      <div className="flex h-full w-full flex-col">
      

        <div className="border-b border-[#ffcad3] p-6">
          <Link
            href="/"
            className="block rounded-3xl bg-white p-4 shadow-xl shadow-[#ff4d6d]/10 ring-1 ring-[#ff9aaa]/35"
            aria-label="Barati Gharati home"
          >
            <BrandLogo className="h-24 w-full" />
          </Link>
        </div>

        {/* Navigation */}

        <nav className="flex-1 overflow-y-auto px-4 py-6">

          <p className="mb-5 px-4 text-xs font-semibold uppercase tracking-[0.2em] text-[#b85f7b]">
            Wedding Plan
          </p>

          <div className="space-y-2">

            {menuItems.map((item) => {

              const Icon = item.icon;

              const active = pathname === item.href;

              return (

                <Link
                  key={item.title}
                  href={item.href}
                  className={`group flex items-center justify-between rounded-2xl px-4 py-3 transition-all duration-300

                  ${
                    active
                      ? "bg-gradient-to-r from-[#ff4d6d] to-[#ff8fa1] text-[#3a1b2a] shadow-lg shadow-[#ff4d6d]/25"
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

        {/* Bottom */}

        <div className="border-t border-[#ffcad3] p-5">

          <div className="rounded-3xl border border-[#ffb3bf] bg-[#ffe6eb] p-5 shadow-sm">

            <h3 className="font-semibold text-[#6c2d45]">
              Planning Help
            </h3>

            <p className="mt-2 text-sm text-[#8d6171]">
              Talk to us for venues, vendors, and budget guidance.
            </p>
        <Link href="/contact">
            <button className="mt-5 w-full rounded-2xl bg-[#ff4d6d] py-3 font-semibold text-white transition hover:bg-[#e63b5f]">
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
