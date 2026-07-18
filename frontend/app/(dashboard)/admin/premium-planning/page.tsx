"use client";

import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, Crown, IndianRupee, Loader2, Send } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import {
  bookPremiumPlanningRequestApi,
  getAdminPremiumPlanningRequestsApi,
  getPremiumPlanningApprovedVendorsApi,
  PremiumPlanningVendorOption,
  PremiumPlanningRequest,
  quotePremiumPlanningRequestApi,
  reviewPremiumPlanningRequestApi,
} from "@/services/api/premium-planning.api";

type VendorOption = PremiumPlanningVendorOption;

const isApprovedVendor = (vendor: VendorOption) =>
  vendor.approvalStatus?.toLowerCase() === "approved";

export default function AdminPremiumPlanningPage() {
  const [requests, setRequests] = useState<PremiumPlanningRequest[]>([]);
  const [vendors, setVendors] = useState<VendorOption[]>([]);
  const [selected, setSelected] = useState<PremiumPlanningRequest | null>(null);
  const [assigned, setAssigned] = useState<string[]>([]);
  const [notes, setNotes] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    try {
      const [planning, vendorResult] = await Promise.all([
        getAdminPremiumPlanningRequestsApi(),
        getPremiumPlanningApprovedVendorsApi(),
      ]);
      setRequests(planning);
      setVendors(vendorResult.filter(isApprovedVendor));
      setSelected((current) => planning.find((item) => item.id === current?.id) ?? planning[0] ?? null);
    } catch {
      toast.error("Unable to load premium planning requests.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;
    Promise.all([getAdminPremiumPlanningRequestsApi(), getPremiumPlanningApprovedVendorsApi()])
      .then(([planning, vendorResult]) => {
        if (!active) return;
        setRequests(planning);
        setVendors(vendorResult.filter(isApprovedVendor));
        const first = planning[0] ?? null;
        setSelected(first);
        setAssigned(first?.assignedVendorIds ?? []);
        setNotes(first?.adminNotes ?? "");
        setAmount(first?.quotationAmount ? String(first.quotationAmount) : "");
      })
      .catch(() => toast.error("Unable to load premium planning requests."))
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const selectRequest = (request: PremiumPlanningRequest) => {
    setSelected(request);
    setAssigned(request.assignedVendorIds ?? []);
    setNotes(request.adminNotes ?? "");
    setAmount(request.quotationAmount ? String(request.quotationAmount) : "");
  };

  const counts = useMemo(() => ({
    total: requests.length,
    pending: requests.filter((item) => ["SUBMITTED", "UNDER_REVIEW"].includes(item.status)).length,
    quoted: requests.filter((item) => item.status === "QUOTED").length,
    booked: requests.filter((item) => item.status === "BOOKED").length,
  }), [requests]);

  const run = async (action: () => Promise<unknown>, message: string) => {
    setSaving(true);
    try { await action(); toast.success(message); await load(); }
    catch (error: unknown) { toast.error(axios.isAxiosError(error) ? error.response?.data?.message ?? "Unable to update request." : "Unable to update request."); }
    finally { setSaving(false); }
  };

  if (loading) return <Loader2 className="animate-spin" />;

  return (
    <div className="space-y-7">
      <section className="rounded-[2rem] bg-gradient-to-r from-[#6c2d45] to-[#d97706] p-8 text-white"><div className="flex items-center gap-4"><Crown size={42} /><div><h1 className="text-3xl font-bold">Premium Wedding Planning</h1><p className="mt-1 text-rose-50">Review preferences, assign approved vendors, send quotations, and confirm bookings.</p></div></div></section>
      <section className="grid gap-4 md:grid-cols-4">{Object.entries(counts).map(([label, value]) => <div key={label} className="rounded-2xl border border-rose-100 bg-white p-5 shadow-sm"><p className="text-sm capitalize text-slate-500">{label}</p><p className="mt-2 text-3xl font-bold text-slate-900">{value}</p></div>)}</section>
      <div className="grid gap-6 xl:grid-cols-[380px_1fr]">
        <section className="space-y-3">{requests.length === 0 ? <div className="rounded-2xl bg-white p-8 text-center text-slate-500">No premium requests yet.</div> : requests.map((request) => <button key={request.id} onClick={() => selectRequest(request)} className={`w-full rounded-2xl border bg-white p-5 text-left transition ${selected?.id === request.id ? "border-rose-500 ring-2 ring-rose-100" : "border-slate-200"}`}><div className="flex justify-between gap-3"><p className="font-bold text-slate-900">{request.user?.name}</p><span className="text-xs font-semibold text-rose-600">{request.status.replaceAll("_", " ")}</span></div><p className="mt-2 text-sm text-slate-600">{request.weddingType} · {request.city}</p><p className="mt-1 text-xs text-slate-400">{new Date(request.createdAt).toLocaleDateString("en-IN")}</p></button>)}</section>
        {selected && <section className="rounded-[2rem] border border-slate-200 bg-white p-7 text-slate-900 shadow-sm"><div className="flex flex-wrap justify-between gap-4"><div><p className="text-sm font-medium text-slate-600">Customer</p><h2 className="text-2xl font-bold text-slate-950">{selected.user?.name}</h2><p className="text-sm text-slate-600">{selected.user?.email} · {selected.user?.phone}</p></div><span className="h-fit rounded-full bg-rose-100 px-4 py-2 text-sm font-bold text-rose-700">{selected.status.replaceAll("_", " ")}</span></div>
          <div className="mt-6 grid gap-4 rounded-2xl bg-slate-50 p-5 sm:grid-cols-2 lg:grid-cols-3">{[["Wedding", selected.weddingType], ["Venue", selected.venuePreference], ["Budget", `₹${Number(selected.budget).toLocaleString("en-IN")}`], ["City", selected.city], ["Guests", selected.guestCount], ["Theme", selected.theme]].map(([label, value]) => <div key={String(label)}><p className="text-xs uppercase text-slate-400">{label}</p><p className="mt-1 font-semibold text-slate-800">{value}</p></div>)}</div>
          <div className="mt-5"><p className="text-sm font-semibold text-slate-800">Required vendors</p><div className="mt-2 flex flex-wrap gap-2">{selected.requiredVendors.map((vendor) => <span key={vendor} className="rounded-full bg-amber-50 px-3 py-1 text-sm font-medium text-amber-800">{vendor}</span>)}</div></div>
          <div className="mt-6"><p className="text-sm font-semibold text-slate-800">Assign approved vendors</p><div className="mt-3 grid gap-2 md:grid-cols-2">{vendors.map((vendor) => { const active = assigned.includes(vendor.id); return <label key={vendor.id} className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 text-slate-900 ${active ? "border-green-400 bg-green-50" : "border-slate-200 bg-white"}`}><input type="checkbox" checked={active} onChange={() => setAssigned(active ? assigned.filter((id) => id !== vendor.id) : [...assigned, vendor.id])} /><span><b className="text-slate-900">{vendor.businessName}</b><small className="block text-slate-600">{vendor.ownerName} · {vendor.category}{vendor.city ? ` · ${vendor.city}` : ""}</small></span></label>; })}</div>{vendors.length === 0 && <p className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-600">No approved vendors are available.</p>}</div>
          <label className="mt-5 block text-sm font-semibold text-slate-800">Team notes<textarea rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Add internal review notes..." className="mt-2 w-full rounded-xl border border-slate-300 bg-white p-3 font-normal text-slate-900 caret-slate-900 outline-none placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" /></label>
          <div className="mt-5 flex flex-wrap gap-3"><button disabled={saving} onClick={() => void run(() => reviewPremiumPlanningRequestApi(selected.id, { assignedVendorIds: assigned, adminNotes: notes }), "Review saved and vendors assigned.")} className="rounded-xl bg-slate-800 px-5 py-3 font-semibold text-white">Save review</button></div>
          <div className="mt-7 rounded-2xl border border-amber-200 bg-amber-50 p-5"><p className="font-bold text-amber-950">Send quotation</p><div className="mt-3 flex flex-wrap gap-3"><label className="relative flex-1"><IndianRupee className="absolute left-3 top-3 text-amber-700" size={18} /><input type="number" min="1" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Total quotation amount" className="h-11 w-full rounded-xl border border-amber-300 bg-white pl-9 pr-3 text-slate-900 caret-slate-900 outline-none placeholder:text-slate-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-100" /></label><button disabled={saving || !amount} onClick={() => void run(() => quotePremiumPlanningRequestApi(selected.id, { amount: Number(amount), adminNotes: notes }), "Quotation sent to customer.")} className="flex items-center gap-2 rounded-xl bg-amber-600 px-5 font-semibold text-white"><Send size={16} />Send</button></div></div>
          {selected.status === "ACCEPTED" && <button disabled={saving} onClick={() => void run(() => bookPremiumPlanningRequestApi(selected.id), "Wedding plan marked as booked.")} className="mt-5 flex items-center gap-2 rounded-xl bg-green-600 px-5 py-3 font-semibold text-white"><CheckCircle2 size={18} />Confirm booking</button>}
        </section>}
      </div>
    </div>
  );
}
