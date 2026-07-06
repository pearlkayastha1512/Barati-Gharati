
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
  token: string | null;

  isForgotOpen: boolean;

  openLogin: () => void;

  closeLogin: () => void;

  openRegister: () => void;

  

  closeRegister: () => void;

  openForgot: () => void;

  closeForgot: () => void;
setToken: (token: string | null) => void;

  updateUser: (
  user: User
) => void;
login: (
  user: User,
  token: string
) => void;

  logout: () => void;

  setHasHydrated: (state: boolean) => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      token: null,

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
        setToken: (token) =>
  set({
    token,
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

     login: (user, token) =>
  set({
    user,
    token,
    isAuthenticated: true,
    isLoginOpen: false,
  }),

     logout: () =>
  set({
    user: null,
    token: null,
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