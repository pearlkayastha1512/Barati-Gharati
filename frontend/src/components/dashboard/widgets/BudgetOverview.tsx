"use client";

import { useMemo } from "react";

import {
  Wallet,
  TrendingUp,
  CircleDollarSign,
} from "lucide-react";

import { useBookingStore } from "@/store/bookingStore";



export default function BudgetOverview() {

  const bookings = useBookingStore(
  (state) => state.bookings
);

const totalBudget = useMemo(() => {
  return bookings.reduce(
    (sum, booking) => sum + booking.amount,
    0
  );
}, [bookings]);

const spent = useMemo(() => {
  return bookings.reduce(
    (sum, booking) => sum + booking.advancePaid,
    0
  );
}, [bookings]);

const remaining = useMemo(() => {
  return bookings.reduce(
    (sum, booking) => sum + booking.remainingAmount,
    0
  );
}, [bookings]);

const percentage =
  totalBudget === 0
    ? 0
    : Math.round((spent / totalBudget) * 100);
  return (
    <div className="rounded-3xl border border-[#ffb3bf] bg-white/90 shadow-sm shadow-[#ff4d6d]/5">

      {/* Header */}

      <div className="border-b border-[#ffcad3] px-7 py-6">

        <div className="flex items-center gap-3">

          <div className="rounded-2xl bg-[#ffe6eb] p-3">

            <Wallet
              className="text-[#ff4d6d]"
              size={22}
            />

          </div>

          <div>

            <h2 className="text-2xl font-bold text-[#3f1d2f]">
              Wedding Budget
            </h2>

            <p className="text-sm text-[#8d6171]">
              Track advances, balances and planned spending.
            </p>

          </div>

        </div>

      </div>

      <div className="space-y-7 p-7">

        {/* Budget */}

        <div>

          <div className="mb-2 flex justify-between">

            <span className="text-[#8d6171]">
              Budget Used
            </span>

            <span className="font-semibold text-[#ff4d6d]">
              {percentage}%
            </span>

          </div>

          <div className="h-3 rounded-full bg-[#ffe6eb]">

            <div
              style={{
                width: `${percentage}%`,
              }}
              className="h-3 rounded-full bg-gradient-to-r from-[#ff4d6d] to-[#ff8fa1]"
            />

          </div>

        </div>

        {/* Stats */}

        <div className="space-y-5">

          <div className="flex items-center justify-between rounded-2xl border border-[#ffcad3] bg-[#fff5f7] p-4">

            <div className="flex items-center gap-3">

              <CircleDollarSign
                className="text-[#ff4d6d]"
                size={20}
              />

              <span>Total Budget</span>

            </div>

            <span className="font-bold">
            ₹{totalBudget.toLocaleString("en-IN")}
            </span>

          </div>

          <div className="flex items-center justify-between rounded-2xl border border-[#ffcad3] bg-[#fff5f7] p-4">

            <div className="flex items-center gap-3">

              <TrendingUp
                className="text-[#ff4d6d]"
                size={20}
              />

              <span>Spent</span>

            </div>

            <span className="font-bold text-[#ff4d6d]">
             ₹{spent.toLocaleString("en-IN")}
            </span>

          </div>

          <div className="flex items-center justify-between rounded-2xl border border-[#ffcad3] bg-[#fff5f7] p-4">

            <div className="flex items-center gap-3">

              <Wallet
                className="text-[#ff4d6d]"
                size={20}
              />

              <span>Remaining</span>

            </div>

            <span className="font-bold text-[#ff4d6d]">
             ₹{remaining.toLocaleString("en-IN")}
            </span>

          </div>

        </div>

      </div>

    </div>
  );
}
