import Constants from "expo-constants";

function getDynamicBaseUrl(): string {
  // 1. If explicit env variable is set and not using old IP, use it
  if (process.env.EXPO_PUBLIC_API_URL && !process.env.EXPO_PUBLIC_API_URL.includes("192.168.1.5")) {
    return process.env.EXPO_PUBLIC_API_URL;
  }

  // 2. Dynamically extract Mac IP from Metro server host URI (e.g. 10.21.97.58:8081 -> 10.21.97.58:8000)
  const hostUri = Constants.expoConfig?.hostUri || (Constants as any).experienceUrl;
  if (hostUri) {
    const hostIp = hostUri.split(":")[0];
    if (hostIp && hostIp !== "localhost" && hostIp !== "127.0.0.1") {
      return `http://${hostIp}:8000/api/v1`;
    }
  }

  return "http://10.21.97.58:8000/api/v1";
}

export const BASE_URL = getDynamicBaseUrl();
console.log("📱 MOBILE APP CONNECTED TO BACKEND BASE_URL =>", BASE_URL);
