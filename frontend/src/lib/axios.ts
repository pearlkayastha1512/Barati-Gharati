import axios from "axios";

const api = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_API_URL ??
    "http://localhost:8000/api/v1",

  withCredentials: true,

  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  // Let the browser add the multipart boundary. Keeping the instance-level
  // application/json header on FormData can make Multer receive an empty body.
  if (
    typeof FormData !== "undefined" &&
    config.data instanceof FormData
  ) {
    config.headers.delete("Content-Type");
  }

  if (typeof window !== "undefined") {
    const persisted =
      localStorage.getItem("auth-storage");

    if (persisted) {
      try {
        const auth = JSON.parse(persisted);

        const token =
          auth.state?.token;

        if (token) {
          config.headers.Authorization =
            `Bearer ${token}`;
        }
      } catch {
        // Ignore malformed persisted state
      }
    }
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        console.warn("Unauthorized API request (401). Token missing or expired.");
      }
    }
    return Promise.reject(error);
  }
);

export default api;
