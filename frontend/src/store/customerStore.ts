import { create } from "zustand";

import {
  customerService,
} from "@/services/customer.service";

interface CustomerStore {
  // Budget
  weddingBudget: number;

  setWeddingBudget: (
    amount: number
  ) => void;

  reset: () => void;
}

export const useCustomerStore =
  create<CustomerStore>((set) => ({
    // Budget
    weddingBudget:
      customerService.getWeddingBudget(),

    setWeddingBudget: (amount) => {
      customerService.saveWeddingBudget(
        amount
      );

      set({
        weddingBudget: amount,
      });
    },

    reset: () => {
      customerService.resetWeddingBudget();

      set({
        weddingBudget: 1000000,
      });
    },
  }));