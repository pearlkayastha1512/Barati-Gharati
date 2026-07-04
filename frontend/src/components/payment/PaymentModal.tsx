"use client";

import { useState } from "react";

import {
  X,
  CreditCard,
  Loader2,
} from "lucide-react";

import { AnimatePresence, motion } from "framer-motion";

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

  const handlePayment = () => {
    setLoading(true);

    setTimeout(() => {
      setLoading(false);

      onSuccess();
    }, 2000);
  };

  return (
    <AnimatePresence>

      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 p-5 backdrop-blur-sm"
        >
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.9,
              y: 40,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              scale: 0.9,
              y: 40,
            }}
            transition={{
              duration: 0.25,
            }}
            className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl"
          >

            <div className="flex items-center justify-between">

              <h2 className="text-2xl font-bold text-slate-900">
                Complete Payment
              </h2>

              <button
                onClick={onClose}
                disabled={loading}
                className="rounded-xl p-2 transition hover:bg-slate-100"
              >
                <X />
              </button>

            </div>

            <div className="mt-8 rounded-2xl bg-slate-50 p-6 text-center">

              <CreditCard
                size={46}
                className="mx-auto text-blue-700"
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
              className="mt-8 flex w-full items-center justify-center gap-3 rounded-2xl bg-blue-700 py-4 font-semibold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-70"
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

          </motion.div>
        </motion.div>
      )}

    </AnimatePresence>
  );
}