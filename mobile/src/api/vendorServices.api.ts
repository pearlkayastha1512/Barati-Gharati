import api from "./axios";

export type BackendService = {
  id: string;
  vendorId: number;
  name: string;
  category: string;
  description: string;
  duration: string;
  price: number;
  rating: number;
  reviews: number;
  image: string;
  includes: string[];
  status: "active" | "inactive";
};

export const getMyServices = async (): Promise<BackendService[]> => {
  const res = await api.get("/packages/my/packages");
  return res.data;
};

export const createService = async (body: any) => {
  const res = await api.post("/packages", body);
  return res.data;
};

export const updateServiceApi = async (id: string, body: any) => {
  const res = await api.patch(`/packages/${id}`, body);
  return res.data;
};

export const deleteServiceApi = async (id: string) => {
  const res = await api.delete(`/packages/${id}`);
  return res.data;
};