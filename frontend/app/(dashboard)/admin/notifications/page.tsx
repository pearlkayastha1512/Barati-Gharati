"use client";

import NotificationHero from "@/components/admin/notifications/NotificationHero";
import NotificationList from "@/components/admin/notifications/NotificationList";

export default function NotificationsPage() {
  return (
    <div className="space-y-8">
      <NotificationHero />

      <NotificationList />
    </div>
  );
}