import * as SecureStore from "expo-secure-store";
import { STORAGE_KEYS } from "../constants/storage";

export const saveToken = async (token: string) => {
  await SecureStore.setItemAsync(STORAGE_KEYS.ACCESS_TOKEN, token);
};

export const getToken = async () => {
  return await SecureStore.getItemAsync(STORAGE_KEYS.ACCESS_TOKEN);
};

export const deleteToken = async () => {
  await SecureStore.deleteItemAsync(STORAGE_KEYS.ACCESS_TOKEN);
};
export const saveOnboardingStatus = async () => {
  await SecureStore.setItemAsync(
    STORAGE_KEYS.ONBOARDING_COMPLETED,
    "true"
  );
};

export const getOnboardingStatus = async () => {
  return await SecureStore.getItemAsync(
    STORAGE_KEYS.ONBOARDING_COMPLETED
  );
};