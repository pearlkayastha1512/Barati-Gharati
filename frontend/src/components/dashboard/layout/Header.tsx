

"use client";

import {
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
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-[#ffb3bf] bg-[#fffef7]/90 px-8 shadow-sm shadow-[#ff4d6d]/5 backdrop-blur-xl">

      {/* Left */}
      <div>
        <h1 className="text-3xl font-bold text-[#3f1d2f]">
          Wedding Dashboard
        </h1>

        <p className="mt-1 text-sm text-[#8d6171]">
          {greeting},{" "}
          <span className="font-semibold text-[#6c2d45]">
            {firstName}
          </span>{" "}
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

        

       <div className="rounded-2xl bg-[#ffe6eb] p-1 transition-all duration-300 hover:-translate-y-1 hover:bg-[#ffdce4]">
  <NotificationBell />
</div>

        {/* Profile */}
        <button className="flex items-center gap-3 rounded-2xl border border-[#ffb3bf] bg-white/90 px-3 py-2 transition-all duration-300 hover:border-[#ff8fa1] hover:shadow-md hover:shadow-[#ff4d6d]/10">

          <div className="relative">

            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-r from-[#ff4d6d] to-[#ff8fa1] font-bold text-white">
              {firstName.charAt(0)}
            </div>

            <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-green-500" />

          </div>

          <div className="hidden text-left lg:block">

            <p className="font-semibold text-[#3f1d2f]">
              {user?.name}
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
