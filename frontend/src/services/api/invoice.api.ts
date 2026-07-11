import api from "@/lib/axios";
import { AxiosError } from "axios";

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

export async function downloadInvoiceApi(
  bookingId: string
) {
  try {
    const response = await api.get(
      `/invoice/download/${bookingId}`,
      {
        responseType: "blob",
      }
    );

    return {
      ok: true,
      data: response.data as Blob,
    };
  } catch (error) {
    return {
      ok: false,
      error: getErrorMessage(
        error,
        "Unable to download invoice."
      ),
    };
  }
}
