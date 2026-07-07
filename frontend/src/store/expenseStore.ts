import { create } from "zustand";

import { Expense } from "@/types/expense";

import {
  getCustomerExpenses,
  createExpense,
  updateExpense as saveExpense,
  deleteExpense as removeExpense,
} from "@/services/expense.service";

interface ExpenseStore {
  expenses: Expense[];
  isLoading: boolean;

  loadExpenses: () => Promise<void>;

  addExpense: (
    expense: Expense
  ) => Promise<boolean>;

  updateExpense: (
    expense: Expense
  ) => Promise<boolean>;

  deleteExpense: (
    expenseId: string
  ) => Promise<boolean>;

  clearExpenses: () => void;
}

export const useExpenseStore =
  create<ExpenseStore>((set) => ({
    expenses: [],
    isLoading: false,

    loadExpenses: async () => {
      set({ isLoading: true });

      try {
        const expenses =
          await getCustomerExpenses();

        set({ expenses });
      } finally {
        set({ isLoading: false });
      }
    },

    addExpense: async (expense) => {
      const created =
        await createExpense(expense);

      if (!created) {
        return false;
      }

      const expenses =
        await getCustomerExpenses();

      set({ expenses });

      return true;
    },

    updateExpense: async (expense) => {
      const updated =
        await saveExpense(expense);

      if (!updated) {
        return false;
      }

      const expenses =
        await getCustomerExpenses();

      set({ expenses });

      return true;
    },

    deleteExpense: async (expenseId) => {
      const deleted =
        await removeExpense(expenseId);

      if (!deleted) {
        return false;
      }

      const expenses =
        await getCustomerExpenses();

      set({ expenses });

      return true;
    },

    clearExpenses: () => {
      set({ expenses: [] });
    },
  }));
