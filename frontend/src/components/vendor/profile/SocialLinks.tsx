"use client";

import {
  Globe,
  MapPin,
  Mail,
  Phone,
  Link2,
} from "lucide-react";

import { useVendorProfile } from "@/hooks/useVendorProfile";

export default function SocialLinks() {
  const { vendor, isLoading } = useVendorProfile();

  if (isLoading || !vendor) {
    return null;
  }

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">

      <h2 className="text-2xl font-bold text-slate-900">
        Business Contact
      </h2>

      <p className="mt-2 text-sm text-slate-500">
        Public contact information visible to customers.
      </p>

      <div className="mt-8 space-y-5">

        <Row
          icon={
            <Globe
              size={18}
              className="text-[#e4005a]"
            />
          }
          label="Business Name"
          value={vendor.businessName}
        />

        <Row
          icon={
            <MapPin
              size={18}
              className="text-red-500"
            />
          }
          label="Address"
          value={vendor.address || ""}
        />

        <Row
          icon={
            <Mail
              size={18}
              className="text-[#e4005a]"
            />
          }
          label="Email"
          value={vendor.email}
        />

        <Row
          icon={
            <Phone
              size={18}
              className="text-[#e4005a]"
            />
          }
          label="Phone"
          value={vendor.phone}
        />

        <Row
          icon={
            <Globe
              size={18}
              className="text-[#e4005a]"
            />
          }
          label="Website"
          value={vendor.website || "-"}
          isLink
        />

        <Row
          icon={
            <Link2
              size={18}
              className="text-[#e4005a]"
            />
          }
          label="Instagram"
          value={vendor.instagram || "-"}
          isLink
        />

        <Row
          icon={
            <Link2
              size={18}
              className="text-[#e4005a]"
            />
          }
          label="Facebook"
          value={vendor.facebook || "-"}
          isLink
        />

        <Row
          icon={
            <Link2
              size={18}
              className="text-[#e4005a]"
            />
          }
          label="YouTube"
          value={vendor.youtube || "-"}
          isLink
        />

        <Row
          icon={
            <Link2
              size={18}
              className="text-[#e4005a]"
            />
          }
          label="LinkedIn"
          value={vendor.linkedin || "-"}
          isLink
        />

      </div>

    </section>
  );
}

function Row({
  icon,
  label,
  value,
  isLink = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  isLink?: boolean;
}) {
  const showLink =
    isLink && value && value !== "-";

  return (
    <div className="flex items-center justify-between border-b border-slate-100 pb-4">

      <div className="flex items-center gap-3">

        {icon}

        <span className="text-slate-600">
          {label}
        </span>

      </div>

      {showLink ? (
        <a
          href={value}
          target="_blank"
          rel="noreferrer"
          className="max-w-[60%] break-words text-right font-medium text-[#e4005a] hover:underline"
        >
          {value}
        </a>
      ) : (
        <span className="max-w-[60%] break-words text-right font-medium text-slate-900">
          {value}
        </span>
      )}

    </div>
  );
}
