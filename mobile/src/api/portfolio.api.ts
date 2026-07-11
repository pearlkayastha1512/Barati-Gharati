import api from "./axios";
export const getMyPortfolio = async () => {
  const res = await api.get("/portfolio/my");
  return res.data.data;
};

export const getVendorPortfolio = async (vendorId: number) => {
  const res = await api.get(`/portfolio/vendor/${vendorId}`);
  return res.data.data;
};

export const createPortfolio = async (formData: FormData) => {
  const res = await api.post("/portfolio", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data.data;
};

export const updatePortfolio = async (
  id: string,
  data: {
    title?: string;
    category?: string;
    description?: string;
  }
) => {
  const res = await api.patch(`/portfolio/${id}`, data);
  return res.data.data;
};

export const deletePortfolio = async (id: string) => {
  await api.delete(`/portfolio/${id}`);
};