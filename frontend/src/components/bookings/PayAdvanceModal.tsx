"use client";

import { useState } from "react";

import {
  IndianRupee,
  X,
} from "lucide-react";

import { toast } from "sonner";

import { Booking } from "@/types/booking";
import { useBookingStore } from "@/store/bookingStore";

interface Props {
  booking: Booking;
  open: boolean;
  onClose: () => void;
}

export default function PayAdvanceModal({
  booking,
  open,
  onClose,
}: Props) {
  const [amount, setAmount] = useState("");

  const payAdvance = useBookingStore(
    (state) => state.payAdvance
  );

  if (!open) {
    return null;
  }

  const handlePayment = () => {
    const value = Number(amount);

    if (
      Number.isNaN(value) ||
      value <= 0
    ) {
      toast.error("Enter a valid amount.");
      return;
    }

    if (
      value >
      booking.remainingAmount
    ) {
      toast.error(
        "Amount exceeds remaining balance."
      );
      return;
    }

    payAdvance(
      booking.id,
      value
    );

    toast.success(
      "Advance payment updated."
    );

    setAmount("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-6 text-gray-700 shadow-2xl">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800">
            Pay Advance
          </h2>

          <button
            onClick={onClose}
            className="text-gray-500 transition hover:text-gray-700"
          >
            <X size={22} />
          </button>
        </div>

        <div className="mb-6 rounded-2xl bg-gray-50 p-4">
          <div className="flex justify-between">
            <span className="text-gray-600">
              Remaining
            </span>

            <span className="font-semibold text-gray-800">
              ₹
              {booking.remainingAmount.toLocaleString(
                "en-IN"
              )}
            </span>
          </div>
        </div>

        <div className="relative">
          <IndianRupee
            size={18}
            className="absolute left-4 top-4 text-gray-400"
          />

          <input
            type="number"
            placeholder="Enter amount"
            value={amount}
            onChange={(e) =>
              setAmount(
                e.target.value
              )
            }
            className="w-full rounded-2xl border border-gray-200 py-3 pl-10 pr-4 text-gray-700 placeholder:text-gray-400 outline-none focus:border-indigo-500"
          />
        </div>

        <button
          onClick={handlePayment}
          className="mt-6 w-full rounded-2xl bg-indigo-600 py-3 font-semibold text-white transition hover:bg-indigo-700"
        >
          Pay Advance
        </button>
      </div>
    </div>
  );
}