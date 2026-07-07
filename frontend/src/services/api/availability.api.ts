import { AxiosError } from "axios";

import api from "@/lib/axios";
import { Availability } from "@/types/availability";

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

export async function getMyAvailabilityApi() {
  try {
    const { data } = await api.get<{
      success: boolean;
      data: Availability[];
    }>("/availability/mine");

    return {
      ok: true,
      data,
    };
  } catch (error) {
    return {
      ok: false,
      error: getErrorMessage(
        error,
        "Unable to load availability."
      ),
    };
  }
}

export async function getVendorAvailabilityApi(
  vendorId: number
) {
  try {
    const { data } = await api.get<{
      success: boolean;
      data: Availability[];
    }>(`/availability/vendor/${vendorId}`);

    return {
      ok: true,
      data,
    };
  } catch (error) {
    return {
      ok: false,
      error: getErrorMessage(
        error,
        "Unable to load availability."
      ),
    };
  }
}

export async function blockAvailabilityApi({
  date,
  reason,
}: {
  date: string;
  reason?: string;
}) {
  try {
    const { data } = await api.post<Availability>(
      "/availability/block",
      {
        date,
        reason,
      }
    );

    return {
      ok: true,
      data,
    };
  } catch (error) {
    return {
      ok: false,
      error: getErrorMessage(
        error,
        "Unable to block date."
      ),
    };
  }
}

export async function unblockAvailabilityApi(
  id: string
) {
  try {
    await api.delete(`/availability/${id}`);

    return {
      ok: true,
    };
  } catch (error) {
    return {
      ok: false,
      error: getErrorMessage(
        error,
        "Unable to unblock date."
      ),
    };
  }
}
