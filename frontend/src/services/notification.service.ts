import { Notification } from "@/types/notification";

import {
  createNotificationApi,
  deleteNotificationApi,
  getNotificationsApi,
  markNotificationAsReadApi,
} from "@/services/api/notification.api";

type ApiNotification = {
  id: string;
  userId: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
};

function getNotificationMeta(
  title: string,
  message: string
): Pick<Notification, "type" | "link"> {
  const text = `${title} ${message}`.toLowerCase();

  if (text.includes("message")) {
    return {
      type: "message",
      link: "/customer/messages",
    };
  }

  if (
    text.includes("booking") ||
    text.includes("payment")
  ) {
    return {
      type: "booking",
      link: "/customer/bookings",
    };
  }

  return {
    type: "system",
  };
}

function mapNotification(
  notification: ApiNotification
): Notification {
  return {
    ...notification,
    ...getNotificationMeta(
      notification.title,
      notification.message
    ),
  };
}

export async function getNotifications(): Promise<
  Notification[]
> {
  const result = await getNotificationsApi();

  if (!result.ok || !result.data) {
    return [];
  }

  const data = result.data?.data ?? result.data;

  return Array.isArray(data)
    ? data.map(mapNotification)
    : [];
}

export async function createNotification(
  notification: Notification
): Promise<boolean> {
  const result = await createNotificationApi(
    notification.title,
    notification.message
  );

  return result.ok;
}

export async function markNotificationAsRead(
  id: string
): Promise<boolean> {
  const result =
    await markNotificationAsReadApi(id);

  return result.ok;
}

export async function markAllNotificationsAsRead(
  notifications: Notification[]
): Promise<void> {
  await Promise.all(
    notifications
      .filter((notification) => !notification.isRead)
      .map((notification) =>
        markNotificationAsRead(notification.id)
      )
  );
}

export async function deleteNotification(
  id: string
): Promise<boolean> {
  const result = await deleteNotificationApi(id);

  return result.ok;
}
