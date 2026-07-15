import api from "@/lib/axios";

function getApiError(
  error: any,
  fallback: string
) {
  const message =
    error.response?.data?.message;

  if (Array.isArray(message)) {
    return message.join(" ");
  }

  return typeof message === "string"
    ? message
    : fallback;
}

export async function getMyPortfolioApi() {
  try {
    const { data } = await api.get("/portfolio/my");

    return {
      ok: true,
      data,
    };
  } catch (error: any) {
    return {
      ok: false,
      error:
        error.response?.data?.message ??
        "Unable to load portfolio.",
    };
  }
}

export async function getVendorPortfolioApi(
  vendorId: number
) {
  try {
    const { data } = await api.get(
      `/portfolio/vendor/${vendorId}`
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
        "Unable to load vendor portfolio.",
    };
  }
}

export async function createPortfolioApi(
  formData: FormData
) {
  try {
    const { data } = await api.post(
      "/portfolio",
      formData
    );

    return {
      ok: true,
      data,
    };
  } catch (error: any) {
    return {
      ok: false,
      error: getApiError(
        error,
        error.response
          ? "Unable to upload portfolio."
          : "Backend server se connection nahi ho pa raha hai."
      ),
    };
  }
}

export async function updatePortfolioApi(
  id: string,
  payload: {
    title: string;
    category: string;
    categories?: string[];
    description: string;
  }
) {
  try {
    const { data } = await api.patch(
      `/portfolio/${id}`,
      payload
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
        "Unable to update portfolio.",
    };
  }
}

export async function deletePortfolioApi(
  id: string
) {
  try {
    const { data } = await api.delete(
      `/portfolio/${id}`
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
        "Unable to delete portfolio.",
    };
  }
}
