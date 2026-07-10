import { create } from "zustand";
import { PortfolioItemRecord, PortfolioCategory } from "../types/vendorPortfolio";

interface VendorPortfolioState {
  items: PortfolioItemRecord[];
  addItem: (item: Omit<PortfolioItemRecord, "id" | "createdAt">) => void;
  deleteItem: (id: string) => void;
}

export const useVendorPortfolioStore = create<VendorPortfolioState>((set) => ({
  // ==============================
  // TODO: Fetch vendor's portfolio items from API on screen mount instead
  // of starting empty here. Something like:
  //
  // const response = await getVendorPortfolio(vendorId);
  // set({ items: response.data });
  //
  // For now, starts empty — vendor sees "No Portfolio Found" until they
  // upload their first item via the Upload Portfolio form.
  // ==============================
  items: [],

  addItem: (item) => {
    // ==============================
    // TODO: Call Upload Portfolio API here instead of mutating local state.
    // This will likely be a multipart/form-data request since it includes
    // an image file, e.g.:
    //
    // const formData = new FormData();
    // formData.append("title", item.title);
    // formData.append("category", item.category);
    // formData.append("description", item.description);
    // if (item.imageUri) {
    //   formData.append("image", { uri: item.imageUri, name: "photo.jpg", type: "image/jpeg" } as any);
    // }
    // const response = await uploadVendorPortfolioItem(formData);
    // set((state) => ({ items: [...state.items, response.data] }));
    //
    // Keep the local-state fallback below until the API is wired in.
    // ==============================
    set((state) => ({
      items: [
        ...state.items,
        {
          ...item,
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
        },
      ],
    }));
  },

  deleteItem: (id) => {
    // ==============================
    // TODO: Call Delete Portfolio Item API here instead of mutating local state.
    //
    // await deleteVendorPortfolioItem(id);
    // set((state) => ({ items: state.items.filter((i) => i.id !== id) }));
    // ==============================
    set((state) => ({
      items: state.items.filter((i) => i.id !== id),
    }));
  },
}));