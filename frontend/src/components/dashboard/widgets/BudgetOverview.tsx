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
    <div className="rounded-3xl border border-gray-200 bg-white shadow-sm">

      {/* Header */}

      <div className="border-b border-gray-100 px-7 py-6">

        <div className="flex items-center gap-3">

          <div className="rounded-2xl bg-rose-50 p-3">

            <Wallet
              className="text-rose-500"
              size={22}
            />

          </div>

          <div>

            <h2 className="text-2xl font-bold text-gray-900">
              Budget Overview
            </h2>

            <p className="text-sm text-gray-500">
              Wedding spending summary
            </p>

          </div>

        </div>

      </div>

      <div className="space-y-7 p-7">

        {/* Budget */}

        <div>

          <div className="mb-2 flex justify-between">

            <span className="text-gray-500">
              Budget Used
            </span>

            <span className="font-semibold text-rose-500">
              {percentage}%
            </span>

          </div>

          <div className="h-3 rounded-full bg-gray-100">

            <div
              style={{
                width: `${percentage}%`,
              }}
              className="h-3 rounded-full bg-gradient-to-r from-rose-500 to-pink-500"
            />

          </div>

        </div>

        {/* Stats */}

        <div className="space-y-5">

          <div className="flex items-center justify-between">

            <div className="flex items-center gap-3">

              <CircleDollarSign
                className="text-green-500"
                size={20}
              />

              <span>Total Budget</span>

            </div>

            <span className="font-bold">
            ₹{totalBudget.toLocaleString("en-IN")}
            </span>

          </div>

          <div className="flex items-center justify-between">

            <div className="flex items-center gap-3">

              <TrendingUp
                className="text-red-500"
                size={20}
              />

              <span>Spent</span>

            </div>

            <span className="font-bold text-red-500">
             ₹{spent.toLocaleString("en-IN")}
            </span>

          </div>

          <div className="flex items-center justify-between">

            <div className="flex items-center gap-3">

              <Wallet
                className="text-rose-500"
                size={20}
              />

              <span>Remaining</span>

            </div>

            <span className="font-bold text-green-600">
             ₹{remaining.toLocaleString("en-IN")}
            </span>

          </div>

        </div>

      </div>

    </div>
  );
}