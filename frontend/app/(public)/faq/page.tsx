import { HelpCircle } from "lucide-react";

import FaqAccordion from "@/components/faq/FaqAccordion";

export default function FAQPage() {
  return (
    <main className="bg-slate-50">
      {/* Hero */}
      <section className="bg-gradient-to-r from-rose-500 via-pink-500 to-red-500 py-24 text-white">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-white/20 backdrop-blur">
            <HelpCircle size={40} />
          </div>

          <h1 className="mt-8 text-5xl font-bold">
            Frequently Asked Questions
          </h1>

          <p className="mx-auto mt-6 max-w-3xl text-lg text-rose-100">
            Find quick answers to the most common questions about bookings,
            vendors, payments, reviews and your WedPlan account.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-5xl px-6 py-20">
        <FaqAccordion />
      </section>
    </main>
  );
}