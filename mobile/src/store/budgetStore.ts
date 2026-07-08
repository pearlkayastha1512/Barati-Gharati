import { create } from "zustand";

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
  setTotalBudget: (amount: number) => void;
  addExpense: (expense: Omit<Expense, "id">) => void;
  removeExpense: (id: string) => void;
}

// TODO: once backend is connected, replace local state with API-backed state:
// - on mount, fetch via getBudgetSummary() (returns { totalBudget, expenses })
// - setTotalBudget should call createOrUpdateBudget({ totalBudget })
// - addExpense should call createExpense(expense), then append the returned item
// - removeExpense should call deleteExpense(id) — optimistic update with rollback on failure
export const useBudgetStore = create<BudgetState>((set) => ({
  totalBudget: 0,
  expenses: [],

  setTotalBudget: (amount) => set({ totalBudget: amount }),

  addExpense: (expense) => {
    const newExpense: Expense = { id: Date.now().toString(), ...expense };
    set((state) => ({ expenses: [newExpense, ...state.expenses] }));
  },

  removeExpense: (id) => {
    set((state) => ({ expenses: state.expenses.filter((e) => e.id !== id) }));
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