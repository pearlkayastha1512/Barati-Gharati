

"use client";

import Link from "next/link";
import { CheckCircle2, ArrowRight } from "lucide-react";

import { useVendorRegistrationStore } from "@/store/vendorRegistrationStore";

export default function SuccessStep() {
  const { resetForm } = useVendorRegistrationStore();

  return (
    <div className="mx-auto max-w-3xl py-20 text-center">
      <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-green-100">
        <CheckCircle2
          size={52}
          className="text-green-600"
        />
      </div>

      <h2 className="mt-8 text-4xl font-bold text-slate-900">
        Registration Submitted!
      </h2>

      <p className="mt-4 text-lg leading-8 text-slate-500">
        Thank you for registering as a vendor on{" "}
        <span className="font-semibold text-slate-700">
          Wedding Planner
        </span>
        .
        <br />
        Your application has been submitted successfully and is currently
        <span className="font-semibold text-amber-600">
          {" "}under review.
        </span>
        <br />
        Once approved, you can log in and start managing your business,
        bookings, and customers.
      </p>

      <Link
        href="/"
        onClick={resetForm}
        className="mt-10 inline-flex items-center gap-3 rounded-2xl bg-blue-600 px-8 py-4 font-semibold text-white transition hover:bg-blue-700"
      >
        Go to Login

        <ArrowRight size={20} />
      </Link>
    </div>
  );
}