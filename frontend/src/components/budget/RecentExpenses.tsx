"use client";

import { useMemo } from "react";

import {
  CalendarDays,
  IndianRupee,
} from "lucide-react";

import { useExpenseStore } from "@/store/expenseStore";

export default function RecentExpenses() {
  const expenses = useExpenseStore(
    (state) => state.expenses
  );

  const recentExpenses = useMemo(() => {
    return [...expenses]
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() -
          new Date(a.createdAt).getTime()
      )
      .slice(0, 6);
  }, [expenses]);

  return (
    <section className="rounded-3xl border border-[#ffb3bf] bg-[#fffdf0] p-7 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[#3f1d2f]">
            Recent Expenses
          </h2>

          <p className="mt-1 text-[#8d6171]">
            Your latest wedding expenses.
          </p>
        </div>

        <span className="rounded-full bg-[#fff8d8] px-3 py-1 text-sm font-semibold text-[#ff4d6d]">
          {expenses.length} Expenses
        </span>
      </div>

      <div className="mt-8 space-y-5">
        {recentExpenses.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#ffb3bf] py-12 text-center text-[#8d6171]">
            No expenses added yet.
          </div>
        ) : (
          recentExpenses.map((expense) => (
            <div
              key={expense.id}
              className="flex items-center justify-between rounded-2xl border border-[#fff3b0] p-4 transition hover:bg-[#fffdf0]"
            >
              <div className="flex items-center gap-4">
                <div className="rounded-2xl bg-[#fff8d8] p-3">
                  <IndianRupee
                    className="text-[#111111]"
                    size={20}
                  />
                </div>

                <div>
                  <h3 className="font-semibold text-[#3f1d2f]">
                    {expense.title}
                  </h3>

                  <p className="text-sm text-[#8d6171]">
                    {expense.category}
                  </p>

                  <div className="mt-1 flex items-center gap-2 text-sm text-[#8d6171]">
                    <CalendarDays size={14} />

                    {new Date(
                      expense.expenseDate
                    ).toLocaleDateString(
                      "en-GB",
                      {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      }
                    )}
                  </div>

                  {expense.notes && (
                    <p className="mt-2 text-sm text-[#ff8fa1] line-clamp-1">
                      {expense.notes}
                    </p>
                  )}
                </div>
              </div>

              <div className="text-right">
                <p className="font-bold text-[#3f1d2f]">
                  ₹
                  {expense.amount.toLocaleString(
                    "en-IN"
                  )}
                </p>

                <p className="text-xs text-[#8d6171]">
                  {expense.category}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}