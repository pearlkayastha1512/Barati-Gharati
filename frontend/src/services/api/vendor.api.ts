import api from "@/lib/axios";
import { AxiosError } from "axios";
import { Vendor } from "@/types/vendor";
import type { StoredVendor } from "@/services/vendor.service";

type ApiErrorResponse = {
  message?: string;
};

function getErrorMessage(
  error: unknown,
  fallback: string
) {
  if (error instanceof AxiosError) {
    const data = error.response
      ?.data as ApiErrorResponse | undefined;

    return data?.message ?? fallback;
  }

  return fallback;
}

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
  } catch (error) {
    return {
      ok: false,
      error: getErrorMessage(
        error,
        "Unable to load vendors."
      ),
    };
  }
}
   










export async function getMyVendorProfileApi(): Promise<{
  ok: boolean;
  data?: unknown;
  error?: string;
}> {
  try {
    const { data } = await api.get("/vendor/profile");

    return {
      ok: true,
      data: data.data,
    };
  } catch (error) {
    return {
      ok: false,
      error: getErrorMessage(
        error,
        "Unable to load vendor profile."
      ),
    };
  }
}

export async function updateMyVendorProfileApi(
  vendor: StoredVendor
): Promise<{
  ok: boolean;
  data?: unknown;
  error?: string;
}> {
  try {
    const payload = {
      ownerName: vendor.ownerName,
      email: vendor.email,
      phone: vendor.phone,
      businessName: vendor.businessName,
      description: vendor.description,
      address: vendor.address,
      city: vendor.city,
      category: vendor.category,
      website: vendor.website,
      instagram: vendor.instagram,
      facebook: vendor.facebook,
      youtube: vendor.youtube,
      linkedin: vendor.linkedin,
      experience: vendor.experience,
      gstNumber: vendor.gstNumber,
      logoUrl: vendor.profileImage,
      coverImage: vendor.coverImage,
      isActive: vendor.isActive,
    };

    const { data } = await api.patch(
      "/vendor/profile",
      payload
    );

    return {
      ok: true,
      data: data.data,
    };
  } catch (error) {
    return {
      ok: false,
      error: getErrorMessage(
        error,
        "Unable to update vendor profile."
      ),
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
  } catch (error) {
    return {
      ok: false,
      error: getErrorMessage(
        error,
        "Unable to load vendor."
      ),
    };
  }
  
}
