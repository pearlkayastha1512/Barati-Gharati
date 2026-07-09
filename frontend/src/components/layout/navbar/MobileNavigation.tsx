"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, LayoutDashboard, LogIn, LogOut, Menu, X } from "lucide-react";
import { navLinks } from "./nav-links";
import { useAuthStore } from "@/store/authStore";
import { useUIStore } from "@/store/uiStore";
import { getDashboardRoute } from "@/lib/auth";

export default function MobileNavigation() {
  const pathname = usePathname();
  const { mobileMenuOpen, toggleMobileMenu, closeMobileMenu } = useUIStore();
  const { isAuthenticated, user, openLogin, logout } = useAuthStore();

  useEffect(() => {
    closeMobileMenu();
  }, [pathname, closeMobileMenu]);

  useEffect(() => {
    if (!mobileMenuOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeMobileMenu();
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen, closeMobileMenu]);

  const handleLogin = () => {
    closeMobileMenu();
    openLogin();
  };

  const handleLogout = () => {
    closeMobileMenu();
    logout();
  };

  return (
    <>
      <button
        type="button"
        onClick={toggleMobileMenu}
        className="relative z-[70] flex h-12 w-12 items-center justify-center rounded-xl border border-white/50 text-white transition hover:bg-white/10"
        aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
        aria-expanded={mobileMenuOpen}
        aria-controls="mobile-navigation"
      >
        {mobileMenuOpen ? <X size={25} /> : <Menu size={25} />}
      </button>

      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <button
            type="button"
            className="absolute inset-0 cursor-default bg-black/65 backdrop-blur-sm"
            onClick={closeMobileMenu}
            aria-label="Close menu"
          />

          <nav
            id="mobile-navigation"
            aria-label="Mobile navigation"
            className="absolute inset-x-5 top-28 overflow-hidden rounded-2xl border border-white/15 bg-[#211316] p-3 shadow-2xl"
          >
            <ul className="divide-y divide-white/10">
              {navLinks.map((item) => {
                const active =
                  item.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(item.href);

                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`flex min-h-12 items-center px-4 text-base font-medium transition ${
                        active
                          ? "text-rose-300"
                          : "text-white hover:bg-white/5 hover:text-rose-200"
                      }`}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>

            <div className="mt-3 grid gap-2 border-t border-white/10 pt-3">
              {isAuthenticated && user ? (
                <>
                  <Link
                    href={getDashboardRoute(user.role)}
                    className="flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/20 px-4 font-semibold text-white transition hover:bg-white/10"
                  >
                    <LayoutDashboard size={18} />
                    Dashboard
                  </Link>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex min-h-12 items-center justify-center gap-2 rounded-xl border border-rose-400/40 px-4 font-semibold text-rose-200 transition hover:bg-rose-500/10"
                  >
                    <LogOut size={18} />
                    Logout
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={handleLogin}
                  className="flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/20 px-4 font-semibold text-white transition hover:bg-white/10"
                >
                  <LogIn size={18} />
                  Login
                </button>
              )}

              <Link
                href="/vendors"
                className="flex min-h-12 items-center justify-center gap-2 rounded-xl bg-rose-500 px-4 font-semibold text-white transition hover:bg-rose-600"
              >
                Start Planning
                <ArrowRight size={18} />
              </Link>
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
