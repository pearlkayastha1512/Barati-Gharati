"use client";

import {
  useEffect,
  useState,
} from "react";

import NotificationHero from "@/components/admin/notifications/NotificationHero";
import NotificationList, {
  AdminNotification,
} from "@/components/admin/notifications/NotificationList";
import { getAdminNotificationsApi } from "@/services/api/admin.api";

type ApiNotificationsResponse = {
  data?: AdminNotification[];
};

export default function NotificationsPage() {
  const [
    notifications,
    setNotifications,
  ] = useState<AdminNotification[]>([]);

  useEffect(() => {
    async function loadNotifications() {
      const result =
        await getAdminNotificationsApi();

      if (!result.ok) {
        setNotifications([]);
        return;
      }

      setNotifications(
        (result.data as ApiNotificationsResponse)
          ?.data ?? []
      );
    }

    void loadNotifications();
  }, []);

  return (
    <div className="space-y-8">
      <NotificationHero />

      <NotificationList
        notifications={notifications}
      />
    </div>
  );
}
