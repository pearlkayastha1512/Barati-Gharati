"use client";

import NotificationBell from "@/components/layout/navbar/NotificationBell";

export default function Header() {
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

      </div>

    </header>
  );
}
