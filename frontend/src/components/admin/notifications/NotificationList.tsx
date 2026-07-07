"use client";

import {
  Bell,
  CalendarCheck2,
  CreditCard,
  Star,
  UserPlus,
} from "lucide-react";

export interface AdminNotification {
  id: string;
  title: string;
  message: string;
  recipientName?: string;
  recipientEmail?: string;
  recipientRole?: string;
  isRead: boolean;
  createdAt: string;
}

interface NotificationListProps {
  notifications: AdminNotification[];
}

function getNotificationIcon(title: string) {
  const text = title.toLowerCase();

  if (text.includes("booking")) {
    return CalendarCheck2;
  }

  if (text.includes("payment")) {
    return CreditCard;
  }

  if (text.includes("review")) {
    return Star;
  }

  if (
    text.includes("vendor") ||
    text.includes("registration")
  ) {
    return UserPlus;
  }

  return Bell;
}

export default function NotificationList({
  notifications,
}: NotificationListProps) {
  if (notifications.length === 0) {
    return (
      <section className="rounded-3xl border border-slate-200 bg-white p-20 text-center shadow-sm">
        <h2 className="text-2xl font-bold text-slate-700">
          No Notifications
        </h2>

        <p className="mt-3 text-slate-500">
          Recent platform notifications will appear here.
        </p>
      </section>
    );
  }

  return (
    <section className="rounded-3xl border border-slate-200 bg-white shadow-sm">
      {notifications.map((item) => {
        const Icon = getNotificationIcon(
          item.title
        );

        return (
          <div
            key={item.id}
            className="flex items-start gap-5 border-b border-slate-100 p-6 last:border-b-0"
          >
            <div className="rounded-2xl bg-blue-100 p-3">
              <Icon
                size={22}
                className="text-blue-700"
              />
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h3 className="font-semibold text-slate-900">
                  {item.title}
                </h3>

                {!item.isRead && (
                  <span className="rounded-full bg-blue-100 px-2.5 py-1 text-xs font-semibold text-blue-700">
                    Unread
                  </span>
                )}
              </div>

              <p className="mt-1 text-sm text-slate-500">
                {item.message}
              </p>

              <p className="mt-2 text-xs text-slate-400">
                {item.recipientName || "User"}
                {item.recipientRole
                  ? ` (${item.recipientRole.toLowerCase()})`
                  : ""}
                {" - "}
                {new Date(
                  item.createdAt
                ).toLocaleString()}
              </p>
            </div>
          </div>
        );
      })}
    </section>
  );
}
