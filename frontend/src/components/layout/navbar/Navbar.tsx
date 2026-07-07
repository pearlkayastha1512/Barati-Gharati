


"use client";

import { useEffect, useState } from "react";
import Logo from "./Logo";
import DesktopNavigation from "./DesktopNavigation";
import MobileNavigation from "./MobileNavigation";
import CTAButton from "./CTAButton";
import { useAuthStore } from "@/store/authStore";

import Link from "next/link";
import NotificationBell from "./NotificationBell";
import { getDashboardRoute } from "@/lib/auth";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  const {
    isAuthenticated,
    user,
    openLogin,
    logout,
  } = useAuthStore();

  const dashboardLabel =
    user?.role === "vendor"
      ? "Vendor Dashboard"
      : user?.role === "admin"
      ? "Admin Dashboard"
      : "Dashboard";

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };

    window.addEventListener("scroll", handleScroll);

    return () =>
      window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-5 z-50 px-5 transition-all duration-500 ${
        scrolled ? "top-3" : "top-5"
      }`}
    >
      <div
        className={`mx-auto flex h-20 max-w-7xl items-center justify-between rounded-3xl border px-8 transition-all duration-500 ${
          scrolled
            ? "border-white/20 bg-black/20 backdrop-blur-xl"
            : "border-white/10 bg-black/20 backdrop-blur-xl"
        }`}
      >
        <Logo />

        <div className="hidden lg:flex">
          <DesktopNavigation />
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          {isAuthenticated ? (
<div className="flex shrink-0 items-center gap-3">
    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-rose-500 font-bold text-white">
      {user?.name?.charAt(0).toUpperCase()}
    </div>

    <div>
      <p className="font-semibold text-white">
        {user?.name}
      </p>

      <p className="text-xs text-gray-300 capitalize">
        {user?.role}
      </p>
    </div>
  <NotificationBell />
    <Link
      href={
        user
          ? getDashboardRoute(user.role)
          : "/"
      }
      className="rounded-full border border-white/20 px-5 py-2 text-sm font-medium text-white transition hover:bg-white/10"
    >
      {dashboardLabel}
    </Link>

    <button
      onClick={logout}
      className="rounded-full bg-rose-500 px-5 py-2 text-sm font-medium text-white transition hover:bg-rose-600"
    >
      Logout
    </button>
  </div>
) : (
            <button
              onClick={openLogin}
              className="rounded-full bg-rose-500 px-6 py-2 font-semibold text-white transition hover:bg-rose-600"
            >
              Login
            </button>
          )}

          <CTAButton />
        </div>

        <div className="lg:hidden">
          <MobileNavigation />
        </div>
      </div>
    </header>
  );
}
