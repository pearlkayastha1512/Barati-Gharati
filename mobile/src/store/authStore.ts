// import { create } from "zustand";
// import { saveToken, deleteToken,getToken } from "../utils/secureStore";
// import { decodeToken } from "../utils/jwt";
// import { User,UserRole } from "../types/user";


// interface AuthState {
//   token: string | null;
//   user: User | null;

//   isAuthenticated: boolean;
//   isLoading: boolean;

//   login: (token: string, user: User) => Promise<void>;
//   logout: () => Promise<void>;
//   restoreSession: () => Promise<void>;
// }

// export const useAuthStore = create<AuthState>((set) => ({
//   token: null,
//   user: null,

//   isAuthenticated: false,
//   isLoading: true,

//   login: async (token, user) => {
//     await saveToken(token);

//     set({
//       token,
//       user,
//       isAuthenticated: true,
//       isLoading: false,
//     });
//   },

//   logout: async () => {
//     await deleteToken();

//     set({
//       token: null,
//       user: null,
//       isAuthenticated: false,
//       isLoading: false,
//     });
//   },

//   restoreSession: async () => {
//     // JWT Decode aur SecureStore read
//     // Agle step me implement karenge
//     const token = await getToken();

//   if (!token) {
//     set({
//       isLoading: false,
//     });
//     return;
//   }

//   const decoded = decodeToken(token);

//   set({
//     token,
//     user: {
//   id: decoded.sub,
//   name: "",
//   email: decoded.email,
//   phone: "",
//   role: decoded.role as UserRole,
//   isVerified: true,
// },
//     isAuthenticated: true,
//     isLoading: false,
//   });
//   },
// }));

import { create } from "zustand";

import {
  saveToken,
  saveUser,
  getToken,
  getUser,
  clearSession,
} from "../utils/secureStore";

import { User } from "../types/user";

interface AuthState {
  token: string | null;
  user: User | null;

  isAuthenticated: boolean;
  isLoading: boolean;

  login: (
    token: string,
    user: User,
  ) => Promise<void>;

  logout: () => Promise<void>;

  restoreSession: () => Promise<void>;
}

export const useAuthStore =
  create<AuthState>((set) => ({
    token: null,

    user: null,

    isAuthenticated: false,

    isLoading: true,

    login: async (
      token,
      user,
    ) => {
      await saveToken(token);

      await saveUser(user);

      set({
        token,
        user,
        isAuthenticated: true,
        isLoading: false,
      });
    },

    logout: async () => {
      await clearSession();

      set({
        token: null,
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    },

    restoreSession: async () => {
      const token =
        await getToken();

      const user =
        await getUser();

      if (!token || !user) {
        set({
          token: null,
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });

        return;
      }

      set({
        token,
        user,
        isAuthenticated: true,
        isLoading: false,
      });
    },
  }));