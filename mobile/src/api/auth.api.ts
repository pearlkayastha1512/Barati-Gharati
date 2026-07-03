import api from "./axios";

export const login = (data: any) => {
  return api.post("/auth/login", data);
};

export const register = (data: any) => {
  return api.post("/auth/register", data);
};