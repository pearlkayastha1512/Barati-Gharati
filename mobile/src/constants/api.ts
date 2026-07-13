import { Platform } from "react-native";

const ENV_BASE_URL = process.env.EXPO_PUBLIC_API_URL;

export const BASE_URL =
  ENV_BASE_URL ||
  (Platform.OS === "web"
    ? "http://localhost:8000/api/v1"
    : "http://192.168.29.132:8000/api/v1");