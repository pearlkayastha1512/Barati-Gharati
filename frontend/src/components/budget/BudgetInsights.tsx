"use client";

import { useMemo } from "react";

import {
  AlertTriangle,
  BadgeIndianRupee,
  Lightbulb,
  TrendingUp,
} from "lucide-react";

import { useExpenseStore } from "@/store/expenseStore";
import { useCustomerStore } from "@/store";

export default function BudgetInsights() {
  const expenses = useExpenseStore(
    (state) => state.expenses
  );

  const weddingBudget = useCustomerStore(
    (state) => state.weddingBudget
  );

  const insights = useMemo(() => {
    const totalSpent = expenses.reduce(
      (sum, expense) => sum + expense.amount,
      0
    );

    const budgetUsed =
      weddingBudget === 0
        ? 0
        : Math.round(
            (totalSpent / weddingBudget) * 100
          );

    const averageExpense =
      expenses.length === 0
        ? 0
        : Math.round(totalSpent / expenses.length);

    const categoryTotals: Record<string, number> = {};

    expenses.forEach((expense) => {
      categoryTotals[expense.category] =
        (categoryTotals[expense.category] || 0) +
        expense.amount;
    });

    const highestCategory =
      Object.entries(categoryTotals).sort(
        (a, b) => b[1] - a[1]
      )[0];

    return {
      totalSpent,
      budgetUsed,
      averageExpense,
      highestCategory,
    };
  }, [expenses, weddingBudget]);

  return (
    <section className="rounded-3xl border border-gray-200 bg-white p-7 shadow-sm">

      <h2 className="text-2xl font-bold text-gray-900">
        Budget Insights
      </h2>

      <p className="mt-2 text-gray-500">
        Smart insights from your wedding expenses.
      </p>

      <div className="mt-8 space-y-5">

        {/* Largest Category */}

        <div className="flex items-start gap-4 rounded-2xl bg-emerald-50 p-4">

          <TrendingUp
            className="mt-1 text-emerald-600"
            size={22}
          />

          <div>
            <h3 className="font-semibold text-gray-700">
              Highest Spending
            </h3>

            <p className="mt-1 text-sm text-gray-600">
              {insights.highestCategory
                ? `${insights.highestCategory[0]} • ₹${insights.highestCategory[1].toLocaleString(
                    "en-IN"
                  )}`
                : "No expenses yet"}
            </p>
          </div>

        </div>

        {/* Average */}

        <div className="flex items-start gap-4 rounded-2xl bg-blue-50 p-4">

          <BadgeIndianRupee
            className="mt-1 text-blue-600"
            size={22}
          />

          <div>

            <h3 className="font-semibold text-gray-600">
              Average Expense
            </h3>

            <p className="mt-1 text-sm text-gray-600">
              ₹
              {insights.averageExpense.toLocaleString(
                "en-IN"
              )}
            </p>

          </div>

        </div>

        {/* Budget Health */}

        <div
          className={`flex items-start gap-4 rounded-2xl p-4 ${
            insights.budgetUsed >= 80
              ? "bg-red-50"
              : "bg-yellow-50"
          }`}
        >

          <AlertTriangle
            size={22}
            className={`mt-1 ${
              insights.budgetUsed >= 80
                ? "text-red-600"
                : "text-yellow-600"
            }`}
          />

          <div>

            <h3 className="font-semibold text-gray-600">
              Budget Health
            </h3>

            <p className="mt-1 text-sm text-gray-600">
              {insights.budgetUsed >= 80
                ? `You've already used ${insights.budgetUsed}% of your budget.`
                : `${insights.budgetUsed}% of your budget has been used.`}
            </p>

          </div>

        </div>

        {/* Suggestion */}

        <div className="flex items-start gap-4 rounded-2xl bg-purple-50 p-4">

          <Lightbulb
            size={22}
            className="mt-1 text-purple-600"
          />

          <div>

            <h3 className="font-semibold text-gray-600">
              Recommendation
            </h3>

            <p className="mt-1 text-sm text-gray-600">
              {insights.budgetUsed >= 80
                ? "Focus on essential bookings and compare vendors before making additional payments."
                : "Your spending is healthy. Continue tracking expenses to stay within budget."}
            </p>

          </div>

        </div>

      </div>

    </section>
  );
}