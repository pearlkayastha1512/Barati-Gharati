"use client";

import { ReactNode } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  return (
    <div className="flex h-screen bg-[#fff5f7] text-[#3a1b2a]">

      {/* Sidebar */}
      <Sidebar />

      {/* Right Section */}
      <div className="flex min-w-0 flex-1 flex-col">

        {/* Header */}
        <Header />

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto bg-[radial-gradient(circle_at_top_left,rgba(255,77,109,0.18),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(255,77,109,0.1),transparent_30%),linear-gradient(135deg,#fffdf0_0%,#ffe6eb_46%,#fffef7_100%)]">
          <div className="mx-auto w-full max-w-[1600px] p-8">
            {children}
          </div>
        </main>

      </div>

    </div>
  );
}
