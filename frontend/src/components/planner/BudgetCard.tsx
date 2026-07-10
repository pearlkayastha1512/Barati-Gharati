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
    <div className="rounded-3xl border border-[#ffb3bf] bg-[#fffdf0] p-6 shadow-sm">

      <div className="flex items-center gap-3">

        <div className="rounded-2xl bg-[#fff8d8] p-3">

          <Wallet
            size={22}
            className="text-[#ff4d6d]"
          />

        </div>

        <div>

          <h3 className="font-semibold text-[#3f1d2f]">
            Wedding Budget
          </h3>

          <p className="text-sm text-[#8d6171]">
            Current spending
          </p>

        </div>

      </div>

      <div className="mt-8">

        <p className="text-4xl font-bold text-[#3f1d2f]">
          ₹{remaining.toLocaleString("en-IN")}
        </p>

        <p className="mt-2 text-sm text-[#8d6171]">
          Remaining Budget
        </p>

        <div className="mt-6 h-3 rounded-full bg-[#fff8d8]">

          <div
            style={{
              width: `${percentageUsed}%`,
            }}
            className="h-3 rounded-full bg-gradient-to-r from-[#ff4d6d] to-[#fff3b0] transition-all duration-500"
          />

        </div>

        <div className="mt-4 flex justify-between text-sm">

          <span className="text-[#8d6171]">
            {percentageUsed}% Used
          </span>

          <span className="font-semibold text-[#3f1d2f]">
            ₹{weddingBudget.toLocaleString("en-IN")}
          </span>

        </div>

        <div className="mt-6 rounded-2xl bg-[#fff8d8] p-4">

          <div className="flex items-center justify-between">

            <span className="text-sm text-[#7a4a5c]">
              Advance Paid
            </span>

            <span className="font-semibold text-[#ff4d6d]">
              ₹{spent.toLocaleString("en-IN")}
            </span>

          </div>

        </div>

      </div>

    </div>
  );
}