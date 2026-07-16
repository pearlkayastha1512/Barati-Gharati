import FAQItem from "./FAQItem";
import { faqs } from "./faq-data";

export default function ContactFAQ() {
  return (
    <section className="bg-[linear-gradient(145deg,#d77f9b_0%,#e9a8b6_48%,#f1c1b9_100%)] py-24">

      <div className="mx-auto max-w-5xl px-6">

        <div className="text-center">

          <p className="font-semibold uppercase tracking-[0.35em] text-rose-500">
            FAQ
          </p>

          <h2 className="mt-5 text-4xl font-bold text-gray-900 lg:text-5xl">
            Frequently Asked
            <span className="block text-rose-500">
              Questions
            </span>
          </h2>

          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-gray-600">
            Find quick answers to the most common questions about
            WedPlan and our wedding planning services.
          </p>

        </div>

        <div className="mt-16 space-y-6">

          {faqs.map((faq) => (
            <FAQItem
              key={faq.id}
              question={faq.question}
              answer={faq.answer}
            />
          ))}

        </div>

      </div>

    </section>
  );
}
