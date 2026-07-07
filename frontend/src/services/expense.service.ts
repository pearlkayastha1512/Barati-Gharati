import { Expense } from "@/types/expense";

import {
  getExpensesApi,
  createExpenseApi,
  updateExpenseApi,
  deleteExpenseApi,
} from "@/services/api/expense.api";

export async function getCustomerExpenses(): Promise<Expense[]> {
  const result = await getExpensesApi();

  return result.data;
}

export async function createExpense(
  expense: Expense
): Promise<Expense | null> {
  const result = await createExpenseApi(expense);

  return result.ok && result.data ? result.data : null;
}

export async function updateExpense(
  expense: Expense
): Promise<Expense | null> {
  const result = await updateExpenseApi(expense);

  return result.ok && result.data ? result.data : null;
}

export async function deleteExpense(
  expenseId: string
): Promise<boolean> {
  const result = await deleteExpenseApi(expenseId);

  return result.ok;
}
