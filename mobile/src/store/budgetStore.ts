import { create } from "zustand";
import {
  createExpense,
  deleteExpense,
  getBudgetData,
  saveBudget,
} from "../api/budget.api";

export type Expense = {
  id: string;
  title: string;
  category: string;
  amount: number;
  note?: string;
  date: string; // ISO string
};

interface BudgetState {
  totalBudget: number;
  expenses: Expense[];
  isLoading: boolean;
  error: string | null;
  loadBudget: () => Promise<void>;
  setTotalBudget: (amount: number) => Promise<void>;
  addExpense: (expense: Omit<Expense, "id">) => Promise<void>;
  removeExpense: (id: string) => Promise<void>;
}

export const useBudgetStore = create<BudgetState>((set) => ({
  totalBudget: 0,
  expenses: [],
  isLoading: false,
  error: null,

  loadBudget: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await getBudgetData();
      set({ ...data, isLoading: false });
    } catch {
      set({ isLoading: false, error: "Budget load nahi ho saka." });
    }
  },

  setTotalBudget: async (amount) => {
    try {
      await saveBudget(amount);
      set({ totalBudget: amount, error: null });
    } catch {
      set({ error: "Budget save nahi ho saka." });
    }
  },

  addExpense: async (expense) => {
    try {
      const newExpense = await createExpense(expense);
      set((state) => ({ expenses: [newExpense, ...state.expenses], error: null }));
    } catch {
      set({ error: "Expense add nahi ho saka." });
    }
  },

  removeExpense: async (id) => {
    try {
      await deleteExpense(id);
      set((state) => ({
        expenses: state.expenses.filter((expense) => expense.id !== id),
        error: null,
      }));
    } catch {
      set({ error: "Expense delete nahi ho saka." });
    }
  },
}));

// Categories matching your website's Add Expense dropdown
export const EXPENSE_CATEGORIES = [
  "Venue",
  "Photography",
  "Makeup",
  "Decorator",
  "DJ",
  "Caterer",
  "Mehendi",
  "Band",
  "Other",
];
