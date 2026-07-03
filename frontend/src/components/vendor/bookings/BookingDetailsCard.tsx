"use client";

import {
  CalendarDays,
  MapPin,
  Phone,
  Wallet,
  User,
  Tag,
} from "lucide-react";

import { useBookingStore } from "@/store/bookingStore";

export default function BookingDetailsCard() {
  const {
    selectedBooking,
    updateStatus,
  } = useBookingStore();

  if (!selectedBooking) {
    return (
      <section className="rounded-3xl border border-slate-200 bg-white p-10 shadow-sm">

        <h2 className="text-2xl font-bold text-slate-900">
          Booking Details
        </h2>

        <div className="mt-12 text-center">

          <p className="text-lg font-medium text-slate-700">
            No Booking Selected
          </p>

          <p className="mt-2 text-slate-500">
            Click the
            <span className="font-semibold">
              {" "}View{" "}
            </span>
            button in the table to view booking details.
          </p>

        </div>

      </section>
    );
  }

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">

      <h2 className="text-2xl font-bold text-slate-900">
        Booking Details
      </h2>

      <div className="mt-8 grid gap-6 md:grid-cols-2">

        <Item
          icon={<User size={18} />}
          label="Customer"
          value={selectedBooking.customerName}
        />

        <Item
          icon={<Phone size={18} />}
          label="Phone"
          value={selectedBooking.customerPhone}
        />

        <Item
          icon={<CalendarDays size={18} />}
          label="Wedding Date"
          value={new Date(
            selectedBooking.eventDate
          ).toLocaleDateString(
            "en-GB",
            {
              day: "2-digit",
              month: "long",
              year: "numeric",
            }
          )}
        />

        <Item
          icon={<MapPin size={18} />}
          label="Venue"
          value={selectedBooking.venue}
        />

        <Item
          icon={<Tag size={18} />}
          label="Package"
          value={selectedBooking.packageName}
        />

        <Item
          icon={<Wallet size={18} />}
          label="Total Amount"
          value={`₹${selectedBooking.amount.toLocaleString(
            "en-IN"
          )}`}
        />

        <Item
          icon={<Wallet size={18} />}
          label="Advance Paid"
          value={`₹${selectedBooking.advancePaid.toLocaleString(
            "en-IN"
          )}`}
        />

        <Item
          icon={<Wallet size={18} />}
          label="Remaining"
          value={`₹${selectedBooking.remainingAmount.toLocaleString(
            "en-IN"
          )}`}
        />

      </div>

      {selectedBooking.bookingStatus ===
        "pending" && (
        <div className="mt-8 flex gap-4">

          <button
            onClick={() =>
              updateStatus(
                selectedBooking.id,
                "accepted"
              )
            }
            className="rounded-2xl bg-green-600 px-6 py-3 font-semibold text-white transition hover:bg-green-700"
          >
            Accept Booking
          </button>

          <button
            onClick={() =>
              updateStatus(
                selectedBooking.id,
                "cancelled"
              )
            }
            className="rounded-2xl bg-red-600 px-6 py-3 font-semibold text-white transition hover:bg-red-700"
          >
            Reject
          </button>

        </div>
      )}

    </section>
  );
}

function Item({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-4">

      <div className="rounded-xl bg-blue-100 p-3 text-blue-700">
        {icon}
      </div>

      <div>

        <p className="text-sm text-slate-500">
          {label}
        </p>

        <p className="font-semibold text-slate-900">
          {value}
        </p>

      </div>

    </div>
  );
}