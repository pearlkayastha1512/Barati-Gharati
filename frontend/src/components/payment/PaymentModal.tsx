"use client";

import { useState } from "react";
import { X, CreditCard, Loader2 } from "lucide-react";

interface Props {
  open: boolean;

  amount: number;

  onClose: () => void;

  onSuccess: () => void;
}

export default function PaymentModal({
  open,
  amount,
  onClose,
  onSuccess,
}: Props) {
  const [loading, setLoading] =
    useState(false);

  if (!open) {
    return null;
  }

  const handlePayment = async () => {
    setLoading(true);

    // Fake payment delay

    setTimeout(() => {
      setLoading(false);

      onSuccess();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-5">

      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl">

        <div className="flex items-center justify-between">

          <h2 className="text-2xl font-bold text-slate-900">
            Complete Payment
          </h2>

          <button
            onClick={onClose}
            disabled={loading}
            className="rounded-xl p-2 hover:bg-slate-100"
          >
            <X />
          </button>

        </div>

        <div className="mt-8 rounded-2xl bg-slate-50 p-6 text-center">

          <CreditCard
            className="mx-auto text-blue-700"
            size={42}
          />

          <p className="mt-4 text-slate-500">
            Amount to Pay
          </p>

          <h1 className="mt-2 text-4xl font-bold text-slate-900">
            ₹{amount.toLocaleString("en-IN")}
          </h1>

        </div>

        <button
          onClick={handlePayment}
          disabled={loading}
          className="mt-8 flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-700 py-4 font-semibold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? (
            <>
              <Loader2
                size={20}
                className="animate-spin"
              />

              Processing Payment...
            </>
          ) : (
            <>
              <CreditCard size={20} />

              Pay Now
            </>
          )}
        </button>

      </div>

    </div>
  );
}