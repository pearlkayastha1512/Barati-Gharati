// import * as SecureStore from "expo-secure-store";
// import { STORAGE_KEYS } from "../constants/storage";

// export const saveToken = async (token: string) => {
//   await SecureStore.setItemAsync(STORAGE_KEYS.ACCESS_TOKEN, token);
// };

// export const getToken = async () => {
//   return await SecureStore.getItemAsync(STORAGE_KEYS.ACCESS_TOKEN);
// };

// export const deleteToken = async () => {
//   await SecureStore.deleteItemAsync(STORAGE_KEYS.ACCESS_TOKEN);
// };
// export const saveOnboardingStatus = async () => {
//   await SecureStore.setItemAsync(
//     STORAGE_KEYS.ONBOARDING_COMPLETED,
//     "true"
//   );
// };

// export const getOnboardingStatus = async () => {
//   return await SecureStore.getItemAsync(
//     STORAGE_KEYS.ONBOARDING_COMPLETED
//   );
// };

import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

import { STORAGE_KEYS } from "../constants/storage";

import { User } from "../types/user";

const webStorage = {
  setItem: async (key: string, value: string) => {
    localStorage.setItem(key, value);
  },
  getItem: async (key: string) => {
    return localStorage.getItem(key);
  },
  deleteItem: async (key: string) => {
    localStorage.removeItem(key);
  },
};

const storage =
  Platform.OS === "web"
    ? webStorage
    : {
        setItem: SecureStore.setItemAsync,
        getItem: SecureStore.getItemAsync,
        deleteItem: SecureStore.deleteItemAsync,
      };

/* ============================
   Access Token
============================ */

export const saveToken = async (
  token: string,
) => {
  await storage.setItem(
    STORAGE_KEYS.ACCESS_TOKEN,
    token,
  );
};

export const getToken = async () => {
  return storage.getItem(
    STORAGE_KEYS.ACCESS_TOKEN,
  );
};

export const deleteToken = async () => {
  await storage.deleteItem(
    STORAGE_KEYS.ACCESS_TOKEN,
  );
};

/* ============================
   User
============================ */

export const saveUser = async (
  user: User,
) => {
  await storage.setItem(
    STORAGE_KEYS.USER,
    JSON.stringify(user),
  );
};

export const getUser = async (): Promise<User | null> => {
  const value = await storage.getItem(
    STORAGE_KEYS.USER,
  );

  if (!value) {
    return null;
  }

  return JSON.parse(value);
};

export const deleteUser = async () => {
  await storage.deleteItem(
    STORAGE_KEYS.USER,
  );
};

/* ============================
   Clear Session
============================ */

export const clearSession = async () => {
  await deleteToken();
  await deleteUser();
};

/* ============================
   Onboarding
============================ */

export const saveOnboardingStatus =
  async () => {
    await storage.setItem(
      STORAGE_KEYS.ONBOARDING_COMPLETED,
      "true",
    );
  };

export const getOnboardingStatus =
  async () => {
    return storage.getItem(
      STORAGE_KEYS.ONBOARDING_COMPLETED,
    );
  };
