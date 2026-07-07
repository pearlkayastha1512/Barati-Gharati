"use client";

import { useEffect, useMemo } from "react";

import {
  CalendarCheck2,
  Clock3,
  Ban,
  CheckCircle2,
} from "lucide-react";

import { useAvailabilityStore } from "@/store/availabilityStore";

export default function CalendarStats() {
  const availability = useAvailabilityStore(
    (state) => state.availability
  );
  const loadAvailability =
    useAvailabilityStore(
      (state) => state.loadAvailability
    );

  useEffect(() => {
    void loadAvailability();
  }, [loadAvailability]);

  const currentDate = useMemo(
    () => new Date(),
    []
  );

  const currentMonth =
    currentDate.getMonth();

  const currentYear =
    currentDate.getFullYear();

  const stats = useMemo(() => {
    const monthBookings =
      availability.filter((item) => {
        const date = new Date(item.date);

        return (
          item.status === "booked" &&
          date.getMonth() ===
            currentMonth &&
          date.getFullYear() ===
            currentYear
        );
      });

    const todayBookings =
      availability.filter((item) => {
        const date = new Date(item.date);

        return (
          item.status === "booked" &&
          date.toDateString() ===
            currentDate.toDateString()
        );
      });

    const blocked =
      availability.filter(
        (item) => {
          const date = new Date(item.date);

          return (
            item.status === "blocked" &&
            date.getMonth() ===
              currentMonth &&
            date.getFullYear() ===
              currentYear
          );
        }
      ).length;

    const daysInMonth =
      new Date(
        currentYear,
        currentMonth + 1,
        0
      ).getDate();

    const available =
      daysInMonth -
      monthBookings.length -
      blocked;

    return {
      totalEvents:
        monthBookings.length,

      today:
        todayBookings.length,

      blocked,

      available:
        Math.max(
          available,
          0
        ),
    };
  }, [
    availability,
    currentDate,
    currentMonth,
    currentYear,
  ]);

  const cards = [
    {
      title: "Events",
      value: stats.totalEvents,
      icon: CalendarCheck2,
    },
    {
      title: "Today",
      value: stats.today,
      icon: Clock3,
    },
    {
      title: "Blocked",
      value: stats.blocked,
      icon: Ban,
    },
    {
      title: "Available",
      value: stats.available,
      icon: CheckCircle2,
    },
  ];

  return (
    <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

      {cards.map((item) => {
        const Icon =
          item.icon;

        return (
          <div
            key={item.title}
            className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="w-fit rounded-2xl bg-green-100 p-3">

              <Icon
                size={22}
                className="text-green-700"
              />

            </div>

            <p className="mt-5 text-sm text-slate-500">
              {item.title}
            </p>

            <h3 className="mt-2 text-4xl font-bold text-slate-900">
              {item.value}
            </h3>

          </div>
        );
      })}

    </section>
  );
}
