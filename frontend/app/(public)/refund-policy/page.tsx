"use client";

import {
  Wallet,
  Receipt,
  CreditCard,
  CircleDollarSign,
  Landmark,
  BadgeAlert,
  ShieldCheck,
  RefreshCcw,
} from "lucide-react";

import { refundSections } from "@/data/refundData";

export default function RefundPolicyPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#0F0F11] text-white">
      {/* ================= BACKGROUND ================= */}

      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute left-[-250px] top-[-200px] h-[38rem] w-[38rem] rounded-full bg-yellow-500/10 blur-3xl" />

        <div className="absolute right-[-220px] top-[10%] h-[34rem] w-[34rem] rounded-full bg-amber-400/10 blur-3xl" />

        <div className="absolute bottom-[-180px] left-[25%] h-[30rem] w-[30rem] rounded-full bg-orange-400/10 blur-3xl" />

        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />

        <div className="absolute left-[10%] top-[20%] text-8xl opacity-[0.04]">
          💳
        </div>

        <div className="absolute right-[15%] top-[40%] text-8xl opacity-[0.04]">
          💰
        </div>

        <div className="absolute bottom-[20%] left-[20%] text-8xl opacity-[0.04]">
          📄
        </div>

        <div className="absolute right-[18%] bottom-[15%] text-8xl opacity-[0.04]">
          🏦
        </div>
      </div>

      {/* ================= HERO ================= */}

      <section className="relative px-6 pb-24 pt-28">
        <div className="mx-auto max-w-7xl text-center">
          <div className="relative mx-auto flex h-40 w-40 items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-yellow-500/20 blur-3xl" />

            <div className="absolute inset-0 rounded-full border border-yellow-500/30" />

            <div className="relative flex h-32 w-32 items-center justify-center rounded-full border border-yellow-500/40 bg-white/5 backdrop-blur-xl shadow-[0_0_80px_rgba(234,179,8,0.25)]">
              <Wallet className="h-16 w-16 text-yellow-400" />
            </div>
          </div>

          <p className="mt-8 text-xs font-bold uppercase tracking-[0.8em] text-yellow-400">
            Payments & Billing
          </p>

          <h1 className="mt-8 font-serif text-6xl font-bold tracking-wide text-yellow-400 md:text-8xl">
            Refund Policy
          </h1>

          <p className="mx-auto mt-8 max-w-3xl text-lg leading-9 text-gray-300">
            Learn how refunds, subscriptions, duplicate payments, vendor
            plans, and billing disputes are handled on Barati Gharati.
          </p>

          <p className="mt-8 text-lg italic text-yellow-300">
            💳 Payments • Refunds • Transparency 💳
          </p>

          <div className="mt-10 inline-flex items-center gap-3 rounded-full border border-yellow-500/20 bg-white/5 px-8 py-4 text-sm font-medium text-yellow-300 backdrop-blur-xl">
            📜 Effective Date: 1 August 2026
          </div>
        </div>
      </section>

      {/* ================= QUICK LINKS ================= */}

      <section className="relative px-6">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <h2 className="font-serif text-4xl text-white">
              Explore Refund Sections
            </h2>

            <p className="mt-3 text-gray-400">
              Browse all important refund and payment policies.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {refundSections.map((section, index) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="
                  group
                  relative
                  overflow-hidden
                  rounded-[30px]
                  border
                  border-yellow-500/20
                  bg-white/[0.03]
                  p-6
                  backdrop-blur-xl
                  transition-all
                  duration-500
                  hover:-translate-y-2
                  hover:border-yellow-400
                  hover:bg-white/[0.06]
                  hover:shadow-[0_25px_80px_rgba(234,179,8,0.15)]
                "
              >
                <div className="absolute right-5 top-5 text-5xl font-bold text-white/[0.05]">
                  {String(index + 1).padStart(2, "0")}
                </div>

                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-yellow-500/20 bg-yellow-500/10">
                  <Receipt className="h-6 w-6 text-yellow-400" />
                </div>

                <p className="text-xs font-bold uppercase tracking-[0.3em] text-yellow-500">
                  Section
                </p>

                <h3 className="mt-3 text-lg font-semibold text-white transition-colors duration-300 group-hover:text-yellow-300">
                  {section.title}
                </h3>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ================= CONTENT ================= */}

      <section className="relative px-6 py-20">
        <div className="mx-auto max-w-5xl space-y-10">
          {refundSections.map((section) => (
            <div
              key={section.id}
              id={section.id}
              className="
                relative
                scroll-mt-32
                overflow-hidden
                rounded-[34px]
                border
                border-yellow-500/15
                bg-gradient-to-br
                from-white/[0.03]
                to-white/[0.01]
                p-10
                backdrop-blur-xl
                transition-all
                duration-500
                hover:border-yellow-400/40
                hover:shadow-[0_30px_100px_rgba(234,179,8,0.12)]
              "
            >
              <div className="absolute right-6 top-4 text-8xl font-bold text-white/[0.03]">
                {section.title.split(".")[0]}
              </div>

              <div className="absolute left-0 top-0 h-[3px] w-full bg-gradient-to-r from-yellow-500 via-amber-400 to-transparent" />

              <div className="mb-10 flex items-center gap-5">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-yellow-500/20 bg-yellow-500/10">
                  <CircleDollarSign className="h-8 w-8 text-yellow-400" />
                </div>

                <div>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-[0.4em] text-yellow-500">
                    Refund Section
                  </p>

                  <h2 className="font-serif text-2xl text-white md:text-3xl">
                    {section.title}
                  </h2>
                </div>
              </div>

              <div className="space-y-5">
                {section.content.map((item, index) => (
                  <div
                    key={index}
                    className="
                      flex
                      gap-5
                      rounded-2xl
                      border
                      border-yellow-500/10
                      bg-black/20
                      px-6
                      py-5
                      transition-all
                      duration-300
                      hover:border-yellow-500/30
                      hover:bg-black/30
                    "
                  >
                    <div className="mt-1 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-yellow-500/30 bg-yellow-500/10 text-yellow-400">
                      💰
                    </div>

                    <p className="leading-8 text-gray-300">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* ================= HIGHLIGHTS ================= */}

          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-3xl border border-yellow-500/15 bg-white/[0.03] p-8 backdrop-blur-xl">
              <CreditCard className="h-10 w-10 text-yellow-400" />

              <h3 className="mt-5 text-xl font-bold text-white">
                Duplicate Payments
              </h3>

              <p className="mt-3 text-gray-400">
                Duplicate transactions may be reviewed and adjusted after
                verification.
              </p>
            </div>

            <div className="rounded-3xl border border-yellow-500/15 bg-white/[0.03] p-8 backdrop-blur-xl">
              <RefreshCcw className="h-10 w-10 text-yellow-400" />

              <h3 className="mt-5 text-xl font-bold text-white">
                Failed Transactions
              </h3>

              <p className="mt-3 text-gray-400">
                Banking or gateway failures may automatically reverse the
                amount.
              </p>
            </div>

            <div className="rounded-3xl border border-yellow-500/15 bg-white/[0.03] p-8 backdrop-blur-xl">
              <BadgeAlert className="h-10 w-10 text-yellow-400" />

              <h3 className="mt-5 text-xl font-bold text-white">
                Chargebacks
              </h3>

              <p className="mt-3 text-gray-400">
                Fraudulent chargebacks may lead to suspension or legal action.
              </p>
            </div>
          </div>

          {/* ================= FOOTER ================= */}

          <div className="relative overflow-hidden rounded-[42px] border border-yellow-500/20 bg-gradient-to-br from-[#171717] to-[#0D0D0D] p-16 shadow-2xl">
            <div className="absolute left-10 top-10 text-7xl opacity-5">
              📄
            </div>

            <div className="absolute right-10 bottom-10 text-7xl opacity-5">
              💳
            </div>

            <div className="relative z-10 text-center">
              <div className="mb-8 flex justify-center gap-5 text-5xl">
                💳 💰 📄
              </div>

              <h2 className="font-serif text-5xl text-yellow-400">
                Refund Transparency
              </h2>

              <p className="mx-auto mt-6 max-w-3xl text-lg leading-9 text-gray-300">
                Vendor subscriptions, premium plans, lead packages, and
                promotional services are generally non-refundable, while
                duplicate payments and verified billing issues may be reviewed
                according to platform policies.
              </p>

              <div className="mx-auto mt-10 h-px max-w-md bg-yellow-500/30" />

              <p className="mt-8 text-sm text-gray-400">
                © 2026 Barati Gharati • True Knock Industries Pvt. Ltd.
              </p>

              <p className="mt-3 text-sm text-yellow-500">
                Secure payments. Clear policies.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}