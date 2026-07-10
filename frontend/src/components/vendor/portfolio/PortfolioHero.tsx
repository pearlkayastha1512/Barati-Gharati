"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import {
  Images,
  Upload,
  ImageIcon,
} from "lucide-react";

import { usePortfolioStore } from "@/store/portfolioStore";

interface PortfolioHeroProps {
  onUpload: () => void;
}

export default function PortfolioHero({
  onUpload,
}: PortfolioHeroProps) {
  const portfolio = usePortfolioStore(
    (state) => state.portfolio
  );

  const stats = useMemo(() => {
    const categories = new Set(
      portfolio.map(
        (item) => item.category
      )
    );

    return {
      totalItems: portfolio.length,

      totalCategories:
        categories.size,

      latestUpload:
        portfolio.length > 0
          ? new Date(
              portfolio[
                portfolio.length - 1
              ].createdAt
            ).toLocaleDateString(
              "en-GB",
              {
                day: "2-digit",
                month: "short",
                year: "numeric",
              }
            )
          : "No uploads",
    };
  }, [portfolio]);

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
      className="rounded-[32px] bg-gradient-to-r from-[#e4005a] via-[#c90055] to-[#ffb703] p-8 text-white shadow-xl"
    >
      <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">

        <div>

          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2">

            <Images size={16} />

            Portfolio Gallery

          </div>

          <h1 className="mt-5 text-5xl font-bold">
            Showcase your
            <br />
            best work
          </h1>

          <p className="mt-5 max-w-xl text-slate-200">
            Impress couples with beautiful wedding memories and increase bookings through your portfolio.
          </p>

          <div className="mt-8 flex flex-wrap gap-8">

            <div>

              <p className="text-sm text-slate-300">
                Total Uploads
              </p>

              <p className="mt-1 text-3xl font-bold">
                {stats.totalItems}
              </p>

            </div>

            <div>

              <p className="text-sm text-slate-300">
                Categories
              </p>

              <p className="mt-1 text-3xl font-bold">
                {stats.totalCategories}
              </p>

            </div>

            <div>

              <p className="text-sm text-slate-300">
                Latest Upload
              </p>

              <p className="mt-1 text-2xl font-bold">
                {stats.latestUpload}
              </p>

            </div>

          </div>

        </div>

        <div className="rounded-3xl bg-white/10 p-6 backdrop-blur">

          <div className="flex items-center gap-3">

            <ImageIcon size={22} />

            <h3 className="text-xl font-semibold">
              Gallery Overview
            </h3>

          </div>

          <p className="mt-5 text-5xl font-bold">
            {stats.totalItems}
          </p>

          <p className="mt-2 text-slate-300">
            Portfolio Items
          </p>

          <button
            onClick={onUpload}
            className="mt-8 flex items-center gap-2 rounded-2xl bg-white px-6 py-4 font-semibold text-slate-900 transition hover:-translate-y-1"
          >
            <Upload size={18} />

            Upload Portfolio

          </button>

        </div>

      </div>

    </motion.section>
  );
}