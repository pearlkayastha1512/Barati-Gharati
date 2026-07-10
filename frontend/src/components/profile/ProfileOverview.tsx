"use client";

import { useMemo } from "react";

import {
  User,
  Heart,
  CalendarDays,
  Wallet,
} from "lucide-react";

import { useCustomerProfileData } from "@/hooks/useCustomerProfileData";
import { useCustomerStore } from "@/store";

export default function ProfileOverview() {
  const {
    user,
    personal,
    partner,
    wedding,
    contact,
  } = useCustomerProfileData();

  const weddingBudget =
    useCustomerStore(
      (state) => state.weddingBudget
    );

  const profileCompletion =
    useMemo(() => {
      if (!user) {
        return 0;
      }

      const fields = [
        personal.fullName,
        personal.email,
        personal.phone,

        personal.gender,

        contact.address,
        contact.city,
        contact.state,
        contact.country,

        partner.name,
        partner.email,
        partner.phone,
        partner.occupation,

        wedding.date,
        wedding.venue,
        wedding.theme,

        wedding.guests > 0
          ? "yes"
          : "",
      ];

      const filled =
        fields.filter(Boolean).length;

      return Math.round(
        (filled / fields.length) * 100
      );
    }, [
      contact,
      partner,
      personal,
      user,
      wedding,
    ]);

  if (!user) {
    return null;
  }

  const stats = [
    {
      title: "Profile",
      value: `${profileCompletion}%`,
      subtitle: "Completed",
      icon: User,
      color:
        "bg-[#ffe6eb] text-[#ff4d6d]",
    },
    {
      title: "Partner",
      value:
        partner.name
          ? "Added"
          : "Pending",
      subtitle: "Information",
      icon: Heart,
      color:
        "bg-[#ffe6eb] text-[#ff4d6d]",
    },
    {
      title: "Wedding",
      value: wedding.date
        ? new Date(
            wedding.date
          ).toLocaleDateString(
            "en-GB",
            {
              day: "2-digit",
              month: "short",
            }
          )
        : "--",
      subtitle: wedding.date
        ? new Date(
            wedding.date
          ).getFullYear()
        : "Not Set",
      icon: CalendarDays,
      color:
        "bg-[#fff8d8] text-[#111111]",
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
        "bg-[#fff3b0] text-[#111111]",
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
              border-[#ffb3bf]
              bg-[linear-gradient(145deg,#fffdf0_0%,#fff8d8_100%)]
              p-6
              shadow-md
              shadow-[#ff4d6d]/10
              transition-all
              duration-300
              hover:-translate-y-1
              hover:border-[#ff8fa1]
              hover:shadow-xl
              hover:shadow-[#ff4d6d]/15
            "
          >
            <div
              className={`inline-flex rounded-2xl p-3 ${item.color}`}
            >
              <Icon size={22} />
            </div>

            <h3 className="mt-5 text-sm text-[#6c2d45]">
              {item.title}
            </h3>

            <p className="mt-2 text-3xl font-bold text-[#3f1d2f]">
              {item.value}
            </p>

            <p className="mt-2 text-sm text-[#8d6171]">
              {item.subtitle}
            </p>
          </div>
        );
      })}
    </section>
  );
}
