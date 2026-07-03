"use client";

import { useMemo } from "react";

import {
  Building2,
  Camera,
  UtensilsCrossed,
  Flower2,
  Music4,
  Sparkles,
} from "lucide-react";

import { useExpenseStore } from "@/store/expenseStore";
import { useCustomerStore } from "@/store";

export default function ExpenseCategories() {
  const expenses = useExpenseStore(
    (state) => state.expenses
  );

  const weddingBudget = useCustomerStore(
    (state) => state.weddingBudget
  );

  const iconMap: Record<string, any> = {
    Venue: Building2,

    Photographer: Camera,
    Photography: Camera,
    Videographer: Camera,

    Caterer: UtensilsCrossed,
    Catering: UtensilsCrossed,

    Decorator: Flower2,
    Decoration: Flower2,

    DJ: Music4,
    Entertainment: Music4,
  };

  const colorMap: Record<string, string> = {
    Venue: "bg-indigo-500",

    Photographer: "bg-blue-500",
    Photography: "bg-blue-500",
    Videographer: "bg-blue-500",

    Caterer: "bg-green-500",
    Catering: "bg-green-500",

    Decorator: "bg-pink-500",
    Decoration: "bg-pink-500",

    DJ: "bg-yellow-500",
    Entertainment: "bg-yellow-500",
  };

  const categories = useMemo(() => {
    const grouped: Record<
      string,
      {
        amount: number;
      }
    > = {};

    expenses.forEach((expense) => {
      if (!grouped[expense.category]) {
        grouped[expense.category] = {
          amount: 0,
        };
      }

      grouped[expense.category].amount +=
        expense.amount;
    });

    return Object.entries(grouped)
      .map(([category, value]) => ({
        title: category,

        amount: value.amount,

        progress:
          weddingBudget === 0
            ? 0
            : Math.min(
                Math.round(
                  (value.amount /
                    weddingBudget) *
                    100
                ),
                100
              ),

        icon:
          iconMap[category] ??
          Sparkles,

        color:
          colorMap[category] ??
          "bg-gray-500",
      }))
      .sort((a, b) => b.amount - a.amount);
  }, [expenses, weddingBudget]);

  return (
    <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-bold text-gray-900">
        Expense Categories
      </h2>

      <p className="mt-1 text-sm text-gray-500">
        Spending distribution by category.
      </p>

      <div className="mt-6 space-y-6">
        {categories.length === 0 ? (
          <div className="py-10 text-center text-gray-500">
            No expenses added yet.
          </div>
        ) : (
          categories.map((item) => {
            const Icon = item.icon;

            return (
              <div key={item.title}>
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-gray-100 p-2">
                      <Icon
                        size={18}
                        className="text-gray-700"
                      />
                    </div>

                    <span className="font-medium text-gray-700">
                      {item.title}
                    </span>
                  </div>

                  <span className="font-semibold text-rose-500">
                    ₹
                    {item.amount.toLocaleString(
                      "en-IN"
                    )}
                  </span>
                </div>

                <div className="h-2 rounded-full bg-gray-100">
                  <div
                    style={{
                      width: `${item.progress}%`,
                    }}
                    className={`h-2 rounded-full ${item.color}`}
                  />
                </div>

                <div className="mt-2 flex justify-between text-xs text-gray-500">
                  <span>
                    {item.progress}% of budget
                  </span>

                  <span>
                    ₹
                    {weddingBudget.toLocaleString(
                      "en-IN"
                    )}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}