import {
  AlertTriangle,
  CalendarCheck,
  FileText,
  MessageSquareText,
  ShieldCheck,
  Users,
} from "lucide-react";

const sections = [
  {
    title: "Using Barati Gharati",
    icon: FileText,
    content:
      "You may use Barati Gharati to discover vendors, plan celebrations, manage bookings and communicate about services. You must use the platform lawfully and provide accurate information.",
  },
  {
    title: "Account Security",
    icon: ShieldCheck,
    content:
      "You are responsible for keeping your account credentials secure and for activity performed through your account. Notify us promptly if you suspect unauthorized access.",
  },
  {
    title: "Bookings and Celebrations",
    icon: CalendarCheck,
    content:
      "Services may be booked for weddings, birthdays, anniversaries, corporate events and other celebrations. Availability, pricing, inclusions and fulfilment remain subject to the selected vendor and confirmed booking details.",
  },
  {
    title: "Respectful Communication",
    icon: MessageSquareText,
    content:
      "Customers and vendors must communicate respectfully. Sharing prohibited contact or payment information, abusive content, spam or attempts to bypass platform safeguards may lead to warnings or account restrictions.",
  },
  {
    title: "Acceptable Conduct",
    icon: Users,
    content:
      "Do not impersonate others, submit false reviews, misuse vendor information, interfere with platform operation or use Barati Gharati for fraudulent or unlawful activity.",
  },
  {
    title: "Suspension and Updates",
    icon: AlertTriangle,
    content:
      "We may restrict access when these rules are violated or when required for platform safety. These Terms of Use may be updated, and continued use after an update means you accept the revised terms.",
  },
];

export default function TermsOfUsePage() {
  return (
    <main className="bg-[#f3c1c2]">
      <section className="bg-[linear-gradient(135deg,#8f3159_0%,#d65079_52%,#f29b93_100%)] py-24 text-white">
        <div className="mx-auto max-w-6xl px-6 text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-white/15 backdrop-blur">
            <FileText size={40} />
          </div>
          <h1 className="mt-8 text-5xl font-bold">Terms of Use</h1>
          <p className="mx-auto mt-6 max-w-3xl text-lg text-rose-50">
            These rules explain how customers and vendors may safely use Barati Gharati across weddings and every other celebration we support.
          </p>
          <p className="mt-6 text-sm text-rose-100">Last Updated: July 2026</p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-20">
        <div className="space-y-8">
          {sections.map(({ title, icon: Icon, content }) => (
            <article
              key={title}
              className="rounded-3xl border border-white/70 bg-white p-8 shadow-lg shadow-[#8f3159]/10"
            >
              <div className="flex items-center gap-4">
                <div className="rounded-2xl bg-rose-100 p-3">
                  <Icon size={24} className="text-rose-600" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900">{title}</h2>
              </div>
              <p className="mt-6 leading-8 text-slate-600">{content}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
