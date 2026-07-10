"use client";

import { RefreshCcw } from "lucide-react";

import { useVendorProfile } from "@/hooks/useVendorProfile";

interface VendorProfileShellProps {
  children: React.ReactNode;
}

export default function VendorProfileShell({
  children,
}: VendorProfileShellProps) {
  const { vendor, isLoading, error } =
    useVendorProfile();

  if (isLoading) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-10 shadow-sm">
        <div className="h-8 w-56 animate-pulse rounded bg-slate-200" />
        <div className="mt-6 h-36 animate-pulse rounded-3xl bg-slate-100" />
      </div>
    );
  }

  if (!vendor) {
    return (
      <section className="rounded-3xl border border-amber-200 bg-amber-50 p-8 shadow-sm">
        <h2 className="text-2xl font-bold text-slate-900">
          Vendor Profile Not Loaded
        </h2>

        <p className="mt-3 max-w-2xl text-slate-600">
          {error ??
            "We could not load your vendor profile right now."}{" "}
          Please make sure the backend is running with the latest changes.
        </p>

        <button
          onClick={() => window.location.reload()}
          className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 font-semibold text-white transition hover:bg-slate-800"
        >
          <RefreshCcw size={18} />
          Reload Profile
        </button>
      </section>
    );
  }

  return <>{children}</>;
}
