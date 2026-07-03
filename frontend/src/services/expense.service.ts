import { Expense } from "@/types/expense";

const STORAGE_KEY = "expenses";

export function getExpenses(): Expense[] {
  if (typeof window === "undefined") {
    return [];
  }

  const expenses = localStorage.getItem(STORAGE_KEY);

  if (!expenses) {
    return [];
  }

  return JSON.parse(expenses);
}

export function saveExpenses(
  expenses: Expense[]
): void {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(expenses)
  );
}

export function getCustomerExpenses(
  customerId: string
): Expense[] {
  return getExpenses().filter(
    (expense) =>
      expense.customerId === customerId
  );
}

export function createExpense(
  expense: Expense
): void {
  const expenses = getExpenses();

  expenses.push(expense);

  saveExpenses(expenses);
}

export function updateExpense(
  updatedExpense: Expense
): void {
  const expenses = getExpenses().map(
    (expense) =>
      expense.id === updatedExpense.id
        ? updatedExpense
        : expense
  );

  saveExpenses(expenses);
}

export function deleteExpense(
  expenseId: string
): void {
  const expenses = getExpenses().filter(
    (expense) =>
      expense.id !== expenseId
  );

  saveExpenses(expenses);
}

export function getExpenseById(
  expenseId: string
): Expense | undefined {
  return getExpenses().find(
    (expense) =>
      expense.id === expenseId
  );
}

export function clearCustomerExpenses(
  customerId: string
): void {
  const expenses = getExpenses().filter(
    (expense) =>
      expense.customerId !== customerId
  );

  saveExpenses(expenses);
}