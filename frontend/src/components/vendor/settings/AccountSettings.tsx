"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import { useVendorProfile } from "@/hooks/useVendorProfile";
import { updateVendor } from "@/services/vendor.service";

export default function AccountSettings() {
  const {
    vendor,
    setVendor,
    isLoading,
  } = useVendorProfile();

  const [businessName, setBusinessName] =
    useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] =
    useState(false);

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (!vendor) {
      return;
    }

    setBusinessName(vendor.businessName);
    setEmail(vendor.email);
    setPhone(vendor.phone);
  }, [vendor]);
  /* eslint-enable react-hooks/set-state-in-effect */

  if (isLoading || !vendor) {
    return null;
  }

  const handleSave = async () => {
    if (
      !businessName.trim() ||
      !email.trim() ||
      !phone.trim()
    ) {
      toast.error(
        "Please fill all account fields."
      );
      return;
    }

    setLoading(true);

    const updatedVendor =
      await updateVendor({
        ...vendor,
        businessName: businessName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        updatedAt: new Date().toISOString(),
      });

    setLoading(false);

    if (!updatedVendor) {
      toast.error(
        "Unable to update account settings."
      );
      return;
    }

    setVendor(updatedVendor);
    window.dispatchEvent(
      new Event("vendor-profile-updated")
    );
    toast.success(
      "Account settings updated successfully."
    );
  };

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
      <h2 className="text-2xl font-bold text-gray-800">
        Account
      </h2>

      <div className="mt-8 space-y-4">
        <input
          type="text"
          placeholder="Business Name"
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-gray-700 outline-none transition focus:border-[#e4005a] focus:ring-2 focus:ring-[#ffe1ec]"
          value={businessName}
          onChange={(event) =>
            setBusinessName(
              event.target.value
            )
          }
        />

        <input
          type="email"
          placeholder="Email"
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-gray-700 outline-none transition focus:border-[#e4005a] focus:ring-2 focus:ring-[#ffe1ec]"
          value={email}
          onChange={(event) =>
            setEmail(event.target.value)
          }
        />

        <input
          type="tel"
          placeholder="Phone Number"
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-gray-700 outline-none transition focus:border-[#e4005a] focus:ring-2 focus:ring-[#ffe1ec]"
          value={phone}
          onChange={(event) =>
            setPhone(event.target.value)
          }
        />

        <button
          onClick={handleSave}
          disabled={loading}
          className="w-full rounded-2xl bg-[#e4005a] py-3 font-semibold text-white transition hover:bg-[#c8004e] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading
            ? "Saving..."
            : "Save Account"}
        </button>
      </div>
    </section>
  );
}
