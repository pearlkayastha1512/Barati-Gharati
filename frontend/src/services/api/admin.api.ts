import { useAuthStore } from "@/store/authStore";

const API_URL = `${
  process.env.NEXT_PUBLIC_API_URL ??
  "http://localhost:8000/api/v1"
}/admin`;

type AdminApiResult = {
  ok: boolean;
  data?: unknown;
  error?: string;
};

function getHeaders() {
  const token = useAuthStore.getState().token;

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

async function requestAdmin(
  path: string,
  init: RequestInit = {}
): Promise<AdminApiResult> {
  try {
    const response = await fetch(
      `${API_URL}${path}`,
      {
        ...init,
        headers: {
          ...getHeaders(),
          ...init.headers,
        },
      }
    );

    const text = await response.text();
    const data = text
      ? JSON.parse(text)
      : undefined;

    return {
      ok: response.ok,
      data,
      error:
        data?.message ??
        "Unable to complete request.",
    };
  } catch {
    return {
      ok: false,
      data: {
        success: false,
        data: [],
      },
      error:
        "Unable to connect to backend server.",
    };
  }
}

// ================================
// Dashboard
// ================================

export async function getDashboardApi() {
  return requestAdmin("/dashboard");
}

// ================================
// Vendors
// ================================

export async function getAllVendorsApi() {
  return requestAdmin("/vendors");
}

export async function getAllUsersApi() {
  return requestAdmin("/users");
}

export async function getAllBookingsApi() {
  return requestAdmin("/bookings");
}

export async function approveBookingApi(
  id: string
) {
  return requestAdmin(
    `/bookings/${id}/approve`,
    {
      method: "PATCH",
    }
  );
}

export async function approveBookingPaymentApi(
  id: string
) {
  return requestAdmin(
    `/bookings/${id}/approve-payment`,
    {
      method: "PATCH",
    }
  );
}

export async function holdBookingPaymentApi(
  id: string
) {
  return requestAdmin(
    `/bookings/${id}/hold-payment`,
    {
      method: "PATCH",
    }
  );
}

export async function getEmailLogsApi() {
  return requestAdmin("/emails");
}

export async function getAdminNotificationsApi() {
  return requestAdmin("/notifications");
}

export type ChatModerationStatus =
  | "active"
  | "muted"
  | "blocked"
  | "suspended"
  | "flagged";

export type ChatModerationUser = {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "customer" | "vendor";
  warningCount: number;
  chatMutedUntil?: string | null;
  isChatFlagged: boolean;
  isChatBlocked: boolean;
  isSuspended: boolean;
  lastViolationTime?: string | null;
  violationReason: string;
  status: ChatModerationStatus;
};

export async function getChatModerationUsersApi() {
  return requestAdmin("/chat/users");
}

export async function muteChatUserApi(
  id: string,
  durationMinutes: number
) {
  return requestAdmin(`/chat/${id}/mute`, {
    method: "PATCH",
    body: JSON.stringify({
      durationMinutes,
    }),
  });
}

export async function blockChatUserApi(
  id: string
) {
  return requestAdmin(`/chat/${id}/block`, {
    method: "PATCH",
  });
}

export async function suspendChatUserApi(
  id: string
) {
  return requestAdmin(
    `/chat/${id}/suspend`,
    {
      method: "PATCH",
    }
  );
}

export async function resetChatWarningsApi(
  id: string
) {
  return requestAdmin(
    `/chat/${id}/reset-warnings`,
    {
      method: "PATCH",
    }
  );
}

export type PlatformSettingsPayload = {
  allowVendorRegistration?: boolean;
  allowCustomerRegistration?: boolean;
  enableReviews?: boolean;
  enablePayments?: boolean;
  maintenanceMode?: boolean;
};

export async function getPlatformSettingsApi() {
  return requestAdmin("/settings");
}

export async function updatePlatformSettingsApi(
  payload: PlatformSettingsPayload
) {
  return requestAdmin("/settings", {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export async function getVendorByIdApi(
  id: string,
) {
  return requestAdmin(`/vendors/${id}`);
}

export async function approveVendorApi(
  id: string,
) {
  return requestAdmin(
    `/vendors/${id}/approve`,
    {
      method: "PATCH",
    }
  );
}

export async function rejectVendorApi(
  id: string,
) {
  return requestAdmin(
    `/vendors/${id}/reject`,
    {
      method: "PATCH",
    }
  );
}

export async function updateVendorBadgeApi(
  id: string,
  badge: "bronze" | "silver" | "gold"
) {
  return requestAdmin(
    `/vendors/${id}/badge`,
    {
      method: "PATCH",
      body: JSON.stringify({
        badge: badge.toUpperCase(),
      }),
    }
  );
}

export async function deleteVendorApi(
  id: string,
) {
  return requestAdmin(`/vendors/${id}`, {
    method: "DELETE",
  });
}
