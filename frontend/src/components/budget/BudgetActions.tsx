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
      <section className="flex flex-col gap-5 rounded-3xl border border-[#ffb3bf] bg-[#fffdf0] p-6 shadow-sm md:flex-row md:items-center md:justify-between">

        <div>

          <div className="flex items-center gap-3">

            <Receipt className="text-[#ff4d6d]" />

            <h2 className="text-2xl font-bold text-[#3f1d2f]">
              Expense Manager
            </h2>

          </div>

          <p className="mt-2 text-[#8d6171]">
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
            bg-[#ff4d6d]
            px-6
            py-3
            font-semibold
            text-white
            transition
            hover:bg-[#e63b5f]
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
