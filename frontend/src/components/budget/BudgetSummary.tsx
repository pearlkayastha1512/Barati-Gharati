"use client";

import { useMemo } from "react";

import { motion } from "framer-motion";

import {
  Wallet,
  TrendingDown,
  PiggyBank,
  Receipt,
} from "lucide-react";

import { useCustomerStore } from "@/store";
import { useExpenseStore } from "@/store/expenseStore";

export default function BudgetSummary() {
  const expenses = useExpenseStore(
    (state) => state.expenses
  );

  const weddingBudget = useCustomerStore(
    (state) => state.weddingBudget
  );

  const stats = useMemo(() => {
    const totalSpent = expenses.reduce(
      (sum, expense) => sum + expense.amount,
      0
    );

    const remaining = Math.max(
      weddingBudget - totalSpent,
      0
    );

    const budgetUsed =
      weddingBudget === 0
        ? 0
        : Math.round(
            (totalSpent / weddingBudget) * 100
          );

    return [
      {
        title: "Total Budget",
        value: `₹${weddingBudget.toLocaleString("en-IN")}`,
        subtitle: "Wedding Budget",
        icon: Wallet,
        color: "bg-[#fff8d8] text-[#ff4d6d]",
      },
      {
        title: "Spent",
        value: `₹${totalSpent.toLocaleString("en-IN")}`,
        subtitle: `${budgetUsed}% of budget used`,
        icon: TrendingDown,
        color: "bg-red-100 text-red-600",
      },
      {
        title: "Remaining",
        value: `₹${remaining.toLocaleString("en-IN")}`,
        subtitle: "Available Budget",
        icon: PiggyBank,
        color: "bg-[#ffe6eb] text-[#ff4d6d]",
      },
      {
        title: "Transactions",
        value: expenses.length.toString(),
        subtitle: "Expenses Added",
        icon: Receipt,
        color: "bg-[#fff3b0] text-[#111111]",
      },
    ];
  }, [expenses, weddingBudget]);

  return (
    <section className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((item, index) => {
        const Icon = item.icon;

        return (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: index * 0.08,
            }}
            className="
              rounded-3xl
              border
              border-[#ffb3bf]
              bg-[#fffdf0]
              p-6
              shadow-sm
              transition-all
              duration-300
              hover:-translate-y-1
              hover:shadow-xl
            "
          >
            <div className="flex items-start justify-between">
              <div
                className={`rounded-2xl p-3 ${item.color}`}
              >
                <Icon size={24} />
              </div>

              <span className="rounded-full bg-[#fff8d8] px-3 py-1 text-xs font-semibold text-[#111111]">
                Live
              </span>
            </div>

            <h3 className="mt-6 text-sm text-[#8d6171]">
              {item.title}
            </h3>

            <p className="mt-2 text-3xl font-bold text-[#3f1d2f]">
              {item.value}
            </p>

            <p className="mt-2 text-sm text-[#8d6171]">
              {item.subtitle}
            </p>
          </motion.div>
        );
      })}
    </section>
  );
}