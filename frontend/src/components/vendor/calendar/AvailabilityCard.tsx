"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  CalendarCheck2,
  Ban,
  CheckCircle2,
} from "lucide-react";

import { useAvailabilityStore } from "@/store/availabilityStore";
import ManageAvailabilityModal from "./ManageAvailabilityModal";

export default function AvailabilityCard() {
   const [openModal, setOpenModal] =
  useState(false);

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

  const currentDate = new Date();

  const currentMonth =
    currentDate.getMonth();

  const currentYear =
    currentDate.getFullYear();

  const stats = useMemo(() => {
    const bookedDays = availability.filter(
      (item) => {
        const date = new Date(item.date);

        return (
          item.status === "booked" &&
          date.getMonth() ===
            currentMonth &&
          date.getFullYear() ===
            currentYear
        );
      }
    ).length;

    const blocked = availability.filter(
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

    const daysInMonth = new Date(
      currentYear,
      currentMonth + 1,
      0
    ).getDate();

    const available = Math.max(
      daysInMonth -
        bookedDays -
        blocked,
      0
    );
 
    const percentage =
      Math.round(
        (available / daysInMonth) * 100
      );

    return {
      available,
      bookedDays,
      blocked,
      percentage,
    };
  }, [
    availability,
    currentMonth,
    currentYear,
  ]);

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

      <h2 className="text-xl font-bold text-slate-900">
        Availability
      </h2>

      <p className="mt-2 text-sm text-slate-500">
        Current month availability
      </p>

      <div className="mt-6">

        <div className="mb-2 flex items-center justify-between">

          <span className="text-sm text-slate-600">
            Available
          </span>

          <span className="text-sm font-semibold text-green-700">
            {stats.percentage}%
          </span>

        </div>

        <div className="h-3 overflow-hidden rounded-full bg-slate-200">

          <div
            className="h-full rounded-full bg-gradient-to-r from-green-500 to-emerald-600 transition-all duration-500"
            style={{
              width: `${stats.percentage}%`,
            }}
          />

        </div>

      </div>

      <div className="mt-8 space-y-5">

        <Row
          icon={
            <CheckCircle2
              size={18}
              className="text-green-600"
            />
          }
          label="Available Days"
          value={stats.available}
        />

        <Row
          icon={
            <CalendarCheck2
              size={18}
              className="text-blue-600"
            />
          }
          label="Booked Days"
          value={stats.bookedDays}
        />

        <Row
          icon={
            <Ban
              size={18}
              className="text-red-600"
            />
          }
          label="Blocked Days"
          value={stats.blocked}
        />

      </div>

     <button
  onClick={() =>
    setOpenModal(true)
  }
  className="mt-8 w-full rounded-2xl bg-green-600 py-3 font-semibold text-white transition hover:bg-green-700"
>
  Manage Availability
</button>

<ManageAvailabilityModal
  open={openModal}
  onClose={() =>
    setOpenModal(false)
  }
/>

    </section>
  );
}

function Row({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;

  label: string;

  value: number;
}) {
  return (
    <div className="flex items-center justify-between">

      <div className="flex items-center gap-3">

        {icon}

        <span className="text-slate-600">
          {label}
        </span>

      </div>

      <span className="font-bold text-slate-900">
        {value}
      </span>

    </div>
  );
}
