import {
  ShieldCheck,
  Lock,
  Database,
  Eye,
} from "lucide-react";

export default function PrivacyPolicyPage() {
  const sections = [
    {
      title: "Information We Collect",
      icon: Database,
      content:
        "We collect basic account information such as your name, email address, phone number, profile details, booking information, reviews and payment-related details necessary to provide our services.",
    },
    {
      title: "How We Use Your Information",
      icon: Eye,
      content:
        "Your information is used to create your account, manage bookings, connect customers with vendors, improve platform performance, provide customer support and send important service notifications.",
    },
    {
      title: "Data Protection",
      icon: Lock,
      content:
        "We implement appropriate security measures to protect your personal information from unauthorized access, misuse or disclosure. While we strive to keep your data secure, no online platform can guarantee absolute security.",
    },
    {
      title: "Sharing Information",
      icon: ShieldCheck,
      content:
        "We never sell your personal information. Your data is only shared with vendors or customers involved in a booking and with trusted third-party services required to operate the platform.",
    },
    {
      title: "Cookies",
      icon: Database,
      content:
        "WedPlan uses cookies and similar technologies to improve user experience, remember preferences and analyze website traffic.",
    },
    {
      title: "Your Rights",
      icon: ShieldCheck,
      content:
        "You may update your profile information, request correction of inaccurate data or contact us regarding the deletion of your account where applicable.",
    },
    {
      title: "Policy Updates",
      icon: Lock,
      content:
        "This Privacy Policy may be updated periodically. Continued use of WedPlan after changes indicates acceptance of the revised policy.",
    },
    {
      title: "Contact Us",
      icon: Eye,
      content:
        "If you have questions regarding this Privacy Policy, please contact us through our Contact page or email us at hello@wedplan.com.",
    },
  ];

  return (
    <main className="bg-slate-50">
      {/* Hero */}

      <section className="bg-gradient-to-r from-rose-500 via-pink-500 to-red-500 py-24 text-white">
        <div className="mx-auto max-w-6xl px-6 text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-white/20 backdrop-blur">
            <ShieldCheck size={40} />
          </div>

          <h1 className="mt-8 text-5xl font-bold">
            Privacy Policy
          </h1>

          <p className="mx-auto mt-6 max-w-3xl text-lg text-rose-100">
            Your privacy matters to us. This Privacy Policy explains
            how WedPlan collects, uses and protects your information
            while you use our platform.
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