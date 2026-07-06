import api from "@/lib/axios";
import { Vendor } from "@/types/vendor";

export async function getVendorsApi(): Promise<{
  ok: boolean;
  data?: Vendor[];
  error?: string;
}> {
  try {
    const { data } = await api.get("/vendor/all");

    return {
      ok: true,
      data: data.data,
    };
  } catch (error: any) {
    return {
      ok: false,
      error:
        error.response?.data?.message ??
        "Unable to load vendors.",
    };
  }
}
   










export async function getMyVendorProfileApi(): Promise<{
  ok: boolean;
  data?: any;
  error?: string;
}> {
  try {
    const { data } = await api.get("/vendor/profile");

    return {
      ok: true,
      data: data.data,
    };
  } catch (error: any) {
    return {
      ok: false,
      error:
        error.response?.data?.message ??
        "Unable to load vendor profile.",
    };
  }
}
export async function getVendorByIdApi(
  id: number
): Promise<{
  ok: boolean;
  data?: Vendor;
  error?: string;
}> {
  try {
    const { data } = await api.get(
      `/vendor/${id}`
    );

    return {
      ok: true,
      data: data.data,
    };
  } catch (error: any) {
    return {
      ok: false,
      error:
        error.response?.data?.message ??
        "Unable to load vendor.",
    };
  }
  
}