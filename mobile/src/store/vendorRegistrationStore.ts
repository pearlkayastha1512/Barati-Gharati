import { create } from "zustand";
import { VendorAccountInfo, VendorBusinessInfo, VendorGalleryInfo } from "../types/vendor";

// TODO: import API function once backend is connected
// import { registerVendor } from "../api/vendor.api";

interface VendorRegistrationState {
  step: number; // 1: Account, 2: Business, 3: Gallery, 4: Review, 5: Success
  account: VendorAccountInfo;
  business: VendorBusinessInfo;
  gallery: VendorGalleryInfo;
  setAccount: (data: VendorAccountInfo) => void;
  setBusiness: (data: VendorBusinessInfo) => void;
  setGallery: (data: VendorGalleryInfo) => void;
  goToStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  reset: () => void;
}

const initialAccount: VendorAccountInfo = {
  ownerName: "",
  businessEmail: "",
  phone: "",
  password: "",
  confirmPassword: "",
};

const initialBusiness: VendorBusinessInfo = {
  businessName: "",
  category: "",
  city: "",
  address: "",
  description: "",
};

const initialGallery: VendorGalleryInfo = {
  profileImageUri: null,
  coverImageUri: null,
};

export const useVendorRegistrationStore = create<VendorRegistrationState>((set) => ({
  step: 1,
  account: initialAccount,
  business: initialBusiness,
  gallery: initialGallery,

  setAccount: (data) => set({ account: data }),
  setBusiness: (data) => set({ business: data }),
  setGallery: (data) => set({ gallery: data }),

  goToStep: (step) => set({ step }),
  nextStep: () => set((state) => ({ step: Math.min(state.step + 1, 5) })),
  prevStep: () => set((state) => ({ step: Math.max(state.step - 1, 1) })),

  reset: () =>
    set({
      step: 1,
      account: initialAccount,
      business: initialBusiness,
      gallery: initialGallery,
    }),
}));