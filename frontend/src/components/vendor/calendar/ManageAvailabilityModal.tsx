

"use client";

import { useEffect, useState } from "react";

import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

import { X } from "lucide-react";
import { toast } from "sonner";

import { useAvailabilityStore } from "@/store/availabilityStore";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function ManageAvailabilityModal({
  open,
  onClose,
}: Props) {
  const availability = useAvailabilityStore(
    (state) => state.availability
  );

  const loadAvailability =
    useAvailabilityStore(
      (state) => state.loadAvailability
    );

  const addAvailability =
    useAvailabilityStore(
      (state) => state.addAvailability
    );

  const deleteExistingAvailability =
    useAvailabilityStore(
      (state) =>
        state.deleteExistingAvailability
    );

  const [selectedDate, setSelectedDate] =
    useState(new Date());

  const [reason, setReason] =
    useState("");

  useEffect(() => {
    if (!open) return;

    void loadAvailability();
  }, [open, loadAvailability]);

  if (!open) {
    return null;
  }

  const formatDate = (date: Date) => {
    const y = date.getFullYear();
    const m = String(
      date.getMonth() + 1
    ).padStart(2, "0");
    const d = String(
      date.getDate()
    ).padStart(2, "0");

    return `${y}-${m}-${d}`;
  };

  const formattedDate =
    formatDate(selectedDate);

  const blocked = availability.find(
    (item) =>
      item.date === formattedDate &&
      item.status === "blocked"
  );

  const booked = availability.some(
    (item) =>
      item.date === formattedDate &&
      item.status === "booked"
  );

  const handleSave = async () => {
    if (booked) {
      toast.error(
        "This date already has a booking."
      );
      return;
    }

    if (blocked) {
      const success =
        await deleteExistingAvailability(
          blocked.id
        );

      if (!success) {
        toast.error(
          "Unable to unblock date."
        );
        return;
      }

      toast.success(
        "Date unblocked successfully."
      );
    } else {
      const success =
        await addAvailability({
          date: formattedDate,
          reason,
        });

      if (!success) {
        toast.error(
          "Unable to block date."
        );
        return;
      }

      toast.success(
        "Date blocked successfully."
      );
    }

    setReason("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-6">
      <div className="w-full max-w-3xl rounded-3xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b px-8 py-6">
          <h2 className="text-2xl font-bold text-slate-800">
            Manage Availability
          </h2>

          <button
            onClick={onClose}
            className="rounded-lg p-2 transition hover:bg-slate-100"
          >
            <X className="h-5 w-5 text-slate-600" />
          </button>
        </div>

        {/* Body */}
        <div className="space-y-8 p-8">
          <Calendar
            value={selectedDate}
            onChange={(value) =>
              setSelectedDate(value as Date)
            }
            className="rounded-xl border border-slate-200 p-4"
          />

          <div>
            <h3 className="font-semibold text-slate-700">
              Selected Date
            </h3>

            <p className="mt-2 text-lg font-bold text-slate-900">
              {selectedDate.toDateString()}
            </p>
          </div>

          <div>
            <label className="mb-2 block font-medium text-slate-700">
              Reason
            </label>

            <textarea
              rows={3}
              value={reason}
              onChange={(e) =>
                setReason(
                  e.target.value
                )
              }
              placeholder="Vacation / Personal Event / Holiday..."
              className="w-full rounded-xl border border-slate-300 p-4 outline-none transition focus:border-green-600 text-gray-500"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 border-t px-8 py-6">
          <button
            onClick={onClose}
            className="rounded-xl border border-slate-300 px-6 py-3 transition hover:bg-slate-100 text-gray-600"
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            disabled={booked}
            className={`rounded-xl px-6 py-3 font-semibold text-white transition ${
              booked
                ? "cursor-not-allowed bg-blue-400"
                : blocked
                ? "bg-red-600 hover:bg-red-700"
                : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {booked
              ? "Booked"
              : blocked
              ? "Unblock Date"
              : "Block Date"}
          </button>
        </div>
      </div>
    </div>
  );
}
