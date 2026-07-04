"use client";

import { ReactNode } from "react";

import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar */}

      <AdminSidebar />

      {/* Right Section */}

      <div className="flex min-w-0 flex-1 flex-col">
        <AdminHeader />

        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto w-full max-w-[1700px] p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}