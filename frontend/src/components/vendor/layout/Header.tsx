"use client";

import NotificationBell from "@/components/layout/navbar/NotificationBell";
import { useAuthStore } from "@/store/authStore";
import { useVendorProfile } from "@/hooks/useVendorProfile";

export default function Header() {
  const { user } = useAuthStore();
  const { vendor } = useVendorProfile();

  const displayName =
    vendor?.ownerName || user?.name || "Guest";

  const displayInitial =
    displayName.charAt(0).toUpperCase();

  return (
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-[#f4c8a0] bg-[#fffaf3]/95 px-8 shadow-sm shadow-[#e4005a]/5 backdrop-blur">

      {/* Left */}
      <div>
        <h1 className="text-3xl font-bold text-[#4d1730]">
          Vendor Dashboard
        </h1>

        <p className="mt-1 text-sm text-[#946176]">
          Manage your wedding business.
        </p>
      </div>

      {/* Right */}
      <div className="flex items-center gap-4">

        <div className="rounded-2xl bg-[#ffe9bf] p-1 transition-all duration-300 hover:bg-[#ffd6e5]">
          <NotificationBell />
        </div>
        {/* Profile */}
        <button className="flex items-center gap-3 rounded-2xl border border-[#ffb3bf] bg-white/90 px-3 py-2 transition-all duration-300 hover:border-[#ff8fa1] hover:shadow-md hover:shadow-[#ff4d6d]/10">

          <div className="relative">

            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-r from-[#ff4d6d] to-[#ff8fa1] font-bold text-white">
              {vendor?.profileImage ? (
                <img
                  src={vendor.profileImage}
                  alt={displayName}
                  className="h-full w-full rounded-full object-cover"
                />
              ) : (
                displayInitial
              )}
            </div>

            <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-green-500" />

          </div>

          <div className="hidden text-left lg:block">

            <p className="font-semibold text-[#3f1d2f]">
              {displayName}
            </p>

            <p className="text-xs text-[#8d6171]">
              Wedding Planner
            </p>

          </div>

          {/* <ChevronDown
            size={18}
            className="hidden text-[#8d6171] lg:block"
          /> */}

        </button>
      </div>

    </header>
  );
}
