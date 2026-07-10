import { useAuthStore } from "@/store/authStore";

const API_URL = "http://localhost:8000/api/v1/budgets";
// const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/budgets`;

function getHeaders() {
  const token = useAuthStore.getState().token;

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

export async function getBudgetApi() {
  const response = await fetch(API_URL, {
    headers: getHeaders(),
  });

  const data = await response.json();

  return {
    ok: response.ok,
    data,
  };
}

export async function saveBudgetApi(
  budget: number
) {
  const response = await fetch(API_URL, {
    method: "PATCH",
    headers: getHeaders(),
    body: JSON.stringify({
      budget,
    }),
  });

  const data = await response.json();

  return {
    ok: response.ok,
    data,
  };
}

export async function resetBudgetApi() {
  const response = await fetch(API_URL, {
    method: "DELETE",
    headers: getHeaders(),
  });

  const data = await response.json();

  return {
    ok: response.ok,
    data,
  };
}