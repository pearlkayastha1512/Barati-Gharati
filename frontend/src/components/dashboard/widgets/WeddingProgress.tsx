"use client";

import {
  CheckCircle2,
  Circle,
} from "lucide-react";

import { useMemo } from "react";
import { useBookingStore } from "@/store/bookingStore";
export default function WeddingProgress() {

  const bookings = useBookingStore(
  (state) => state.bookings
);

const requiredCategories = [
  "Venue",
  "Photographer",
  "Decorator",
  "Makeup",
  "Caterer",
  "DJ",
];

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
    <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">

      <h2 className="text-2xl font-bold text-gray-900">
        Wedding Progress
      </h2>

      <p className="mt-2 text-gray-500">
        Track your wedding planning.
      </p>

      <div className="mt-8">

        <div className="mb-3 flex justify-between">

          <span className="font-medium">
            Completion
          </span>

          <span className="font-bold text-rose-500">
            {progress}%
          </span>

        </div>

        <div className="h-3 rounded-full bg-gray-100">

          <div
            style={{
              width: `${progress}%`,
            }}
            className="h-3 rounded-full bg-gradient-to-r from-rose-500 to-pink-500"
          />

        </div>

      </div>

      <div className="mt-8 space-y-4">

        {checklist.map((item) => (

          <div
            key={item.title}
            className="flex items-center gap-3"
          >

            {item.completed ? (

              <CheckCircle2
                className="text-green-500"
                size={20}
              />

            ) : (

              <Circle
                className="text-gray-300"
                size={20}
              />

            )}

            <span
              className={
                item.completed
                  ? "font-medium text-gray-900"
                  : "text-gray-500"
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