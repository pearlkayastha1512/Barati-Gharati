"use client";

import { useMemo } from "react";

import {
  User,
  Heart,
  CalendarDays,
  Wallet,
} from "lucide-react";

import { useAuthStore } from "@/store/authStore";
import { useCustomerProfileStore } from "@/store/customerProfileStore";
import { useCustomerStore } from "@/store";

export default function ProfileOverview() {
  const user = useAuthStore(
    (state) => state.user
  );

  const profile =
    useCustomerProfileStore(
      (state) => state.profile
    );

  const weddingBudget =
    useCustomerStore(
      (state) => state.weddingBudget
    );

  const profileCompletion =
    useMemo(() => {
      if (!user || !profile) {
        return 0;
      }

      const fields = [
        user.name,
        user.email,
        user.phone,

        profile.gender,

        profile.address,
        profile.city,
        profile.state,
        profile.country,

        profile.partnerName,
        profile.partnerEmail,
        profile.partnerPhone,
        profile.partnerOccupation,

        profile.weddingDate,
        profile.weddingVenue,
        profile.weddingTheme,

        profile.guestCount > 0
          ? "yes"
          : "",
      ];

      const filled =
        fields.filter(Boolean).length;

      return Math.round(
        (filled / fields.length) * 100
      );
    }, [user, profile]);

  if (!user || !profile) {
    return null;
  }

  const stats = [
    {
      title: "Profile",
      value: `${profileCompletion}%`,
      subtitle: "Completed",
      icon: User,
      color:
        "bg-blue-100 text-blue-600",
    },
    {
      title: "Partner",
      value:
        profile.partnerName
          ? "Added"
          : "Pending",
      subtitle: "Information",
      icon: Heart,
      color:
        "bg-pink-100 text-pink-600",
    },
    {
      title: "Wedding",
      value: profile.weddingDate
        ? new Date(
            profile.weddingDate
          ).toLocaleDateString(
            "en-GB",
            {
              day: "2-digit",
              month: "short",
            }
          )
        : "--",
      subtitle: profile.weddingDate
        ? new Date(
            profile.weddingDate
          ).getFullYear()
        : "Not Set",
      icon: CalendarDays,
      color:
        "bg-green-100 text-green-600",
    },
    {
      title: "Budget",
      value: `₹${(
        weddingBudget /
        100000
      ).toFixed(1)}L`,
      subtitle: "Planning",
      icon: Wallet,
      color:
        "bg-yellow-100 text-yellow-600",
    },
  ];

  return (
    <section className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((item) => {
        const Icon = item.icon;

        return (
          <div
            key={item.title}
            className="
              rounded-3xl
              border
              border-gray-200
              bg-white
              p-6
              shadow-sm
              transition-all
              duration-300
              hover:-translate-y-1
              hover:shadow-xl
            "
          >
            <div
              className={`inline-flex rounded-2xl p-3 ${item.color}`}
            >
              <Icon size={22} />
            </div>

            <h3 className="mt-5 text-sm text-gray-700">
              {item.title}
            </h3>

            <p className="mt-2 text-3xl font-bold text-gray-900">
              {item.value}
            </p>

            <p className="mt-2 text-sm text-gray-500">
              {item.subtitle}
            </p>
          </div>
        );
      })}
    </section>
  );
}