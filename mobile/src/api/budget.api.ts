import api from "./axios";
import type { Expense } from "../store/budgetStore";

type ApiExpense = Omit<Expense, "amount" | "date"> & {
  amount: number | string;
  date: string;
};

type BudgetResponse = {
  success: boolean;
  data: { budget: number };
};

const normalizeExpense = (expense: ApiExpense): Expense => ({
  ...expense,
  amount: Number(expense.amount),
  date: expense.date,
});

export const getBudgetData = async () => {
  const [budgetResponse, expensesResponse] = await Promise.all([
    api.get<BudgetResponse>("/budgets"),
    api.get<ApiExpense[]>("/expenses"),
  ]);

  return {
    totalBudget: Number(budgetResponse.data.data.budget),
    expenses: expensesResponse.data.map(normalizeExpense),
  };
};

export const saveBudget = async (budget: number) => {
  await api.post("/budgets", { budget });
};

export const createExpense = async (expense: Omit<Expense, "id">) => {
  const response = await api.post<ApiExpense>("/expenses", expense);
  return normalizeExpense(response.data);
};

export const deleteExpense = async (expenseId: string) => {
  await api.delete(`/expenses/${expenseId}`);
};
