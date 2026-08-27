


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
import { useVendorProfile } from "@/hooks/useVendorProfile";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const { vendor } = useVendorProfile();

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

  const displayName =
    user?.role === "vendor"
      ? vendor?.ownerName || user?.name
      : user?.name;

  const displayImage =
    user?.role === "vendor"
      ? vendor?.profileImage
      : undefined;

  const displayInitial =
    displayName?.charAt(0).toUpperCase() ?? "";

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
      className={`fixed inset-x-0 top-5 z-50 px-4 sm:px-6 transition-all duration-500 ${
        scrolled ? "top-3" : "top-5"
      }`}
    >
      <div
        className={`mx-auto flex h-20 max-w-7xl items-center justify-between rounded-3xl border px-4 sm:px-6 xl:px-8 transition-all duration-500 ${
          scrolled
            ? "border-white/20 bg-black/30 backdrop-blur-xl shadow-2xl"
            : "border-white/10 bg-black/20 backdrop-blur-xl"
        }`}
      >
        <Logo />

        <div className="hidden lg:flex">
          <DesktopNavigation />
        </div>

        <div className="hidden items-center gap-3 xl:gap-4 lg:flex">
          {isAuthenticated ? (
            <div className="ml-2 flex shrink-0 items-center gap-2 xl:gap-3 border-l border-white/10 pl-3 xl:pl-4">
              <div className="flex h-9 w-9 xl:h-10 xl:w-10 items-center justify-center overflow-hidden rounded-full bg-rose-500 font-bold text-white text-xs xl:text-sm shrink-0">
                {displayImage ? (
                  <img
                    src={displayImage}
                    alt={displayName ?? "User"}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  displayInitial
                )}
              </div>

              <div className="min-w-0 max-w-24 xl:max-w-32">
                <p className="truncate text-xs xl:text-sm font-semibold leading-tight text-white">
                  {displayName}
                </p>

                <p className="text-[10px] xl:text-xs text-gray-300 capitalize truncate">
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
                className="whitespace-nowrap rounded-full border border-white/20 px-3.5 py-1.5 xl:px-4 xl:py-2 text-xs xl:text-sm font-medium text-white transition hover:bg-white/10"
              >
                {dashboardLabel}
              </Link>

              <button
                onClick={logout}
                className="whitespace-nowrap rounded-full bg-rose-500 px-3.5 py-1.5 xl:px-4 xl:py-2 text-xs xl:text-sm font-medium text-white transition hover:bg-rose-600"
              >
                Logout
              </button>
            </div>
          ) : (
            <button
              onClick={openLogin}
              className="rounded-full bg-rose-500 px-4 xl:px-5 py-2 text-xs xl:text-sm font-semibold text-white transition hover:bg-rose-600"
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
