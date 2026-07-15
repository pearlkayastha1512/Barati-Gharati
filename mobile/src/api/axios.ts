// // import axios from "axios";
// // import { BASE_URL } from "../constants/api";

// // const api = axios.create({
// //   baseURL: BASE_URL,
// //   timeout: 10000,
// // });

// // export default api;

// import axios from "axios";
// import { BASE_URL } from "../constants/api";

// const api = axios.create({
//   baseURL: BASE_URL,
//   timeout: 15000,

//   headers: {
//     "Content-Type": "application/json",
//     Accept: "application/json",
//   },
// });

// export default api;

import axios from "axios";

import { BASE_URL } from "../constants/api";
import { getToken } from "../utils/secureStore";

const api = axios.create({
  baseURL: BASE_URL,

  timeout: 15000,

  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

/*
|--------------------------------------------------------------------------
| Request Interceptor
|--------------------------------------------------------------------------
*/

api.interceptors.request.use(
  async (config) => {
    if (
      typeof FormData !== "undefined" &&
      config.data instanceof FormData
    ) {
      config.headers.delete("Content-Type");
    }

    const token = await getToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },

  (error) => {
    return Promise.reject(error);
  },
);

/*
|--------------------------------------------------------------------------
| Response Interceptor
|--------------------------------------------------------------------------
*/

api.interceptors.response.use(
  (response) => response,

  async (error) => {
    if (error.response?.status === 401) {
      console.log("Session expired.");
    }

    return Promise.reject(error);
  },
);

export default api;
