import api from "@/lib/axios";

export async function getWishlistApi() {
  try {
    const { data } = await api.get("/wishlist");

    return {
      ok: true,
      data,
    };
  } catch (error: any) {
    return {
      ok: false,
      error:
        error.response?.data?.message ??
        "Unable to load wishlist.",
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
  } catch (error: any) {
    return {
      ok: false,
      error:
        error.response?.data?.message ??
        "Unable to add wishlist.",
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
  } catch (error: any) {
    return {
      ok: false,
      error:
        error.response?.data?.message ??
        "Unable to remove wishlist.",
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