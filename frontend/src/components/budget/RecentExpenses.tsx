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
    <section className="rounded-3xl border border-gray-200 bg-white p-7 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Recent Expenses
          </h2>

          <p className="mt-1 text-gray-500">
            Your latest wedding expenses.
          </p>
        </div>

        <span className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-600">
          {expenses.length} Expenses
        </span>
      </div>

      <div className="mt-8 space-y-5">
        {recentExpenses.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-200 py-12 text-center text-gray-500">
            No expenses added yet.
          </div>
        ) : (
          recentExpenses.map((expense) => (
            <div
              key={expense.id}
              className="flex items-center justify-between rounded-2xl border border-gray-100 p-4 transition hover:bg-gray-50"
            >
              <div className="flex items-center gap-4">
                <div className="rounded-2xl bg-green-100 p-3">
                  <IndianRupee
                    className="text-green-600"
                    size={20}
                  />
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900">
                    {expense.title}
                  </h3>

                  <p className="text-sm text-gray-500">
                    {expense.category}
                  </p>

                  <div className="mt-1 flex items-center gap-2 text-sm text-gray-500">
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
                    <p className="mt-2 text-sm text-gray-400 line-clamp-1">
                      {expense.notes}
                    </p>
                  )}
                </div>
              </div>

              <div className="text-right">
                <p className="font-bold text-gray-900">
                  ₹
                  {expense.amount.toLocaleString(
                    "en-IN"
                  )}
                </p>

                <p className="text-xs text-gray-500">
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