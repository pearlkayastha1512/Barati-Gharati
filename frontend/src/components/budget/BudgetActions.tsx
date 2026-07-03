"use client";

import { useState } from "react";

import {
  Plus,
  Receipt,
} from "lucide-react";

import ExpenseModal from "./ExpenseModal";

export default function BudgetActions() {
  const [openModal, setOpenModal] =
    useState(false);

  return (
    <>
      <section className="flex flex-col gap-5 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm md:flex-row md:items-center md:justify-between">

        <div>

          <div className="flex items-center gap-3">

            <Receipt className="text-emerald-500" />

            <h2 className="text-2xl font-bold text-gray-900">
              Expense Manager
            </h2>

          </div>

          <p className="mt-2 text-gray-500">
            Add and manage your wedding expenses.
          </p>

        </div>

        <button
          onClick={() =>
            setOpenModal(true)
          }
          className="
            inline-flex
            items-center
            gap-2
            rounded-2xl
            bg-emerald-500
            px-6
            py-3
            font-semibold
            text-white
            transition
            hover:bg-emerald-600
          "
        >
          <Plus size={18} />

          Add Expense

        </button>

      </section>

      <ExpenseModal
        open={openModal}
        onClose={() =>
          setOpenModal(false)
        }
      />
    </>
  );
}