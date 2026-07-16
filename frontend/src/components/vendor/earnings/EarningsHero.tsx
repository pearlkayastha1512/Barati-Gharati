"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import {
  Wallet,
  Download,
  IndianRupee,
  CreditCard,
} from "lucide-react";

import { useBookingStore } from "@/store/bookingStore";
import { getBookingRevenueDate } from "@/utils/bookingRevenue";

export default function EarningsHero() {
  const bookings = useBookingStore(
    (state) => state.bookings
  );

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const {
    totalRevenue,
    monthlyRevenue,
    pendingAmount,
  } = useMemo(() => {
    let totalRevenue = 0;

    let monthlyRevenue = 0;

    let pendingAmount = 0;

    bookings.forEach((booking) => {
      if (
        booking.bookingStatus ===
        "cancelled"
      ) {
        return;
      }

      totalRevenue +=
        booking.vendorNetAmount ?? 0;

      pendingAmount +=
        booking.remainingAmount;

      const date =
        getBookingRevenueDate(booking);

      if (
        date.getMonth() ===
          currentMonth &&
        date.getFullYear() ===
        currentYear
      ) {
        monthlyRevenue +=
          booking.vendorNetAmount ?? 0;
      }
    });

    return {
      totalRevenue,
      monthlyRevenue,
      pendingAmount,
    };
  }, [
    bookings,
    currentMonth,
    currentYear,
  ]);

  return (
    <motion.section
      initial={{
        opacity: 0,
        y: 20,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      className="
        rounded-[32px]
        bg-gradient-to-r
        from-[#e4005a]
        via-[#c90055]
        to-[#ffb703]
        p-8
        text-white
        shadow-xl
      "
    >
      <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">

        <div>

          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2">

            <Wallet size={16} />

            Earnings Dashboard

          </div>

          <h1 className="mt-5 text-5xl font-bold">
            Track your
            <br />
            business revenue.
          </h1>

          <p className="mt-5 max-w-xl text-slate-200">
            Monitor earnings, customer payments,
            pending balances and monthly growth.
          </p>

          <div className="mt-8 flex flex-wrap gap-6">

            <div>

              <p className="text-sm text-slate-300">
                Total Revenue
              </p>

              <h3 className="mt-1 text-3xl font-bold">
                ₹
                {totalRevenue.toLocaleString(
                  "en-IN"
                )}
              </h3>

            </div>

            <div>

              <p className="text-sm text-slate-300">
                This Month
              </p>

              <h3 className="mt-1 text-3xl font-bold">
                ₹
                {monthlyRevenue.toLocaleString(
                  "en-IN"
                )}
              </h3>

            </div>

          </div>

        </div>

        <div className="w-full max-w-sm rounded-3xl bg-white/10 p-6 backdrop-blur">

          <div className="flex items-center gap-3">

            <CreditCard size={22} />

            <h3 className="text-xl font-semibold">
              Pending Payments
            </h3>

          </div>

          <div className="mt-6 flex items-center gap-2">

            <IndianRupee size={26} />

            <span className="text-4xl font-bold">
              {pendingAmount.toLocaleString(
                "en-IN"
              )}
            </span>

          </div>

          <p className="mt-2 text-slate-300">
            Remaining amount to be collected
            from customers.
          </p>

         

        </div>

      </div>

    </motion.section>
  );
}
