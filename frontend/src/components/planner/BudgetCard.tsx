"use client";

import { useMemo } from "react";

import { Wallet } from "lucide-react";

import { useBookingStore } from "@/store/bookingStore";
import { useCustomerStore } from "@/store";

export default function BudgetCard() {
  const bookings = useBookingStore(
    (state) => state.bookings
  );

  const weddingBudget = useCustomerStore(
    (state) => state.weddingBudget
  );

  const { spent, remaining, percentageUsed } =
    useMemo(() => {
      const spent = bookings.reduce(
        (sum, booking) =>
          sum + booking.advancePaid,
        0
      );

      const remaining = Math.max(
        weddingBudget - spent,
        0
      );

      const percentageUsed =
        weddingBudget === 0
          ? 0
          : Math.min(
              Math.round(
                (spent / weddingBudget) * 100
              ),
              100
            );

      return {
        spent,
        remaining,
        percentageUsed,
      };
    }, [bookings, weddingBudget]);

  return (
    <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">

      <div className="flex items-center gap-3">

        <div className="rounded-2xl bg-emerald-100 p-3">

          <Wallet
            size={22}
            className="text-emerald-600"
          />

        </div>

        <div>

          <h3 className="font-semibold text-gray-900">
            Wedding Budget
          </h3>

          <p className="text-sm text-gray-500">
            Current spending
          </p>

        </div>

      </div>

      <div className="mt-8">

        <p className="text-4xl font-bold text-gray-900">
          ₹{remaining.toLocaleString("en-IN")}
        </p>

        <p className="mt-2 text-sm text-gray-500">
          Remaining Budget
        </p>

        <div className="mt-6 h-3 rounded-full bg-gray-100">

          <div
            style={{
              width: `${percentageUsed}%`,
            }}
            className="h-3 rounded-full bg-gradient-to-r from-emerald-500 to-green-500 transition-all duration-500"
          />

        </div>

        <div className="mt-4 flex justify-between text-sm">

          <span className="text-gray-500">
            {percentageUsed}% Used
          </span>

          <span className="font-semibold text-gray-800">
            ₹{weddingBudget.toLocaleString("en-IN")}
          </span>

        </div>

        <div className="mt-6 rounded-2xl bg-emerald-50 p-4">

          <div className="flex items-center justify-between">

            <span className="text-sm text-gray-600">
              Advance Paid
            </span>

            <span className="font-semibold text-emerald-600">
              ₹{spent.toLocaleString("en-IN")}
            </span>

          </div>

        </div>

      </div>

    </div>
  );
}