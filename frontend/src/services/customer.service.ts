const BUDGET_KEY = "weddingBudget";

class CustomerService {
  // Wedding Budget
  getWeddingBudget(): number {
    if (typeof window === "undefined") {
      return 0;
    }

    const budget = localStorage.getItem(BUDGET_KEY);

    if (!budget) {
      return 0;
    }

    return Number(budget);
  }

  saveWeddingBudget(
    budget: number
  ): void {
    if (typeof window === "undefined") {
      return;
    }

    localStorage.setItem(
      BUDGET_KEY,
      budget.toString()
    );
  }

  resetWeddingBudget(): void {
    if (typeof window === "undefined") {
      return;
    }

    localStorage.removeItem(BUDGET_KEY);
  }
}

export const customerService =
  new CustomerService();