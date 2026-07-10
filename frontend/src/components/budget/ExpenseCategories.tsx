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
    Venue: "bg-[#ff4d6d]",

    Photographer: "bg-[#fff8d8]0",
    Photography: "bg-[#fff8d8]0",
    Videographer: "bg-[#fff8d8]0",

    Caterer: "bg-[#fff8d8]0",
    Catering: "bg-[#fff8d8]0",

    Decorator: "bg-[#ff4d6d]",
    Decoration: "bg-[#ff4d6d]",

    DJ: "bg-[#fff8d8]0",
    Entertainment: "bg-[#fff8d8]0",
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
          "bg-[#ff8fa1]",
      }))
      .sort((a, b) => b.amount - a.amount);
  }, [expenses, weddingBudget]);

  return (
    <section className="rounded-3xl border border-[#ffb3bf] bg-[#fffdf0] p-6 shadow-sm">
      <h2 className="text-xl font-bold text-[#3f1d2f]">
        Expense Categories
      </h2>

      <p className="mt-1 text-sm text-[#8d6171]">
        Spending distribution by category.
      </p>

      <div className="mt-6 space-y-6">
        {categories.length === 0 ? (
          <div className="py-10 text-center text-[#8d6171]">
            No expenses added yet.
          </div>
        ) : (
          categories.map((item) => {
            const Icon = item.icon;

            return (
              <div key={item.title}>
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-[#fff8d8] p-2">
                      <Icon
                        size={18}
                        className="text-[#6c2d45]"
                      />
                    </div>

                    <span className="font-medium text-[#6c2d45]">
                      {item.title}
                    </span>
                  </div>

                  <span className="font-semibold text-[#ff4d6d]">
                    ₹
                    {item.amount.toLocaleString(
                      "en-IN"
                    )}
                  </span>
                </div>

                <div className="h-2 rounded-full bg-[#fff8d8]">
                  <div
                    style={{
                      width: `${item.progress}%`,
                    }}
                    className={`h-2 rounded-full ${item.color}`}
                  />
                </div>

                <div className="mt-2 flex justify-between text-xs text-[#8d6171]">
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