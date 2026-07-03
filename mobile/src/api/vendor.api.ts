import api from "./axios";

export const getAllVendors = () => {
  return api.get("/vendor/all");
};

export const getVendorById = (id: string) => {
  return api.get(`/vendor/${id}`);
};