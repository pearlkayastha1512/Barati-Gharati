// import { create } from "zustand";

// import {
//   customerService,
// } from "@/services/customer.service";

// interface CustomerStore {
//   // Budget
//   weddingBudget: number;

//   setWeddingBudget: (
//     amount: number
//   ) => void;

//   reset: () => void;
// }

// export const useCustomerStore =
//   create<CustomerStore>((set) => ({
//     // Budget
//     weddingBudget:
//       customerService.getWeddingBudget(),

//     setWeddingBudget: (amount) => {
//       customerService.saveWeddingBudget(
//         amount
//       );

//       set({
//         weddingBudget: amount,
//       });
//     },

//     reset: () => {
//       customerService.resetWeddingBudget();

//       set({
//         weddingBudget: 1000000,
//       });
//     },
//   }));



import { create } from "zustand";

import {
  getBudgetApi,
  saveBudgetApi,
  resetBudgetApi,
} from "@/services/api/customer.api";

interface CustomerStore {
  weddingBudget: number;

  isLoading: boolean;

  loadWeddingBudget: () => Promise<void>;

  setWeddingBudget: (
    amount: number
  ) => Promise<boolean>;

  reset: () => Promise<boolean>;
}

export const useCustomerStore =
  create<CustomerStore>((set) => ({
    weddingBudget: 1000000,

    isLoading: false,

    loadWeddingBudget: async () => {
      set({
        isLoading: true,
      });

      const result =
        await getBudgetApi();

      if (
        result.ok &&
        result.data?.success
      ) {
        set({
          weddingBudget:
            result.data.data.budget,
          isLoading: false,
        });

        return;
      }

      set({
        weddingBudget: 1000000,
        isLoading: false,
      });
    },

    setWeddingBudget: async (
      amount,
    ) => {
      const result =
        await saveBudgetApi(amount);

      if (
        !result.ok ||
        !result.data.success
      ) {
        return false;
      }

      set({
        weddingBudget: amount,
      });

      return true;
    },

    reset: async () => {
      const result =
        await resetBudgetApi();

      if (
        !result.ok ||
        !result.data.success
      ) {
        return false;
      }

      set({
        weddingBudget: 1000000,
      });

      return true;
    },
  }));