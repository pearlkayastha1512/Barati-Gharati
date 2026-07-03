
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User } from "@/types/auth";

interface AuthStore {
  user: User | null;

  isAuthenticated: boolean;

  isLoading: boolean;

  hasHydrated: boolean;

  isLoginOpen: boolean;

  isRegisterOpen: boolean;

  isForgotOpen: boolean;

  openLogin: () => void;

  closeLogin: () => void;

  openRegister: () => void;

  

  closeRegister: () => void;

  openForgot: () => void;

  closeForgot: () => void;


  updateUser: (
  user: User
) => void;
  login: (user: User) => void;

  logout: () => void;

  setHasHydrated: (state: boolean) => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,

      isAuthenticated: false,

      isLoading: false,

      hasHydrated: false,

      isLoginOpen: false,

      isRegisterOpen: false,

      isForgotOpen: false,

      updateUser: (user) =>
  set({
    user,
  }),

      openLogin: () =>
        set({
          isLoginOpen: true,
        }),

      closeLogin: () =>
        set({
          isLoginOpen: false,
        }),

      openRegister: () =>
        set({
          isLoginOpen: false,
          isRegisterOpen: true,
        }),

      closeRegister: () =>
        set({
          isRegisterOpen: false,
        }),

      openForgot: () =>
        set({
          isLoginOpen: false,
          isForgotOpen: true,
        }),

      closeForgot: () =>
        set({
          isForgotOpen: false,
        }),

      login: (user) =>
        set({
          user,
          isAuthenticated: true,
          isLoginOpen: false,
        }),

      logout: () =>
        set({
          user: null,
          isAuthenticated: false,
        }),

      setHasHydrated: (state) =>
        set({
          hasHydrated: state,
        }),
    }),
    {
      name: "auth-storage",

      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);