import api from "@/lib/axios";
import { Service } from "@/types/service";

export async function getServicesApi() {
  try {
    const { data } = await api.get("/packages");

    return {
      ok: true,
      data,
    };
  } catch (error: any) {
    return {
      ok: false,
      error:
        error.response?.data?.message ??
        "Unable to load services.",
    };
  }
}

export async function getVendorServicesApi() {
  try {
    const { data } = await api.get(
      "/packages/my/packages"
    );

    return {
      ok: true,
      data,
    };
  } catch (error: any) {
    return {
      ok: false,
      error:
        error.response?.data?.message ??
        "Unable to load vendor services.",
    };
  }
}

export async function createServiceApi(
  service: Service
) {
  try {
    const { data } = await api.post(
      "/packages",
      {
        name: service.name,
        category: service.category,
        description: service.description,
        duration: service.duration,
        price: service.price,
        image: service.image,
        includes: service.includes,
      }
    );

    return {
      ok: true,
      data,
    };
  } catch (error: any) {
    return {
      ok: false,
      error:
        error.response?.data?.message ??
        "Unable to create service.",
    };
  }
}

export async function updateServiceApi(
  service: Service
) {
  try {
    const { data } = await api.patch(
      `/packages/${service.id}`,
      {
        name: service.name,
        category: service.category,
        description: service.description,
        duration: service.duration,
        price: service.price,
        image: service.image,
        includes: service.includes,
      }
    );

    return {
      ok: true,
      data,
    };
  } catch (error: any) {
    return {
      ok: false,
      error:
        error.response?.data?.message ??
        "Unable to update service.",
    };
  }
}

export async function deleteServiceApi(
  id: string
) {
  try {
    await api.delete(`/packages/${id}`);

    return {
      ok: true,
    };
  } catch (error: any) {
    return {
      ok: false,
      error:
        error.response?.data?.message ??
        "Unable to delete service.",
    };
  }
}

