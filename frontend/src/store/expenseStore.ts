import { create } from "zustand";

import { Expense } from "@/types/expense";

import {
  getCustomerExpenses,
  createExpense,
  updateExpense,
  deleteExpense,
  clearCustomerExpenses,
} from "@/services/expense.service";

interface ExpenseStore {
  expenses: Expense[];

  loadExpenses: (
    customerId: string
  ) => void;

  addExpense: (
    expense: Expense
  ) => void;

  updateExpense: (
    expense: Expense
  ) => void;

  deleteExpense: (
    expenseId: string
  ) => void;

  clearExpenses: (
    customerId: string
  ) => void;
}

export const useExpenseStore =
  create<ExpenseStore>((set) => ({
    expenses: [],

    loadExpenses: (
      customerId
    ) => {
      set({
        expenses:
          getCustomerExpenses(
            customerId
          ),
      });
    },

    addExpense: (
      expense
    ) => {
      createExpense(expense);

      set({
        expenses:
          getCustomerExpenses(
            expense.customerId
          ),
      });
    },

    updateExpense: (
      expense
    ) => {
      updateExpense(expense);

      set({
        expenses:
          getCustomerExpenses(
            expense.customerId
          ),
      });
    },

    deleteExpense: (
      expenseId
    ) =>
      set((state) => {
        const expense =
          state.expenses.find(
            (item) =>
              item.id === expenseId
          );

        if (!expense) {
          return state;
        }

        deleteExpense(expenseId);

        return {
          expenses:
            getCustomerExpenses(
              expense.customerId
            ),
        };
      }),

    clearExpenses: (
      customerId
    ) => {
      clearCustomerExpenses(
        customerId
      );

      set({
        expenses: [],
      });
    },
  }));