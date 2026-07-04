"use client";

import { useState } from "react";
import { ChevronDown, Search } from "lucide-react";

const faqs = [
  {
    question: "How do I book a vendor?",
    answer:
      "Browse vendors, open their profile, click Book Now, select your wedding details, complete the payment and your booking will be confirmed.",
  },
  {
    question: "Can I cancel my booking?",
    answer:
      "Yes. Cancellation depends on the vendor's cancellation policy. Visit My Bookings to manage your bookings.",
  },
  {
    question: "Are all vendors verified?",
    answer:
      "Yes. Every vendor goes through a verification process before becoming visible on the platform.",
  },
  {
    question: "How do I contact a vendor?",
    answer:
      "You can use the built-in messaging feature or contact details provided on the vendor profile.",
  },
  {
    question: "How do payments work?",
    answer:
      "Customers pay an advance amount to confirm the booking. Remaining payment is settled according to the vendor's terms.",
  },
  {
    question: "Can I edit my booking?",
    answer:
      "You can update your booking details by contacting the vendor after confirmation.",
  },
  {
    question: "How do I leave a review?",
    answer:
      "After your booking is completed, you'll be able to rate the vendor and leave a review from your bookings page.",
  },
  {
    question: "Can vendors reply to reviews?",
    answer:
      "Yes. Vendors can publicly reply to customer reviews, and replies are visible to everyone.",
  },
  {
    question: "How do I become a vendor?",
    answer:
      "Click 'Become a Vendor', complete the registration process and submit your business information for approval.",
  },
  {
    question: "Is my personal information secure?",
    answer:
      "Yes. We protect user information using industry-standard security practices and never share personal data without permission.",
  },
];

export default function FaqAccordion() {
  const [search, setSearch] = useState("");
  const [active, setActive] = useState<number | null>(0);

  const filteredFaqs = faqs.filter(
    (item) =>
      item.question
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      item.answer
        .toLowerCase()
        .includes(search.toLowerCase())
  );

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
      <div className="relative mb-8">
        <Search
          size={20}
          className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600"
        />

        <input
          type="text"
          placeholder="Search FAQs..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-14 w-full rounded-2xl border border-slate-300 pl-14 pr-5 outline-none transition focus:border-rose-500 text-gray-600"
        />
      </div>

      <div className="space-y-4">
        {filteredFaqs.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 py-12 text-center text-slate-500">
            No FAQs found.
          </div>
        ) : (
          filteredFaqs.map((faq, index) => {
            const open = active === index;

            return (
              <div
                key={faq.question}
                className="overflow-hidden rounded-2xl border border-slate-200"
              >
                <button
                  onClick={() =>
                    setActive(open ? null : index)
                  }
                  className="flex w-full items-center justify-between bg-white px-6 py-5 text-left transition hover:bg-rose-50"
                >
                  <span className="text-lg font-semibold text-slate-900">
                    {faq.question}
                  </span>

                  <ChevronDown
                    size={22}
                    className={`transition ${
                      open ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {open && (
                  <div className="border-t border-slate-200 bg-slate-50 px-6 py-5 leading-7 text-slate-600">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}