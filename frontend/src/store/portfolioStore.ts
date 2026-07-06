import { create } from "zustand";

import { Portfolio } from "@/types/portfolio";

import {
  getPortfolio,
  getVendorPortfolio,
  createPortfolio,
  updatePortfolio,
  deletePortfolio,
} from "@/services/portfolio.service";

interface PortfolioStore {
  portfolio: Portfolio[];

  selectedPortfolio: Portfolio | null;

  loading: boolean;

  loadPortfolio: () => Promise<void>;

  loadVendorPortfolio: (
    vendorId: number
  ) => Promise<void>;

  setSelectedPortfolio: (
    portfolio: Portfolio | null
  ) => void;

  addPortfolio: (
    formData: FormData
  ) => Promise<boolean>;

  updateExistingPortfolio: (
    portfolio: Portfolio
  ) => Promise<boolean>;

  deleteExistingPortfolio: (
    id: string
  ) => Promise<boolean>;

  clearPortfolio: () => void;
}

export const usePortfolioStore =
  create<PortfolioStore>((set) => ({
    portfolio: [],

    selectedPortfolio: null,

    loading: false,

    // ==========================================
    // Vendor Dashboard Portfolio
    // ==========================================

    loadPortfolio: async () => {
      set({
        loading: true,
      });

      const portfolio =
        await getPortfolio();

      set({
        portfolio: Array.isArray(
          portfolio
        )
          ? portfolio
          : [],
        loading: false,
      });
    },

    // ==========================================
    // Public Vendor Portfolio
    // ==========================================

    loadVendorPortfolio:
      async (vendorId) => {
        set({
          loading: true,
        });

        const portfolio =
          await getVendorPortfolio(
            vendorId
          );

        set({
          portfolio: Array.isArray(
            portfolio
          )
            ? portfolio
            : [],
          loading: false,
        });
      },

    // ==========================================

    setSelectedPortfolio: (
      portfolio
    ) =>
      set({
        selectedPortfolio:
          portfolio,
      }),

    // ==========================================
    // Upload
    // ==========================================

    addPortfolio: async (
      formData
    ) => {
      const success =
        await createPortfolio(
          formData
        );

      if (!success) {
        return false;
      }

      const portfolio =
        await getPortfolio();

      set({
        portfolio: Array.isArray(
          portfolio
        )
          ? portfolio
          : [],
      });

      return true;
    },

    // ==========================================
    // Update
    // ==========================================

    updateExistingPortfolio:
      async (portfolio) => {
        const success =
          await updatePortfolio(
            portfolio
          );

        if (!success) {
          return false;
        }

        const latest =
          await getPortfolio();

        set({
          portfolio: Array.isArray(
            latest
          )
            ? latest
            : [],

          selectedPortfolio:
            null,
        });

        return true;
      },

    // ==========================================
    // Delete
    // ==========================================

    deleteExistingPortfolio:
      async (id) => {
        const success =
          await deletePortfolio(id);

        if (!success) {
          return false;
        }

        const latest =
          await getPortfolio();

        set({
          portfolio: Array.isArray(
            latest
          )
            ? latest
            : [],

          selectedPortfolio:
            null,
        });

        return true;
      },

    // ==========================================

    clearPortfolio: () =>
      set({
        portfolio: [],
        selectedPortfolio:
          null,
      }),
  }));