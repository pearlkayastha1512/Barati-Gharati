

"use client";

import {
  MessageCircle,
  ChevronDown,
} from "lucide-react";

import NotificationBell from "@/components/layout/navbar/NotificationBell";
import { useAuthStore } from "@/store/authStore";

export default function Header() {
  const { user } = useAuthStore();

  const firstName = user?.name?.split(" ")[0] || "Guest";

  const hour = new Date().getHours();

  let greeting = "Good Evening";

  if (hour < 12) greeting = "Good Morning";
  else if (hour < 18) greeting = "Good Afternoon";

  return (
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-gray-200 bg-white/80 px-8 backdrop-blur-xl shadow-sm">

      {/* Left */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Dashboard
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          {greeting},{" "}
          <span className="font-semibold text-gray-700">
            {firstName}
          </span>{" "}
          👋
        </p>
      </div>

      {/* Right */}
      <div className="flex items-center gap-4">

       
        {/* <button
  className="flex h-14 w-10 items-center justify-center rounded-2xl
             bg-gray-300 text-gray-700
             transition-all duration-300
             hover:-translate-y-1
             hover:bg-rose-50
             hover:text-rose-500"
>
  <MessageCircle className="h-7 w-7" />
</button> */}

        

       <div className="rounded-2xl bg-gray-300 p-1 transition-all duration-300 hover:-translate-y-1 hover:bg-rose-50">
  <NotificationBell />
</div>

        {/* Profile */}
        <button className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-white px-3 py-2 transition-all duration-300 hover:border-rose-200 hover:shadow-md">

          <div className="relative">

            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-r from-rose-500 to-pink-500 font-bold text-white">
              {firstName.charAt(0)}
            </div>

            <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-green-500" />

          </div>

          <div className="hidden text-left lg:block">

            <p className="font-semibold text-gray-800">
              {user?.name}
            </p>

            <p className="text-xs text-gray-500">
              Customer
            </p>

          </div>

          <ChevronDown
            size={18}
            className="hidden text-gray-500 lg:block"
          />

        </button>

      </div>

    </header>
  );
}