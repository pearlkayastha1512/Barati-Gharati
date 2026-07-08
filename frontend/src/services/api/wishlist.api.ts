import api from "@/lib/axios";
import axios from "axios";

function getApiErrorMessage(
  error: unknown,
  fallback: string
) {
  if (axios.isAxiosError(error)) {
    const message =
      error.response?.data?.message;

    return typeof message === "string"
      ? message
      : fallback;
  }

  return fallback;
}

export async function getWishlistApi() {
  try {
    const { data } = await api.get("/wishlist");

    return {
      ok: true,
      data,
    };
  } catch (error: unknown) {
    return {
      ok: false,
      error: getApiErrorMessage(
        error,
        "Unable to load wishlist."
      ),
    };
  }
}

export async function addWishlistApi(
  vendorId: number
) {
  try {
    const { data } = await api.post(
      "/wishlist",
      {
        vendorId,
      }
    );

    return {
      ok: true,
      data,
    };
  } catch (error: unknown) {
    return {
      ok: false,
      error: getApiErrorMessage(
        error,
        "Unable to add wishlist."
      ),
    };
  }
}

export async function removeWishlistApi(
  vendorId: number
) {
  try {
    await api.delete(
      `/wishlist/${vendorId}`
    );

    return {
      ok: true,
    };
  } catch (error: unknown) {
    return {
      ok: false,
      error: getApiErrorMessage(
        error,
        "Unable to remove wishlist."
      ),
    };
  }
}

export async function checkWishlistApi(
  vendorId: number
) {
  try {
    const { data } = await api.get(
      `/wishlist/check/${vendorId}`
    );

    return {
      ok: true,
      data,
    };
  } catch {
    return {
      ok: false,
      data: {
        wishlisted: false,
      },
    };
  }
}
