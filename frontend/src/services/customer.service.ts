const BUDGET_KEY = "weddingBudget";

class CustomerService {
  // Wedding Budget
  getWeddingBudget(): number {
    if (typeof window === "undefined") {
      return 1000000;
    }

    const budget = localStorage.getItem(BUDGET_KEY);

    if (!budget) {
      return 1000000;
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