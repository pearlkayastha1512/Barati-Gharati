import api from "@/lib/axios";
import axios from "axios";

type ApiErrorResponse = {
  message?: string;
};

function getErrorMessage(
  error: unknown,
  fallback: string
) {
  if (axios.isAxiosError(error)) {
    const data = error.response
      ?.data as ApiErrorResponse | undefined;

    return data?.message ?? fallback;
  }

  return fallback;
}

export async function getNotificationsApi() {
  try {
    const { data } = await api.get(
      "/notifications"
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
        "Unable to load notifications."
      ),
    };
  }
}

export async function createNotificationApi(
  title: string,
  message: string
) {
  try {
    const { data } = await api.post(
      "/notifications",
      {
        title,
        message,
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
        "Unable to create notification."
      ),
    };
  }
}

export async function markNotificationAsReadApi(
  id: string
) {
  try {
    const { data } = await api.patch(
      `/notifications/${id}/read`,
      {
        isRead: true,
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
        "Unable to update notification."
      ),
    };
  }
}

export async function deleteNotificationApi(
  id: string
) {
  try {
    await api.delete(`/notifications/${id}`);

    return {
      ok: true,
    };
  } catch (error) {
    return {
      ok: false,
      error: getErrorMessage(
        error,
        "Unable to delete notification."
      ),
    };
  }
}
