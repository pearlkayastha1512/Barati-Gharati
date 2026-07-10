"use client";

import { useMemo } from "react";

import { useBookingStore } from "@/store/bookingStore";

const tabs = [
  "All",
  "Upcoming",
  "Pending",
  "Completed",
  "Cancelled",
];

export default function BookingTabs() {
  const bookings = useBookingStore(
    (state) => state.bookings
  );

  const activeTab = useBookingStore(
    (state) => state.activeTab
  );

  const setActiveTab = useBookingStore(
    (state) => state.setActiveTab
  );

  const counts = useMemo(() => {
    const today = new Date();

    return {
      All: bookings.length,

      Upcoming: bookings.filter(
        (booking) =>
          booking.bookingStatus !== "cancelled" &&
          new Date(booking.eventDate) >= today
      ).length,

      Pending: bookings.filter(
        (booking) =>
          booking.bookingStatus === "pending"
      ).length,

      Completed: bookings.filter(
        (booking) =>
          booking.bookingStatus === "completed"
      ).length,

      Cancelled: bookings.filter(
        (booking) =>
          booking.bookingStatus === "cancelled"
      ).length,
    };
  }, [bookings]);

  return (
    <div className="overflow-x-auto">
      <div className="inline-flex rounded-2xl border border-[#ffb3bf] bg-white p-2 shadow-sm">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`
              rounded-xl
              px-6
              py-3
              text-sm
              font-semibold
              transition-all
              duration-300

              ${
                activeTab === tab
                  ? "bg-gradient-to-r from-[#ff4d6d] to-[#ff8fa1] text-white shadow-md"
                  : "text-[#7a4a5c] hover:bg-[#fff8d8]"
              }
            `}
          >
            {tab}

            <span className="ml-2 rounded-full bg-white/20 px-2 py-0.5 text-xs">
              {
                counts[
                  tab as keyof typeof counts
                ]
              }
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}