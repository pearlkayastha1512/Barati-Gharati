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

  const handlePayment = async () => {
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

    const success = await payAdvance(
      booking.id,
      value
    );

    if (!success) {
      toast.error(
        "Unable to update payment."
      );
      return;
    }

    toast.success(
      "Advance payment updated."
    );

    setAmount("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-3xl bg-[#fffdf0] p-6 text-[#6c2d45] shadow-2xl">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-[#3f1d2f]">
            Pay Advance
          </h2>

          <button
            onClick={onClose}
            className="text-[#8d6171] transition hover:text-[#6c2d45]"
          >
            <X size={22} />
          </button>
        </div>

        <div className="mb-6 rounded-2xl bg-[#fffdf0] p-4">
          <div className="flex justify-between">
            <span className="text-[#7a4a5c]">
              Remaining
            </span>

            <span className="font-semibold text-[#3f1d2f]">
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
            className="absolute left-4 top-4 text-[#ff8fa1]"
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
            className="w-full rounded-2xl border border-[#ffb3bf] py-3 pl-10 pr-4 text-[#6c2d45] placeholder:text-[#ff8fa1] outline-none focus:border-[#ff4d6d]"
          />
        </div>

        <button
          onClick={handlePayment}
          className="mt-6 w-full rounded-2xl bg-[#ff4d6d] py-3 font-semibold text-white transition hover:bg-[#e63b5f]"
        >
          Pay Advance
        </button>
      </div>
    </div>
  );
}
