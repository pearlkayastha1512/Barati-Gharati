"use client";

import {
  Bell,
  CalendarCheck2,
  CreditCard,
  Star,
  UserPlus,
} from "lucide-react";

const notifications = [
  {
    id: 1,
    icon: UserPlus,
    title: "New Vendor Registered",
    description: "A new vendor joined the platform.",
  },
  {
    id: 2,
    icon: Bell,
    title: "Vendor Approved",
    description: "A vendor profile was approved.",
  },
  {
    id: 3,
    icon: CalendarCheck2,
    title: "New Booking",
    description: "A customer placed a booking.",
  },
  {
    id: 4,
    icon: CreditCard,
    title: "Payment Received",
    description: "Advance payment received.",
  },
  {
    id: 5,
    icon: Star,
    title: "New Review",
    description: "A customer submitted a review.",
  },
];

export default function NotificationList() {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white shadow-sm">
      {notifications.map((item) => {
        const Icon = item.icon;

        return (
          <div
            key={item.id}
            className="flex items-center gap-5 border-b border-slate-100 p-6 last:border-b-0"
          >
            <div className="rounded-2xl bg-blue-100 p-3">
              <Icon
                size={22}
                className="text-blue-700"
              />
            </div>

            <div>
              <h3 className="font-semibold text-slate-900">
                {item.title}
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                {item.description}
              </p>
            </div>
          </div>
        );
      })}
    </section>
  );
}