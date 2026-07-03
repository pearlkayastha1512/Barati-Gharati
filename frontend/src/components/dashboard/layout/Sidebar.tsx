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
  Sparkles,
  ChevronRight,
} from "lucide-react";

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
<aside className="sticky left-0 top-0 hidden h-screen w-72 border-r border-gray-200 bg-white lg:flex">

      <div className="flex h-full w-full flex-col">
      

        {/* Logo */}

        <div className="border-b border-gray-100 p-6">

          <div className="rounded-3xl bg-gradient-to-br from-rose-500 to-pink-500 p-5 text-white shadow-xl">

            <div className="flex items-center gap-4">

              <div className="rounded-2xl bg-white/20 p-3">
                <Sparkles size={24} />
              </div>
      <Link href="/">
              <div>
                <h2 className="text-2xl font-bold">
                  WedPlanner
                </h2>

                <p className="text-sm text-rose-100">
                  Customer Dashboard
                </p>
              </div>
              </Link>
  
            </div>

          </div>

        </div>

        {/* Navigation */}

        <nav className="flex-1 overflow-y-auto px-4 py-6">

          <p className="mb-5 px-4 text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">
            Main Menu
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
                      ? "bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-lg"
                      : "text-gray-600 hover:bg-rose-50 hover:text-rose-500"
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

        <div className="border-t border-gray-100 p-5">

          <div className="rounded-3xl bg-rose-50 p-5">

            <h3 className="font-semibold text-gray-800">
              Need Help?
            </h3>

            <p className="mt-2 text-sm text-gray-500">
              Wedding experts are available 24×7.
            </p>
        <Link href="/contact">
            <button className="mt-5 w-full rounded-2xl bg-rose-500 py-3 font-semibold text-white transition hover:bg-rose-600">
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