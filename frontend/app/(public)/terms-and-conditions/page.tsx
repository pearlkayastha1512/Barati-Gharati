import {
  FileText,
  ShieldCheck,
  CreditCard,
  CalendarCheck,
  AlertTriangle,
  Scale,
} from "lucide-react";

export default function TermsAndConditionsPage() {
  const sections = [
    {
      title: "Acceptance of Terms",
      icon: FileText,
      content:
        "By accessing or using WedPlan, you agree to comply with these Terms and Conditions. If you do not agree with these terms, please discontinue using the platform.",
    },
    {
      title: "User Accounts",
      icon: ShieldCheck,
      content:
        "Users are responsible for maintaining the confidentiality of their login credentials and all activities performed using their accounts. You agree to provide accurate and up-to-date information.",
    },
    {
      title: "Vendor Responsibilities",
      icon: CalendarCheck,
      content:
        "Vendors are responsible for providing accurate service information, pricing, availability, and fulfilling bookings professionally. Misleading information may result in suspension or removal from the platform.",
    },
    {
      title: "Bookings & Payments",
      icon: CreditCard,
      content:
        "All bookings made through WedPlan are subject to vendor availability. Payments, cancellations, refunds, and advance deposits may follow the individual vendor's policy where applicable.",
    },
    {
      title: "Reviews & Ratings",
      icon: Scale,
      content:
        "Customers may submit reviews based on genuine experiences. Fraudulent, abusive, defamatory or misleading reviews may be removed without prior notice.",
    },
    {
      title: "Prohibited Activities",
      icon: AlertTriangle,
      content:
        "Users must not misuse the platform by posting false information, attempting unauthorized access, distributing malicious software, or engaging in unlawful activities.",
    },
    {
      title: "Limitation of Liability",
      icon: ShieldCheck,
      content:
        "WedPlan acts as a platform connecting customers and vendors. We are not responsible for disputes, service quality, delays, cancellations or damages resulting from agreements between customers and vendors.",
    },
    {
      title: "Changes to Terms",
      icon: FileText,
      content:
        "We reserve the right to update these Terms and Conditions at any time. Continued use of the platform after updates constitutes acceptance of the revised terms.",
    },
  ];

  return (
    <main className="bg-slate-50">
      {/* Hero */}

      <section className="bg-gradient-to-r from-rose-500 via-pink-500 to-red-500 py-24 text-white">
        <div className="mx-auto max-w-6xl px-6 text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-white/20 backdrop-blur">
            <FileText size={40} />
          </div>

          <h1 className="mt-8 text-5xl font-bold">
            Terms & Conditions
          </h1>

          <p className="mx-auto mt-6 max-w-3xl text-lg text-rose-100">
            Please read these Terms and Conditions carefully before using
            WedPlan. They outline the rights, responsibilities and obligations
            of all users on our platform.
          </p>

          <p className="mt-6 text-sm text-rose-100">
            Last Updated: July 2026
          </p>
        </div>
      </section>

      {/* Content */}

      <section className="mx-auto max-w-5xl px-6 py-20">
        <div className="space-y-8">
          {sections.map((section) => {
            const Icon = section.icon;

            return (
              <div
                key={section.title}
                className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm"
              >
                <div className="flex items-center gap-4">
                  <div className="rounded-2xl bg-rose-100 p-3">
                    <Icon
                      size={24}
                      className="text-rose-600"
                    />
                  </div>

                  <h2 className="text-2xl font-bold text-slate-900">
                    {section.title}
                  </h2>
                </div>

                <p className="mt-6 leading-8 text-slate-600">
                  {section.content}
                </p>
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}