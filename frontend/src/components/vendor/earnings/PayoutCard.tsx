"use client";

import { useMemo, useState } from "react";

import {
  CalendarDays,
  Wallet,
  ArrowUpRight,
} from "lucide-react";

import { useBookingStore } from "@/store/bookingStore";

import PayoutDetailsModal from "./PaymentDetailsModal";

export default function PayoutCard() {
  const bookings = useBookingStore(
    (state) => state.bookings
  );

  const [open, setOpen] =
    useState(false);

  const { payoutAmount, payoutDate } =
    useMemo(() => {
      const today = new Date();

      let payoutAmount = 0;

      bookings.forEach((booking) => {
        if (
          booking.bookingStatus ===
          "cancelled"
        ) {
          return;
        }

        if (
          booking.paymentStatus ===
            "partial" ||
          booking.paymentStatus ===
            "paid"
        ) {
          payoutAmount +=
            booking.advancePaid;
        }
      });

      const nextPayout = new Date(
        today.getFullYear(),
        today.getMonth(),
        15
      );

      if (today.getDate() > 15) {
        nextPayout.setMonth(
          nextPayout.getMonth() + 1
        );
      }

      return {
        payoutAmount,

        payoutDate:
          nextPayout.toLocaleDateString(
            "en-IN",
            {
              day: "numeric",
              month: "long",
              year: "numeric",
            }
          ),
      };
    }, [bookings]);

  return (
    <>
      <section className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">

        <div className="flex items-center gap-3">

          <div className="rounded-2xl bg-[#ffe1ec] p-3">

            <Wallet
              size={22}
              className="text-[#e4005a]"
            />

          </div>

          <div>

            <h2 className="text-2xl font-bold text-slate-900">
              Next Payout
            </h2>

            <p className="text-sm text-slate-500">
              Expected Settlement
            </p>

          </div>

        </div>

        <h3 className="mt-8 text-5xl font-bold text-[#e4005a]">

          ₹
          {payoutAmount.toLocaleString(
            "en-IN"
          )}

        </h3>

        <div className="mt-6 flex items-center gap-2 text-slate-500">

          <CalendarDays size={18} />

          Scheduled on {payoutDate}

        </div>

        <div className="mt-8 rounded-2xl bg-slate-50 p-4">

          <div className="flex items-center justify-between">

            <span className="text-sm text-slate-500">
              Included Payments
            </span>

            <span className="font-semibold text-slate-900">

              {
                bookings.filter(
                  (booking) =>
                    booking.bookingStatus !==
                      "cancelled" &&
                    (booking.paymentStatus ===
                      "paid" ||
                      booking.paymentStatus ===
                        "partial")
                ).length
              }

            </span>

          </div>

        </div>

        <button
          onClick={() =>
            setOpen(true)
          }
          className="mt-8 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#e4005a] py-3 font-semibold text-white transition hover:bg-[#c8004e]"
        >

          <ArrowUpRight size={18} />

          View Details

        </button>

      </section>

      <PayoutDetailsModal
        open={open}
        onClose={() =>
          setOpen(false)
        }
      />
    </>
  );
}