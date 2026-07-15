"use client";

import NotificationBell from "@/components/layout/navbar/NotificationBell";
import { useAuthStore } from "@/store/authStore";
import { ADMIN_ROLE_LABELS } from "@/lib/adminAccess";

export default function AdminHeader() {
  const user = useAuthStore((state) => state.user);
  const roleLabel = user?.adminRole
    ? ADMIN_ROLE_LABELS[user.adminRole]
    : "Super Admin";
  return (
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-slate-200 bg-white px-8 shadow-sm">

      {/* Left */}

      <div>

        <h1 className="text-3xl font-bold text-slate-900">
          {roleLabel} Dashboard
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Signed in as {user?.name ?? "Administrator"}. Your assigned access is enforced securely.
        </p>

      </div>

      {/* Right */}

      <div className="flex items-center gap-4">

        <div className="rounded-2xl bg-slate-100 p-1 transition-all duration-300 hover:bg-blue-50">

          <NotificationBell />

        </div>

      </div>

    </header>
  );
}
