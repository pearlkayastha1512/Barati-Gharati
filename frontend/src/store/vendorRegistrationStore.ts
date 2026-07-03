

import { create } from "zustand";

import { VendorRegistrationForm } from "@/types/vendorRegistration";
import { vendorRegistrationService } from "@/services/vendorRegistration.service";

const TOTAL_STEPS = 5;

interface VendorRegistrationStore {
  // Step Navigation
  currentStep: number;

  nextStep: () => void;
  previousStep: () => void;
  goToStep: (step: number) => void;

  // Form
  formData: VendorRegistrationForm;

  updateField: (
    field: keyof VendorRegistrationForm,
    value: string | string[]
  ) => void;

  resetForm: () => void;
}

export const useVendorRegistrationStore =
  create<VendorRegistrationStore>((set) => ({
    // Step
    currentStep: 1,

    nextStep: () =>
      set((state) => ({
        currentStep:
          state.currentStep < TOTAL_STEPS
            ? state.currentStep + 1
            : state.currentStep,
      })),

    previousStep: () =>
      set((state) => ({
        currentStep:
          state.currentStep > 1
            ? state.currentStep - 1
            : state.currentStep,
      })),

    goToStep: (step) =>
      set({
        currentStep: step,
      }),

    // Form
    formData:
      vendorRegistrationService.getInitialData(),

    updateField: (field, value) =>
      set((state) => ({
        formData: {
          ...state.formData,
          [field]: value,
        },
      })),

    resetForm: () =>
      set({
        currentStep: 1,
        formData:
          vendorRegistrationService.getInitialData(),
      }),
  }));