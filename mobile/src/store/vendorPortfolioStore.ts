import { create } from "zustand";

import { PortfolioItemRecord } from "../types/vendorPortfolio";

import {
  getMyPortfolio,
  createPortfolio,
  deletePortfolio,
  updatePortfolio,
} from "../api/portfolio.api";

interface VendorPortfolioState {
  items: PortfolioItemRecord[];

  fetchPortfolio: () => Promise<void>;

  addItem: (formData: FormData) => Promise<void>;

  updateItem: (
    id: string,
    data: {
      title?: string;
      category?: string;
      description?: string;
    }
  ) => Promise<void>;

  deleteItem: (id: string) => Promise<void>;
}

export const useVendorPortfolioStore =
create<VendorPortfolioState>((set) => ({
  items: [],

  fetchPortfolio: async () => {
    try {
      const items = await getMyPortfolio();

      set({
        items,
      });
    } catch (err) {
      console.log("Fetch Portfolio Error", err);
    }
  },

  addItem: async (formData) => {
    try {
      const item = await createPortfolio(formData);

      set((state) => ({
        items: [item, ...state.items],
      }));
    } catch (err) {
      console.log("Create Portfolio Error", err);
      throw err;
    }
  },

  updateItem: async (id, data) => {
    try {
      const updated = await updatePortfolio(id, data);

      set((state) => ({
        items: state.items.map((item) =>
          item.id === id ? updated : item
        ),
      }));
    } catch (err) {
      console.log("Update Portfolio Error", err);
      throw err;
    }
  },

  deleteItem: async (id) => {
    try {
      await deletePortfolio(id);

      set((state) => ({
        items: state.items.filter(
          (item) => item.id !== id
        ),
      }));
    } catch (err) {
      console.log("Delete Portfolio Error", err);
      throw err;
    }
  },
}));