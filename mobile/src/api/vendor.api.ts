// import api from "./axios";

// export const getAllVendors = () => {
//   return api.get("/vendor/all");
// };

// export const getVendorById = (id: string) => {
//   return api.get(`/vendor/${id}`);
// };
import api from "./axios";

export interface RegisterVendorRequest {
  ownerName: string;
  email: string;
  phone: string;
  password: string;

  businessName: string;

  category?: string;
  city?: string;
  address?: string;
  description?: string;

  website?: string;
  instagram?: string;
  facebook?: string;
  youtube?: string;
  linkedin?: string;

  experience?: string;
  gstNumber?: string;
}

export interface RegisterVendorResponse {
  message: string;
}

export const registerVendor = async (
  data: RegisterVendorRequest,
): Promise<RegisterVendorResponse> => {
  const response =
    await api.post<RegisterVendorResponse>(
      "/auth/register/vendor",
      data,
    );

  return response.data;
};

export const getAllVendors = async () => {
  const response = await api.get(
    "/vendor/all",
  );

  return response.data;
};

export const getVendorById = async (
  id: string,
) => {
  const response = await api.get(
    `/vendor/${id}`,
  );

  return response.data;
};