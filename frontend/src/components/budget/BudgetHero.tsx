"use client";

import { useMemo, useState, useEffect } from "react";

import { motion } from "framer-motion";

import {
  Wallet,
  IndianRupee,
  Pencil,
  Check,
} from "lucide-react";

import { useCustomerStore } from "@/store";
import { useExpenseStore } from "@/store/expenseStore";
import { toast } from "sonner";

export default function BudgetHero() {
 const expenses = useExpenseStore(
  (state) => state.expenses
);
  const weddingBudget = useCustomerStore(
    (state) => state.weddingBudget
  );

  const setWeddingBudget = useCustomerStore(
    (state) => state.setWeddingBudget
  );

  const [editing, setEditing] =
    useState(false);

  const [budgetInput, setBudgetInput] =
    useState(weddingBudget.toString());

  useEffect(() => {
    setBudgetInput(
      weddingBudget.toString()
    );
  }, [weddingBudget]);

const {
  totalSpent,
  budgetRemaining,
  percentage,
  expenseCount,
} = useMemo(() => {
  const totalSpent = expenses.reduce(
    (sum, expense) => sum + expense.amount,
    0
  );

  const budgetRemaining = Math.max(
    weddingBudget - totalSpent,
    0
  );

  const percentage =
    weddingBudget === 0
      ? 0
      : Math.round(
          (totalSpent / weddingBudget) * 100
        );

  return {
    totalSpent,
    budgetRemaining,
    percentage,
    expenseCount: expenses.length,
  };
}, [expenses, weddingBudget]);

  const saveBudget = () => {
    const value = Number(budgetInput);

    if (
      Number.isNaN(value) ||
      value <= 0
    ) {
      toast.error(
        "Please enter a valid budget."
      );
      return;
    }

    setWeddingBudget(value);

    toast.success(
      "Wedding budget updated."
    );

    setEditing(false);
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-emerald-500 via-green-500 to-teal-600 p-8 text-white shadow-xl"
    >
      <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />

      <div className="absolute -left-24 -bottom-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />

      <div className="relative z-10 grid gap-8 lg:grid-cols-2">

        {/* Left */}

        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 backdrop-blur">
            <Wallet size={16} />

            <span className="text-sm font-medium">
              Wedding Budget
            </span>
          </div>

          <h1 className="mt-6 text-5xl font-bold leading-tight">
            Keep every
            <br />
            expense under control.
          </h1>

          <p className="mt-6 max-w-xl text-lg text-green-100">
            Track spending, monitor your remaining budget,
            and make smarter wedding planning decisions.
          </p>
        </div>

        {/* Right */}

        <div className="rounded-3xl bg-white/10 p-6 backdrop-blur">

          <div className="flex items-center justify-between">

            <div className="flex items-center gap-3">

              <IndianRupee size={22} />

              <h3 className="text-xl font-semibold">
                Budget Overview
              </h3>

            </div>

            {!editing ? (
              <button
                onClick={() =>
                  setEditing(true)
                }
                className="rounded-xl bg-white/20 p-2 transition hover:bg-white/30"
              >
                <Pencil size={18} />
              </button>
            ) : (
              <button
                onClick={saveBudget}
                className="rounded-xl bg-white/20 p-2 transition hover:bg-white/30"
              >
                <Check size={18} />
              </button>
            )}

          </div>

          <div className="mt-8 space-y-5">

            <div className="flex items-center justify-between">

              <span>Total Budget</span>

              {editing ? (
                <input
                  type="number"
                  value={budgetInput}
                  onChange={(e) =>
                    setBudgetInput(
                      e.target.value
                    )
                  }
                  className="w-40 rounded-xl px-3 py-2 text-right text-black outline-none"
                />
              ) : (
                <span className="font-semibold">
                  ₹{weddingBudget.toLocaleString("en-IN")}
                </span>
              )}

            </div>

            <div className="flex justify-between">

             <span>Total Expenses</span>

<span className="font-semibold">
  ₹{totalSpent.toLocaleString("en-IN")}
</span>

            </div>

            <div className="flex justify-between">

             <span>Transactions</span>

<span className="font-semibold">
  {expenseCount}
</span>

            </div>

            <div className="flex justify-between">

              <span>Budget Remaining</span>

              <span className="font-semibold">
                ₹{budgetRemaining.toLocaleString("en-IN")}
              </span>

            </div>

          </div>

          <div className="mt-8">

            <div className="mb-2 flex justify-between text-sm">

              <span>Budget Used</span>

              <span>{percentage}%</span>

            </div>

            <div className="h-3 rounded-full bg-white/20">

              <div
                style={{
                  width: `${Math.min(percentage,100)}%`,
                }}
                className="h-3 rounded-full bg-white"
              />

            </div>

          </div>

        </div>

      </div>
    </motion.section>
  );
}