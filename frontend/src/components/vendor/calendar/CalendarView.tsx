"use client";

import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

import { useAuthStore } from "@/store/authStore";
import { useAvailabilityStore } from "@/store/availabilityStore";

import {
  getVendorByUserId,
  StoredVendor,
} from "@/services/vendor.service";

type Value = Date | null;

export default function CalendarView() {
  const [selectedDate, setSelectedDate] =
    useState<Value>(new Date());
  const [vendor, setVendor] =
    useState<StoredVendor | null>(null);

  const { user } = useAuthStore();
const availability = useAvailabilityStore(
  (state) => state.availability
);

const loadVendorAvailability =
  useAvailabilityStore(
    (state) => state.loadVendorAvailability
  );

 useEffect(() => {
  if (!user) return;

  let active = true;

  async function loadVendor() {
    const data = await getVendorByUserId();

    if (!active) return;

    setVendor(data ?? null);

    if (data) {
      await loadVendorAvailability(data.id);
    }
  }

  void loadVendor();

  return () => {
    active = false;
  };
}, [user, loadVendorAvailability]);

  if (!vendor) {
    return null;
  }

  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(
      date.getMonth() + 1
    ).padStart(2, "0");
    const day = String(
      date.getDate()
    ).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  return (
    <section
      id="calendar-view"
      className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm"
    >
      <h2 className="mb-6 text-2xl font-bold text-gray-800">
        Vendor Calendar
      </h2>

      <Calendar
        value={selectedDate}
        onChange={(value) =>
          setSelectedDate(value as Date)
        }
        onClickDay={(date) =>
          setSelectedDate(date)
        }
        tileClassName={({ date }) => {
          const formatted =
            formatDate(date);

          const blocked =
            availability.some(
              (item) =>
                item.vendorId ===
                  vendor.id &&
                item.date ===
                  formatted &&
                item.status ===
                  "blocked"
            );

          const booked =
            availability.some(
              (item) =>
                item.vendorId ===
                  vendor.id &&
                item.date ===
                  formatted &&
                item.status ===
                  "booked"
            );

          if (booked) {
            return "calendar-booked";
          }

          if (blocked) {
            return "calendar-blocked";
          }

          return "";
        }}
      />

      <div className="mt-6 rounded-xl bg-slate-100 p-4">
        <p className="text-sm text-slate-500">
          Selected Date
        </p>

        <p className="mt-1 text-lg font-semibold text-slate-800">
          {selectedDate
            ? selectedDate.toDateString()
            : "None"}
        </p>
      </div>
    </section>
  );
}
