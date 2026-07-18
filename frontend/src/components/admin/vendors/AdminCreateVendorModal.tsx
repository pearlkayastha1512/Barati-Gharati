"use client";

import { useState } from "react";
import { Eye, EyeOff, Loader2, X } from "lucide-react";
import { toast } from "sonner";

import {
  createVendorByAdminApi,
  CreateVendorByAdminPayload,
} from "@/services/api/admin.api";

function makeTemporaryPassword() {
  const bytes = new Uint32Array(2);
  crypto.getRandomValues(bytes);
  return `Bg@${bytes[0].toString(36)}${bytes[1].toString(36)}`.slice(0, 14);
}

const emptyForm = (): CreateVendorByAdminPayload => ({
  ownerName: "",
  email: "",
  phone: "",
  password: makeTemporaryPassword(),
  businessName: "",
  category: "",
  city: "",
  address: "",
  description: "",
  badge: "BRONZE",
  badgeBillingCycle: "MONTHLY",
});

export default function AdminCreateVendorModal({
  open,
  onClose,
  onCreated,
}: {
  open: boolean;
  onClose: () => void;
  onCreated: () => Promise<void>;
}) {
  const [form, setForm] = useState<CreateVendorByAdminPayload>(emptyForm);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  if (!open) return null;

  const update = <K extends keyof CreateVendorByAdminPayload>(
    field: K,
    value: CreateVendorByAdminPayload[K],
  ) => setForm((current) => ({ ...current, [field]: value }));

  const submit = async () => {
    if (
      !form.ownerName.trim() ||
      !form.email.trim() ||
      !form.phone.trim() ||
      !form.businessName.trim() ||
      !form.category.trim() ||
      !form.city.trim() ||
      form.password.length < 8
    ) {
      setError("Required fields fill karein; password minimum 8 characters ka ho.");
      return;
    }
    setLoading(true);
    setError("");
    const result = await createVendorByAdminApi(form);
    if (!result.ok) {
      setError(result.error ?? "Vendor create nahi ho saka.");
      setLoading(false);
      return;
    }
    await onCreated();
    toast.success("Vendor created, verified and approved successfully.");
    setForm(emptyForm());
    setLoading(false);
    onClose();
  };

  const inputClass =
    "h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

  return (
    <div className="fixed inset-0 z-[130] flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-sm">
      <div className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-[28px] bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black text-slate-900">Register New Vendor</h2>
            <p className="mt-1 text-sm text-slate-500">
              Admin-created vendor immediately verified, approved aur active hoga.
            </p>
          </div>
          <button type="button" onClick={onClose} disabled={loading} className="rounded-full p-2 text-slate-500 hover:bg-slate-100">
            <X />
          </button>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <Field label="Owner Name"><input className={inputClass} value={form.ownerName} onChange={(e) => update("ownerName", e.target.value)} /></Field>
          <Field label="Business Name"><input className={inputClass} value={form.businessName} onChange={(e) => update("businessName", e.target.value)} /></Field>
          <Field label="Email"><input type="email" className={inputClass} value={form.email} onChange={(e) => update("email", e.target.value)} /></Field>
          <Field label="Phone"><input className={inputClass} value={form.phone} onChange={(e) => update("phone", e.target.value)} /></Field>
          <Field label="Category"><input className={inputClass} placeholder="Venue, Photography..." value={form.category} onChange={(e) => update("category", e.target.value)} /></Field>
          <Field label="City"><input className={inputClass} value={form.city} onChange={(e) => update("city", e.target.value)} /></Field>
          <Field label="Address"><input className={inputClass} value={form.address} onChange={(e) => update("address", e.target.value)} /></Field>
          <Field label="Temporary Password">
            <div className="relative">
              <input type={showPassword ? "text" : "password"} className={`${inputClass} pr-11`} value={form.password} onChange={(e) => update("password", e.target.value)} />
              <button type="button" onClick={() => setShowPassword((value) => !value)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500">
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </Field>
          <Field label="Badge">
            <select className={inputClass} value={form.badge} onChange={(e) => update("badge", e.target.value as CreateVendorByAdminPayload["badge"])}>
              <option value="BRONZE">Bronze</option><option value="SILVER">Silver</option><option value="GOLD">Gold</option>
            </select>
          </Field>
          <Field label="Plan Cycle">
            <select className={inputClass} disabled={form.badge === "BRONZE"} value={form.badgeBillingCycle} onChange={(e) => update("badgeBillingCycle", e.target.value as CreateVendorByAdminPayload["badgeBillingCycle"])}>
              <option value="MONTHLY">Monthly</option><option value="YEARLY">Yearly</option>
            </select>
          </Field>
        </div>

        <Field label="Description" className="mt-4">
          <textarea rows={4} className="w-full rounded-xl border border-slate-200 p-3 text-slate-900 outline-none focus:border-blue-500" value={form.description} onChange={(e) => update("description", e.target.value)} />
        </Field>

        <p className="mt-4 rounded-xl bg-blue-50 px-4 py-3 text-sm text-blue-800">
          Login credentials vendor ke email par automatically send honge; vendor ko temporary password change karne ko kaha jayega.
        </p>
        {error && <p className="mt-3 text-sm font-semibold text-red-600">{error}</p>}

        <div className="mt-6 flex justify-end gap-3">
          <button type="button" onClick={onClose} disabled={loading} className="rounded-xl border border-slate-200 px-5 py-2.5 font-semibold text-slate-600">Cancel</button>
          <button type="button" onClick={() => void submit()} disabled={loading} className="inline-flex items-center gap-2 rounded-xl bg-blue-700 px-6 py-2.5 font-bold text-white disabled:opacity-60">
            {loading && <Loader2 size={18} className="animate-spin" />} Create Vendor
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children, className = "" }: { label: string; children: React.ReactNode; className?: string }) {
  return <label className={`block ${className}`}><span className="mb-1.5 block text-sm font-bold text-slate-700">{label}</span>{children}</label>;
}
