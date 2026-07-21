"use client";

import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, Crown, IndianRupee, Loader2, Send, Plus, Trash2, Calendar, Percent, Sparkles } from "lucide-react";
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
import StatusBadge from "@/components/ui/StatusBadge";

type VendorOption = PremiumPlanningVendorOption;

const isApprovedVendor = (vendor: VendorOption) =>
  vendor.approvalStatus?.toLowerCase() === "approved";

interface VendorCostItem {
  vendorId?: string;
  vendorName: string;
  category: string;
  cost: number;
  notes?: string;
}

export default function AdminPremiumPlanningPage() {
  const [requests, setRequests] = useState<PremiumPlanningRequest[]>([]);
  const [vendors, setVendors] = useState<VendorOption[]>([]);
  const [selected, setSelected] = useState<PremiumPlanningRequest | null>(null);
  const [assigned, setAssigned] = useState<string[]>([]);
  const [notes, setNotes] = useState("");
  const [amount, setAmount] = useState("");
  const [advancePercentage, setAdvancePercentage] = useState("50");
  const [validityDays, setValidityDays] = useState("7");
  const [inclusions, setInclusions] = useState("");
  const [vendorCosts, setVendorCosts] = useState<Record<string, number>>({});
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
        if (first) populateForm(first);
      })
      .catch(() => toast.error("Unable to load premium planning requests."))
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const populateForm = (request: PremiumPlanningRequest) => {
    setSelected(request);
    setAssigned(request.assignedVendorIds ?? []);
    setNotes(request.adminNotes ?? "");
    setAmount(request.quotationAmount ? String(request.quotationAmount) : "");

    const details = (request.quotationDetails ?? {}) as Record<string, any>;
    setAdvancePercentage(details.advancePercentage ? String(details.advancePercentage) : "50");
    setValidityDays(details.validityDays ? String(details.validityDays) : "7");
    setInclusions(details.inclusions ? String(details.inclusions) : "");

    const breakdown = (details.vendorBreakdown as VendorCostItem[]) || [];
    const costMap: Record<string, number> = {};
    breakdown.forEach((item) => {
      if (item.vendorId) costMap[item.vendorId] = item.cost;
    });
    setVendorCosts(costMap);
  };

  const selectRequest = (request: PremiumPlanningRequest) => {
    populateForm(request);
  };

  const counts = useMemo(() => ({
    total: requests.length,
    pending: requests.filter((item) => ["SUBMITTED", "UNDER_REVIEW"].includes(item.status)).length,
    quoted: requests.filter((item) => item.status === "QUOTED").length,
    booked: requests.filter((item) => item.status === "BOOKED").length,
  }), [requests]);

  const assignedVendorsList = useMemo(() => {
    return vendors.filter((v) => assigned.includes(v.id));
  }, [vendors, assigned]);

  const calculatedTotalFromVendors = useMemo(() => {
    return assignedVendorsList.reduce((sum, v) => sum + (vendorCosts[v.id] || 0), 0);
  }, [assignedVendorsList, vendorCosts]);

  const handleVendorCostChange = (vendorId: string, val: string) => {
    const num = Number(val) || 0;
    const newCosts = { ...vendorCosts, [vendorId]: num };
    setVendorCosts(newCosts);
    const sum = assignedVendorsList.reduce((acc, v) => acc + (v.id === vendorId ? num : (newCosts[v.id] || 0)), 0);
    if (sum > 0) {
      setAmount(String(sum));
    }
  };

  const run = async (action: () => Promise<unknown>, message: string) => {
    setSaving(true);
    try {
      await action();
      toast.success(message);
      await load();
    } catch (error: unknown) {
      toast.error(axios.isAxiosError(error) ? error.response?.data?.message ?? "Unable to update request." : "Unable to update request.");
    } finally {
      setSaving(false);
    }
  };

  const handleSendQuotation = () => {
    const total = Number(amount);
    if (!total || total <= 0) return toast.error("Please enter a valid total quotation amount.");

    const breakdown: VendorCostItem[] = assignedVendorsList.map((v) => ({
      vendorId: v.id,
      vendorName: v.businessName,
      category: v.category,
      cost: vendorCosts[v.id] || 0,
    }));

    void run(
      () =>
        quotePremiumPlanningRequestApi(selected!.id, {
          amount: total,
          advancePercentage: Number(advancePercentage) || 50,
          validityDays: Number(validityDays) || 7,
          inclusions,
          vendorBreakdown: breakdown,
          adminNotes: notes,
        }),
      "Detailed quotation sent to customer!"
    );
  };

  if (loading) return <Loader2 className="mx-auto mt-20 animate-spin text-rose-500" size={32} />;

  return (
    <div className="space-y-7">
      <section className="rounded-[2rem] bg-gradient-to-r from-[#6c2d45] via-[#a63d61] to-[#d97706] p-8 text-white shadow-lg">
        <div className="flex items-center gap-4">
          <Crown size={42} className="text-amber-200" />
          <div>
            <h1 className="text-3xl font-bold">Premium Wedding Concierge</h1>
            <p className="mt-1 text-rose-50">
              Review preferences, assign top approved vendors, generate itemized quotations, and finalize bookings.
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-4">
        {Object.entries(counts).map(([label, value]) => (
          <div key={label} className="rounded-2xl border border-rose-100 bg-white p-5 shadow-xs">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{label}</p>
            <p className="mt-2 text-3xl font-extrabold text-slate-900">{value}</p>
          </div>
        ))}
      </section>

      <div className="grid gap-6 xl:grid-cols-[380px_1fr]">
        {/* Left List */}
        <section className="space-y-3">
          {requests.length === 0 ? (
            <div className="rounded-2xl bg-white p-8 text-center text-slate-500">No premium requests yet.</div>
          ) : (
            requests.map((request) => (
              <button
                key={request.id}
                onClick={() => selectRequest(request)}
                className={`w-full rounded-2xl border bg-white p-5 text-left transition ${
                  selected?.id === request.id ? "border-rose-500 ring-2 ring-rose-100 shadow-md" : "border-slate-200 hover:border-slate-300"
                }`}
              >
                <div className="flex justify-between gap-3 items-center">
                  <p className="font-bold text-slate-900 text-base">{request.user?.name}</p>
                  <StatusBadge status={request.status} size="sm" />
                </div>
                <p className="mt-2 text-sm text-slate-600 font-medium">{request.weddingType} · {request.city}</p>
                <p className="mt-1 text-xs text-slate-400">Submitted: {new Date(request.createdAt).toLocaleDateString("en-IN")}</p>
              </button>
            ))
          )}
        </section>

        {/* Right Details Panel */}
        {selected && (
          <section className="rounded-[2rem] border border-slate-200 bg-white p-7 text-slate-900 shadow-sm space-y-7">
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Customer Details</p>
                <h2 className="text-2xl font-extrabold text-slate-950">{selected.user?.name}</h2>
                <p className="text-sm text-slate-600">{selected.user?.email} · {selected.user?.phone}</p>
              </div>
              <StatusBadge status={selected.status} size="md" />
            </div>

            {/* Request Overview */}
            <div className="grid gap-4 rounded-2xl bg-slate-50 p-5 sm:grid-cols-2 lg:grid-cols-3">
              {[
                ["Wedding Type", selected.weddingType],
                ["Venue Preference", selected.venuePreference],
                ["Customer Budget", `₹${Number(selected.budget).toLocaleString("en-IN")}`],
                ["City", selected.city],
                ["Guest Count", selected.guestCount],
                ["Theme", selected.theme],
              ].map(([label, value]) => (
                <div key={String(label)}>
                  <p className="text-xs uppercase font-semibold text-slate-400">{label}</p>
                  <p className="mt-1 font-bold text-slate-900">{value}</p>
                </div>
              ))}
            </div>

            {/* Required Categories */}
            <div>
              <p className="text-sm font-bold text-slate-900">Requested Vendor Categories</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {selected.requiredVendors.map((vendor) => (
                  <span key={vendor} className="rounded-full bg-amber-50 border border-amber-200 px-3.5 py-1 text-xs font-bold text-amber-900">
                    {vendor}
                  </span>
                ))}
              </div>
            </div>

            {/* STEP 1: Assign Approved Vendors & Review Notes */}
            <div className="rounded-2xl border border-indigo-100 bg-indigo-50/40 p-6 space-y-4">
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white">1</span>
                <h3 className="text-lg font-bold text-indigo-950">Step 1: Assign Approved Vendors & Save Review</h3>
              </div>

              <div className="grid gap-2.5 md:grid-cols-2">
                {vendors.map((vendor) => {
                  const active = assigned.includes(vendor.id);
                  return (
                    <label
                      key={vendor.id}
                      className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3.5 transition ${
                        active ? "border-indigo-500 bg-white ring-2 ring-indigo-100 shadow-xs" : "border-slate-200 bg-white/80 hover:bg-white"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={active}
                        onChange={() =>
                          setAssigned(active ? assigned.filter((id) => id !== vendor.id) : [...assigned, vendor.id])
                        }
                        className="h-4 w-4 rounded-md border-slate-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span>
                        <b className="text-slate-900 block text-sm font-bold">{vendor.businessName}</b>
                        <small className="text-slate-500 text-xs">
                          {vendor.ownerName} · <span className="font-semibold text-indigo-700">{vendor.category}</span> {vendor.city ? `· ${vendor.city}` : ""}
                        </small>
                      </span>
                    </label>
                  );
                })}
              </div>

              <label className="block text-sm font-bold text-indigo-950">
                Planner Notes / Feasibility Review
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Notes for the customer regarding venue availability, theme coordination, team selection..."
                  className="mt-2 w-full rounded-xl border border-indigo-200 bg-white p-3.5 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </label>

              <button
                disabled={saving}
                onClick={() =>
                  void run(
                    () => reviewPremiumPlanningRequestApi(selected.id, { assignedVendorIds: assigned, adminNotes: notes }),
                    "Review saved & vendor team assigned to customer!"
                  )
                }
                className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 font-bold text-white transition hover:bg-indigo-700 disabled:opacity-60"
              >
                {saving && <Loader2 size={16} className="animate-spin" />}
                Save Review & Assign Vendors
              </button>
            </div>

            {/* STEP 2: Detailed Itemized Quotation Box */}
            <div className="rounded-2xl border border-amber-200 bg-amber-50/60 p-6 space-y-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-600 text-xs font-bold text-white">2</span>
                  <h3 className="text-lg font-bold text-amber-950">Step 2: Generate & Send Detailed Quotation</h3>
                </div>
                <Sparkles className="text-amber-500" size={20} />
              </div>

              {/* Main Total & Advance Inputs */}
              <div className="grid gap-4 sm:grid-cols-3">
                <label className="space-y-1.5 text-xs font-bold text-amber-950">
                  Total Quotation Amount (₹)
                  <div className="relative">
                    <IndianRupee className="absolute left-3 top-3 text-amber-700" size={16} />
                    <input
                      type="number"
                      min="1"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="Total Quote"
                      className="h-11 w-full rounded-xl border border-amber-300 bg-white pl-9 pr-3 font-bold text-slate-900 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
                    />
                  </div>
                </label>

                <label className="space-y-1.5 text-xs font-bold text-amber-950">
                  Advance Due (%)
                  <div className="relative">
                    <Percent className="absolute left-3 top-3 text-amber-700" size={16} />
                    <input
                      type="number"
                      min="10"
                      max="100"
                      value={advancePercentage}
                      onChange={(e) => setAdvancePercentage(e.target.value)}
                      className="h-11 w-full rounded-xl border border-amber-300 bg-white pl-9 pr-3 font-bold text-slate-900 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
                    />
                  </div>
                </label>

                <label className="space-y-1.5 text-xs font-bold text-amber-950">
                  Quote Expiry (Days)
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 text-amber-700" size={16} />
                    <input
                      type="number"
                      min="1"
                      max="30"
                      value={validityDays}
                      onChange={(e) => setValidityDays(e.target.value)}
                      className="h-11 w-full rounded-xl border border-amber-300 bg-white pl-9 pr-3 font-bold text-slate-900 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
                    />
                  </div>
                </label>
              </div>

              {/* Advance Amount Calculation Preview */}
              {Number(amount) > 0 && (
                <div className="flex items-center justify-between rounded-xl bg-white p-3.5 border border-amber-200 text-sm">
                  <span className="text-amber-900 font-medium">Customer Advance Due ({advancePercentage}%):</span>
                  <span className="font-extrabold text-amber-900 text-base">
                    ₹{Math.round((Number(amount) * (Number(advancePercentage) || 50)) / 100).toLocaleString("en-IN")}
                  </span>
                </div>
              )}

              {/* Itemized Vendor Costs Table */}
              {assignedVendorsList.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-bold uppercase tracking-wider text-amber-950">Itemized Vendor Cost Breakdown</p>
                  <div className="divide-y divide-amber-200/60 rounded-xl border border-amber-200 bg-white">
                    {assignedVendorsList.map((vendor) => (
                      <div key={vendor.id} className="flex flex-wrap items-center justify-between gap-3 p-3 text-sm">
                        <div>
                          <p className="font-bold text-slate-900">{vendor.businessName}</p>
                          <p className="text-xs text-slate-500">{vendor.category}</p>
                        </div>
                        <div className="relative w-36">
                          <IndianRupee className="absolute left-2.5 top-2.5 text-slate-400" size={14} />
                          <input
                            type="number"
                            min="0"
                            placeholder="Vendor Cost"
                            value={vendorCosts[vendor.id] || ""}
                            onChange={(e) => handleVendorCostChange(vendor.id, e.target.value)}
                            className="h-9 w-full rounded-lg border border-slate-200 pl-7 pr-2 text-xs font-semibold text-slate-900 outline-none focus:border-amber-500"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Package Inclusions & Terms */}
              <label className="block text-xs font-bold uppercase tracking-wider text-amber-950">
                Package Inclusions & Terms
                <textarea
                  rows={3}
                  value={inclusions}
                  onChange={(e) => setInclusions(e.target.value)}
                  placeholder="e.g. Complimentary pre-wedding shoot, 5-star buffet catering, 2-day outdoor lawn access, stage floral mandap setup..."
                  className="mt-1.5 w-full rounded-xl border border-amber-300 bg-white p-3 text-sm text-slate-900 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
                />
              </label>

              {/* Send Quotation Button */}
              <button
                disabled={saving || !amount || Number(amount) <= 0}
                onClick={handleSendQuotation}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-amber-600 px-6 py-3.5 font-extrabold text-white transition hover:bg-amber-700 disabled:opacity-60 shadow-md"
              >
                {saving ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
                Send Detailed Quotation to Customer
              </button>
            </div>

            {/* Confirm Final Booking (if accepted) */}
            {selected.status === "ACCEPTED" && (
              <button
                disabled={saving}
                onClick={() => void run(() => bookPremiumPlanningRequestApi(selected.id), "Wedding plan marked as booked!")}
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-green-600 px-6 py-3.5 font-extrabold text-white transition hover:bg-green-700 disabled:opacity-60"
              >
                <CheckCircle2 size={20} />
                Confirm & Mark Wedding Plan as Booked
              </button>
            )}
          </section>
        )}
      </div>
    </div>
  );
}
