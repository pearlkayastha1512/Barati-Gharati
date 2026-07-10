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
    <div className="flex h-screen bg-[#fff8ef] text-[#321827]">

      {/* Sidebar */}

       <Sidebar /> 

      {/* Right Section */}

      <div className="flex min-w-0 flex-1 flex-col">

        <Header />

        <main className="flex-1 overflow-y-auto bg-[radial-gradient(circle_at_top_left,rgba(228,0,90,0.08),transparent_30%),linear-gradient(135deg,#fff8ef_0%,#fff3dc_46%,#fff9f1_100%)]">

          <div className="mx-auto w-full max-w-[1700px] p-8">

            {children}

          </div>

        </main>

      </div>

    </div>
  );
}
