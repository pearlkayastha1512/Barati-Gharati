"use client";

import { useMemo, useState } from "react";

import {
  CalendarDays,
  Pencil,
  Trash2,
  IndianRupee,
} from "lucide-react";

import { Expense } from "@/types/expense";

import { useExpenseStore } from "@/store/expenseStore";

import ExpenseModal from "./ExpenseModal";

export default function ExpenseTable() {
  const {
    expenses,
    deleteExpense,
  } = useExpenseStore();

  const [selectedExpense, setSelectedExpense] =
    useState<Expense>();

  const [openModal, setOpenModal] =
    useState(false);

  const sortedExpenses = useMemo(() => {
    return [...expenses].sort(
      (a, b) =>
        new Date(b.expenseDate).getTime() -
        new Date(a.expenseDate).getTime()
    );
  }, [expenses]);

  return (
    <>
      <section className="rounded-3xl border border-gray-200 bg-white shadow-sm">

        {/* Header */}

        <div className="border-b border-gray-100 px-7 py-6">

          <h2 className="text-2xl font-bold text-gray-900">
            Expense History
          </h2>

          <p className="mt-1 text-gray-500">
            Manage all your wedding expenses.
          </p>

        </div>

        {/* Empty */}

        {sortedExpenses.length === 0 ? (
          <div className="py-20 text-center text-gray-500">
            No expenses added yet.
          </div>
        ) : (
          <div className="divide-y divide-gray-100">

            {sortedExpenses.map(
              (expense) => (
                <div
                  key={expense.id}
                  className="flex flex-col gap-5 p-6 transition hover:bg-gray-50 lg:flex-row lg:items-center lg:justify-between"
                >
                  <div>

                    <h3 className="font-semibold text-gray-900">
                      {expense.title}
                    </h3>

                    <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-gray-500">

                      <span className="rounded-full bg-emerald-50 px-3 py-1 font-medium text-emerald-600">
                        {expense.category}
                      </span>

                      <span className="flex items-center gap-1">

                        <CalendarDays size={15} />

                        {new Date(
                          expense.expenseDate
                        ).toLocaleDateString(
                          "en-GB",
                          {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          }
                        )}

                      </span>

                    </div>

                    {expense.notes && (
                      <p className="mt-3 text-sm text-gray-500">
                        {expense.notes}
                      </p>
                    )}

                  </div>

                  <div className="flex items-center gap-4">

                    <div className="flex items-center gap-1 rounded-xl bg-green-50 px-4 py-2 font-bold text-green-600">

                      <IndianRupee size={18} />

                      {expense.amount.toLocaleString(
                        "en-IN"
                      )}

                    </div>

                    <button
                      onClick={() => {
                        setSelectedExpense(
                          expense
                        );

                        setOpenModal(
                          true
                        );
                      }}
                      className="rounded-xl border p-3 transition hover:bg-gray-100 text-gray-700"
                    >
                      <Pencil
                        size={18}
                      />
                    </button>

                    <button
                      onClick={() =>
                        deleteExpense(
                          expense.id
                        )
                      }
                      className="rounded-xl border border-red-200 p-3 text-red-500 transition hover:bg-red-50"
                    >
                      <Trash2
                        size={18}
                      />
                    </button>

                  </div>

                </div>
              )
            )}

          </div>
        )}

      </section>

      <ExpenseModal
        open={openModal}
        expense={selectedExpense}
        onClose={() => {
          setSelectedExpense(
            undefined
          );

          setOpenModal(false);
        }}
      />
    </>
  );
}