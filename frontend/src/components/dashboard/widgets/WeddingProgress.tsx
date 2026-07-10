"use client";

import {
  CheckCircle2,
  Circle,
} from "lucide-react";

import { useMemo } from "react";
import { useBookingStore } from "@/store/bookingStore";

const requiredCategories = [
  "Venue",
  "Photographer",
  "Decorator",
  "Makeup",
  "Caterer",
  "DJ",
];

export default function WeddingProgress() {

  const bookings = useBookingStore(
  (state) => state.bookings
);

const checklist = useMemo(() => {
  return requiredCategories.map((category) => ({
    title: category,
    completed: bookings.some(
      (booking) =>
        booking.category === category &&
        booking.bookingStatus !== "cancelled"
    ),
  }));
}, [bookings]);
  const completed = checklist.filter(
    (item) => item.completed
  ).length;

  const progress = Math.round(
    (completed / checklist.length) * 100
  );

  return (
    <div className="rounded-3xl border border-[#ffb3bf] bg-white/90 p-8 shadow-sm shadow-[#ff4d6d]/5">

      <h2 className="text-2xl font-bold text-[#3f1d2f]">
        Essentials Checklist
      </h2>

      <p className="mt-2 text-[#8d6171]">
        See which core wedding services are already covered.
      </p>

      <div className="mt-8">

        <div className="mb-3 flex justify-between">

          <span className="font-medium text-[#7a4a5c]">
            Completion
          </span>

          <span className="font-bold text-[#ff4d6d]">
            {progress}%
          </span>

        </div>

        <div className="h-3 rounded-full bg-[#ffe6eb]">

          <div
            style={{
              width: `${progress}%`,
            }}
            className="h-3 rounded-full bg-gradient-to-r from-[#ff4d6d] via-[#ff9aaa] to-[#ff4d6d]"
          />

        </div>

      </div>

      <div className="mt-8 space-y-4">

        {checklist.map((item) => (

          <div
            key={item.title}
            className="flex items-center gap-3 rounded-2xl border border-[#ffcad3] bg-[#fff5f7] p-3"
          >

            {item.completed ? (

              <CheckCircle2
                className="text-[#ff4d6d]"
                size={20}
              />

            ) : (

              <Circle
                className="text-[#d8a0ad]"
                size={20}
              />

            )}

            <span
              className={
                item.completed
                  ? "font-medium text-[#3f1d2f]"
                  : "text-[#8d6171]"
              }
            >
              {item.title}
            </span>

          </div>

        ))}

      </div>

    </div>
  );
}
