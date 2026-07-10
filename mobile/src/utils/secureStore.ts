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

import { STORAGE_KEYS } from "../constants/storage";

import { User } from "../types/user";

/* ============================
   Access Token
============================ */

export const saveToken = async (
  token: string,
) => {
  await SecureStore.setItemAsync(
    STORAGE_KEYS.ACCESS_TOKEN,
    token,
  );
};

export const getToken = async () => {
  return SecureStore.getItemAsync(
    STORAGE_KEYS.ACCESS_TOKEN,
  );
};

export const deleteToken = async () => {
  await SecureStore.deleteItemAsync(
    STORAGE_KEYS.ACCESS_TOKEN,
  );
};

/* ============================
   User
============================ */

export const saveUser = async (
  user: User,
) => {
  await SecureStore.setItemAsync(
    STORAGE_KEYS.USER,
    JSON.stringify(user),
  );
};

export const getUser = async (): Promise<User | null> => {
  const value = await SecureStore.getItemAsync(
    STORAGE_KEYS.USER,
  );

  if (!value) {
    return null;
  }

  return JSON.parse(value);
};

export const deleteUser = async () => {
  await SecureStore.deleteItemAsync(
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
    await SecureStore.setItemAsync(
      STORAGE_KEYS.ONBOARDING_COMPLETED,
      "true",
    );
  };

export const getOnboardingStatus =
  async () => {
    return SecureStore.getItemAsync(
      STORAGE_KEYS.ONBOARDING_COMPLETED,
    );
  };