import { AxiosError } from "axios";
import api from "@/lib/axios";
import { Expense } from "@/types/expense";

type ExpenseResponse = {
  id: string;
  title: string;
  category: string;
  amount: string | number;
  note?: string | null;
  date: string;
  budgetId?: string;
  createdAt: string;
  updatedAt: string;
};

type ExpensePayload = {
  title: string;
  category: string;
  amount: number;
  note?: string;
  date?: string;
};

type ApiErrorResponse = {
  message?: string;
};

function getErrorMessage(
  error: unknown,
  fallback: string
) {
  if (error instanceof AxiosError) {
    const data = error.response
      ?.data as ApiErrorResponse | undefined;

    return data?.message ?? fallback;
  }

  return fallback;
}

function toExpense(item: ExpenseResponse): Expense {
  return {
    id: item.id,
    customerId: "",
    title: item.title,
    category: item.category,
    amount: Number(item.amount),
    expenseDate: item.date.slice(0, 10),
    notes: item.note ?? "",
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
  };
}

function toPayload(expense: Expense): ExpensePayload {
  return {
    title: expense.title,
    category: expense.category,
    amount: expense.amount,
    note: expense.notes,
    date: expense.expenseDate,
  };
}

export async function getExpensesApi() {
  try {
    const { data } = await api.get<
      ExpenseResponse[]
    >("/expenses");

    return {
      ok: true,
      data: data.map(toExpense),
    };
  } catch (error) {
    return {
      ok: false,
      data: [],
      error: getErrorMessage(
        error,
        "Unable to load expenses."
      ),
    };
  }
}

export async function createExpenseApi(
  expense: Expense
) {
  try {
    const { data } = await api.post<ExpenseResponse>(
      "/expenses",
      toPayload(expense)
    );

    return {
      ok: true,
      data: toExpense(data),
    };
  } catch (error) {
    return {
      ok: false,
      error: getErrorMessage(
        error,
        "Unable to add expense."
      ),
    };
  }
}

export async function updateExpenseApi(
  expense: Expense
) {
  try {
    const { data } = await api.patch<ExpenseResponse>(
      `/expenses/${expense.id}`,
      toPayload(expense)
    );

    return {
      ok: true,
      data: toExpense(data),
    };
  } catch (error) {
    return {
      ok: false,
      error: getErrorMessage(
        error,
        "Unable to update expense."
      ),
    };
  }
}

export async function deleteExpenseApi(
  expenseId: string
) {
  try {
    await api.delete(`/expenses/${expenseId}`);

    return {
      ok: true,
    };
  } catch (error) {
    return {
      ok: false,
      error: getErrorMessage(
        error,
        "Unable to delete expense."
      ),
    };
  }
}
