"use client";

import { useMemo } from "react";

import {
  BriefcaseBusiness,
  TrendingUp,
} from "lucide-react";

import { useServiceStore } from "@/store/serviceStore";
import { useBookingStore } from "@/store/bookingStore";

export default function TopServices() {
  const services = useServiceStore(
    (state) => state.services
  );

  const bookings = useBookingStore(
    (state) => state.bookings
  );

  const topServices = useMemo(() => {
    const revenueMap = new Map<
      string,
      {
        revenue: number;
        bookings: number;
      }
    >();

    services.forEach((service) => {
      revenueMap.set(service.category, {
        revenue: 0,
        bookings: 0,
      });
    });

    bookings.forEach((booking) => {
      if (
        booking.bookingStatus ===
        "cancelled"
      ) {
        return;
      }

      const current =
        revenueMap.get(
          booking.category
        ) || {
          revenue: 0,
          bookings: 0,
        };

      current.revenue +=
        booking.vendorNetAmount ?? 0;

      current.bookings += 1;

      revenueMap.set(
        booking.category,
        current
      );
    });

    return Array.from(
      revenueMap.entries()
    )
      .map(([category, data]) => ({
        category,
        revenue: data.revenue,
        bookings: data.bookings,
      }))
      .sort(
        (a, b) =>
          b.revenue -
          a.revenue
      )
      .slice(0, 5);
  }, [services, bookings]);

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">

      <div className="flex items-center justify-between">

        <div>

          <h2 className="text-2xl font-bold text-slate-900">
            Top Performing Services
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Ranked by generated revenue
          </p>

        </div>

        <div className="rounded-xl bg-[#fff8ef] px-4 py-2 text-sm font-semibold text-[#e4005a]">
          {topServices.length} Services
        </div>

      </div>

      <div className="mt-8 space-y-4">

        {topServices.length === 0 ? (
          <div className="rounded-2xl bg-slate-50 py-12 text-center text-slate-500">
            No services available.
          </div>
        ) : (
          topServices.map(
            (service, index) => (
              <div
                key={
                  service.category
                }
                className="flex items-center justify-between rounded-2xl border border-slate-100 p-5 transition hover:bg-slate-50"
              >
                <div className="flex items-center gap-4">

                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#ffe1ec]">

                    <BriefcaseBusiness
                      size={20}
                      className="text-[#e4005a]"
                    />

                  </div>

                  <div>

                    <h3 className="font-semibold text-slate-900">
                      {
                        service.category
                      }
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                      {
                        service.bookings
                      }{" "}
                      Bookings
                    </p>

                  </div>

                </div>

                <div className="text-right">

                  <div className="text-xl font-bold text-[#e4005a]">
                    ₹
                    {service.revenue.toLocaleString(
                      "en-IN"
                    )}
                  </div>

                  <div className="mt-1 flex items-center justify-end gap-1 text-sm text-green-600">

                    <TrendingUp
                      size={15}
                    />

                    #{index + 1}

                  </div>

                </div>

              </div>
            )
          )
        )}

      </div>

    </section>
  );
}
