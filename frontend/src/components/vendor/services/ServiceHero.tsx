"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import {
  BriefcaseBusiness,
  Plus,
  IndianRupee,
  CheckCircle2,
} from "lucide-react";

import { useServiceStore } from "@/store/serviceStore";

interface ServiceHeroProps {
  onAddService: () => void;
}

export default function ServiceHero({
  onAddService,
}: ServiceHeroProps) {
  const services = useServiceStore(
    (state) => state.services
  );

  const stats = useMemo(() => {
    const activeServices = services.filter(
      (service) => service.status === "active"
    );

    const prices = services.map(
      (service) => service.price
    );

    return {
      total: services.length,

      active: activeServices.length,

      minPrice:
        prices.length > 0
          ? Math.min(...prices)
          : 0,

      maxPrice:
        prices.length > 0
          ? Math.max(...prices)
          : 0,
    };
  }, [services]);

  return (
    <motion.section
      initial={{
        opacity: 0,
        y: 15,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      className="rounded-[32px] bg-gradient-to-r from-indigo-700 via-blue-700 to-slate-800 p-8 text-white shadow-xl"
    >
      <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">

        <div>

          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2">

            <BriefcaseBusiness size={16} />

            Services Dashboard

          </div>

          <h1 className="mt-5 text-5xl font-bold">
            Manage your
            <br />
            wedding services
          </h1>

          <p className="mt-5 max-w-xl text-slate-200">
            Create, update and organize all your
            wedding services from one place.
          </p>

          <div className="mt-8 flex flex-wrap gap-8">

            <div>

              <p className="text-sm text-slate-300">
                Total Services
              </p>

              <p className="mt-1 text-3xl font-bold">
                {stats.total}
              </p>

            </div>

            <div>

              <p className="text-sm text-slate-300">
                Active
              </p>

              <p className="mt-1 flex items-center gap-2 text-3xl font-bold">

                <CheckCircle2
                  size={22}
                  className="text-green-300"
                />

                {stats.active}

              </p>

            </div>

            <div>

              <p className="text-sm text-slate-300">
                Starting From
              </p>

              <p className="mt-1 flex items-center text-3xl font-bold">

                <IndianRupee size={24} />

                {stats.minPrice.toLocaleString(
                  "en-IN"
                )}

              </p>

            </div>

          </div>

        </div>

        <div className="rounded-3xl bg-white/10 p-6 backdrop-blur">

          <h3 className="text-xl font-semibold">
            Price Range
          </h3>

          <p className="mt-4 text-4xl font-bold">

            ₹
            {stats.minPrice.toLocaleString(
              "en-IN"
            )}

            {" - "}

            ₹
            {stats.maxPrice.toLocaleString(
              "en-IN"
            )}

          </p>

          <button
            onClick={onAddService}
            className="mt-8 flex items-center gap-2 rounded-2xl bg-white px-6 py-4 font-semibold text-slate-900 transition hover:-translate-y-1"
          >
            <Plus size={18} />

            Add Service

          </button>

        </div>

      </div>
    </motion.section>
  );
}