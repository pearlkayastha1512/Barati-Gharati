"use client";

import { useEffect } from "react";

import EarningsHero from "@/components/vendor/earnings/EarningsHero";
import EarningsStats from "@/components/vendor/earnings/EarningsStats";
import RevenueChart from "@/components/vendor/earnings/RevenueChart";
import TransactionsTable from "@/components/vendor/earnings/TransactionsTable";
import PayoutCard from "@/components/vendor/earnings/PayoutCard";
import { useAuthStore } from "@/store/authStore";
import { useBookingStore } from "@/store/bookingStore";

export default function VendorEarningsPage() {
  const user = useAuthStore(
    (state) => state.user
  );
  const loadVendorBookings =
    useBookingStore(
      (state) => state.loadVendorBookings
    );

  useEffect(() => {
    if (!user) {
      return;
    }

    const refresh = () => {
      void loadVendorBookings(0);
    };

    refresh();
    window.addEventListener("focus", refresh);
    const interval = window.setInterval(
      refresh,
      30_000
    );

    return () => {
      window.removeEventListener("focus", refresh);
      window.clearInterval(interval);
    };
  }, [loadVendorBookings, user]);

  return (
    <div className="space-y-8">

      <EarningsHero />

      <EarningsStats />

      <section className="grid gap-6 xl:grid-cols-3">

        <div className="xl:col-span-2">

          <RevenueChart />

        </div>

        <PayoutCard />

      </section>

      <TransactionsTable />

    </div>
  );
}
