"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { Check, CheckCircle2, ChevronRight, Crown, Eye, IndianRupee, Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { useAuthStore } from "@/store/authStore";
import {
  createPremiumPlanningRequestApi,
  getMyPremiumPlanningRequestsApi,
  PremiumPlanningRequest,
  respondToPremiumQuotationApi,
} from "@/services/api/premium-planning.api";

const vendorOptions = ["Venue", "Catering", "Photography", "Videography", "Decoration", "Makeup", "Mehendi", "DJ & Entertainment", "Invitations", "Transport"];
const workflow = ["Preferences", "Team review", "Vendors assigned", "Quotation", "Your response", "Booking"];

const statusStep: Record<string, number> = {
  SUBMITTED: 1,
  UNDER_REVIEW: 2,
  VENDORS_ASSIGNED: 3,
  QUOTED: 4,
  ACCEPTED: 5,
  REJECTED: 5,
  BOOKED: 6,
};

const emptyForm = {
  weddingType: "",
  venuePreference: "",
  budget: "",
  city: "",
  guestCount: "",
  theme: "",
  requiredVendors: [] as string[],
  specialRequirements: "",
};

export default function PlanMyWeddingPage() {
  const user = useAuthStore((state) => state.user);
  const [form, setForm] = useState(emptyForm);
  const [requests, setRequests] = useState<PremiumPlanningRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const isPremium = user?.membership === "PREMIUM";

  const load = async () => {
    if (!isPremium) {
      setLoading(false);
      return;
    }
    try {
      setRequests(await getMyPremiumPlanningRequestsApi());
    } catch {
      toast.error("Unable to load your premium planning requests.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isPremium) return;
    let active = true;
    getMyPremiumPlanningRequestsApi()
      .then((data) => { if (active) setRequests(data); })
      .catch(() => toast.error("Unable to load your premium planning requests."))
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [isPremium]);

  const toggleVendor = (vendor: string) => setForm((current) => ({
    ...current,
    requiredVendors: current.requiredVendors.includes(vendor)
      ? current.requiredVendors.filter((item) => item !== vendor)
      : [...current.requiredVendors, vendor],
  }));

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!form.requiredVendors.length) return toast.error("Select at least one required vendor.");
    setSubmitting(true);
    try {
      await createPremiumPlanningRequestApi({
        ...form,
        budget: Number(form.budget),
        guestCount: Number(form.guestCount),
      });
      setForm(emptyForm);
      toast.success("Your wedding preferences have been sent to our team.");
      await load();
    } catch (error: unknown) {
      toast.error(axios.isAxiosError(error) ? error.response?.data?.message ?? "Unable to submit preferences." : "Unable to submit preferences.");
    } finally {
      setSubmitting(false);
    }
  };

  const respond = async (id: string, accept: boolean) => {
    try {
      await respondToPremiumQuotationApi(id, accept);
      toast.success(accept ? "Quotation accepted." : "Quotation rejected.");
      await load();
    } catch (error: unknown) {
      toast.error(axios.isAxiosError(error) ? error.response?.data?.message ?? "Unable to update quotation." : "Unable to update quotation.");
    }
  };

  if (!isPremium) return (
    <div className="mx-auto max-w-3xl rounded-[2rem] border border-amber-200 bg-white p-10 text-center shadow-xl shadow-rose-100">
      <Crown className="mx-auto text-amber-500" size={54} />
      <h1 className="mt-5 text-3xl font-bold">Plan My Wedding is a Premium feature</h1>
      <p className="mx-auto mt-3 max-w-xl text-[#8d6171]">Premium members can submit complete wedding preferences, get vendor assignments reviewed by the Barati Gharati team, and receive one personalized quotation.</p>
      <div className="mx-auto mt-7 max-w-sm rounded-2xl bg-amber-50 p-5 text-left">
        <p className="font-bold text-amber-900">Premium · ₹4,999 one-time</p>
        <p className="mt-2 text-sm text-amber-800">Membership upgrade for existing accounts will be available from account settings.</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      <section className="overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#6c2d45] via-[#a63d61] to-[#f59e0b] p-8 text-white shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-5">
          <div><span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-sm"><Crown size={15} /> Premium concierge</span><h1 className="mt-4 text-4xl font-bold">Plan My Wedding</h1><p className="mt-2 max-w-2xl text-rose-50">Tell us your vision. Our team will review it, match approved vendors, and prepare a personalized quotation.</p></div>
          <Sparkles size={64} className="text-amber-200" />
        </div>
      </section>

      <section className="grid gap-2 rounded-3xl border border-rose-100 bg-white p-5 md:grid-cols-6">
        {workflow.map((label, index) => <div key={label} className="flex items-center gap-2 text-sm font-medium text-[#6c2d45]"><span className="flex h-7 w-7 items-center justify-center rounded-full bg-rose-100">{index + 1}</span>{label}{index < workflow.length - 1 && <ChevronRight className="ml-auto hidden text-rose-300 md:block" size={16} />}</div>)}
      </section>

      <form onSubmit={submit} className="rounded-[2rem] border border-rose-100 bg-white p-7 shadow-lg shadow-rose-100/60">
        <h2 className="text-2xl font-bold">Fill your preferences</h2>
        <div className="mt-6 grid gap-5 md:grid-cols-2">
          {[
            ["Wedding type", "weddingType", "Traditional, destination, intimate..."],
            ["Venue preference", "venuePreference", "Palace, resort, banquet, lawn..."],
            ["City", "city", "Wedding city"],
            ["Theme", "theme", "Royal, modern, floral..."],
          ].map(([label, key, placeholder]) => <label key={key} className="space-y-2 text-sm font-semibold">{label}<input required value={form[key as keyof typeof form] as string} onChange={(e) => setForm({ ...form, [key]: e.target.value })} placeholder={placeholder} className="h-12 w-full rounded-xl border border-rose-200 px-4 font-normal outline-none focus:border-rose-500" /></label>)}
          <label className="space-y-2 text-sm font-semibold">Budget (₹)<input required min="1" type="number" value={form.budget} onChange={(e) => setForm({ ...form, budget: e.target.value })} className="h-12 w-full rounded-xl border border-rose-200 px-4 font-normal outline-none focus:border-rose-500" /></label>
          <label className="space-y-2 text-sm font-semibold">Guest count<input required min="1" type="number" value={form.guestCount} onChange={(e) => setForm({ ...form, guestCount: e.target.value })} className="h-12 w-full rounded-xl border border-rose-200 px-4 font-normal outline-none focus:border-rose-500" /></label>
        </div>
        <div className="mt-6"><p className="text-sm font-semibold">Required vendors</p><div className="mt-3 flex flex-wrap gap-2">{vendorOptions.map((vendor) => { const active = form.requiredVendors.includes(vendor); return <button type="button" key={vendor} onClick={() => toggleVendor(vendor)} className={`rounded-full border px-4 py-2 text-sm transition ${active ? "border-rose-500 bg-rose-500 text-white" : "border-rose-200 text-[#6c2d45]"}`}>{active && <Check className="mr-1 inline" size={14} />}{vendor}</button>; })}</div></div>
        <label className="mt-6 block space-y-2 text-sm font-semibold">Special requirements<textarea value={form.specialRequirements} onChange={(e) => setForm({ ...form, specialRequirements: e.target.value })} rows={4} placeholder="Accessibility, rituals, dietary preferences, special events..." className="w-full rounded-xl border border-rose-200 p-4 font-normal outline-none focus:border-rose-500" /></label>
        <button disabled={submitting} className="mt-6 flex h-12 items-center justify-center gap-2 rounded-xl bg-rose-500 px-7 font-semibold text-white disabled:opacity-60">{submitting && <Loader2 className="animate-spin" size={18} />}Submit to planning team</button>
      </form>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Your planning requests</h2>
        {loading ? (
          <Loader2 className="animate-spin" />
        ) : requests.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-rose-200 bg-white p-8 text-center text-[#8d6171]">
            No preferences submitted yet.
          </div>
        ) : requests.map((request) => (
          <article key={request.id} className="rounded-3xl border border-rose-100 bg-white p-6 text-slate-900 shadow-sm">
            <div className="flex flex-wrap justify-between gap-4">
              <div>
                <p className="text-sm text-[#8d6171]">{new Date(request.createdAt).toLocaleDateString("en-IN")}</p>
                <h3 className="mt-1 text-xl font-bold">{request.weddingType} · {request.city}</h3>
                <p className="mt-2 text-sm text-[#8d6171]">{request.guestCount} guests · {request.theme}</p>
              </div>
              <span className="h-fit rounded-full bg-rose-100 px-4 py-2 text-sm font-bold text-rose-700">
                {request.status.replaceAll("_", " ")}
              </span>
            </div>

            <div className="mt-5 grid gap-2 md:grid-cols-6">
              {workflow.map((label, index) => {
                const complete = index < statusStep[request.status];
                return <div key={label} className={`rounded-xl p-3 text-xs font-semibold ${complete ? "bg-green-50 text-green-700" : "bg-gray-50 text-gray-400"}`}>{complete && <Check className="mr-1 inline" size={13} />}{label}</div>;
              })}
            </div>

            {request.assignedVendors && request.assignedVendors.length > 0 && (
              <div className="mt-5 rounded-2xl border border-green-100 bg-green-50/60 p-5">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-bold text-green-950">Vendors assigned by our team</p>
                    <p className="mt-1 text-sm text-green-800">These approved vendors have been shortlisted for your wedding.</p>
                  </div>
                  <CheckCircle2 className="text-green-600" size={24} />
                </div>
                <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {request.assignedVendors.map((vendor) => (
                    <div key={vendor.id} className="rounded-xl border border-green-100 bg-white p-4 shadow-sm">
                      <div className="flex items-center gap-3">
                      <div
                        className="h-12 w-12 shrink-0 rounded-xl bg-gradient-to-br from-rose-100 to-amber-100 bg-cover bg-center text-center font-bold leading-[3rem] text-rose-700"
                        style={vendor.logoUrl ? { backgroundImage: `url(${vendor.logoUrl})` } : undefined}
                      >
                        {!vendor.logoUrl && vendor.businessName.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate font-bold text-slate-900">{vendor.businessName}</p>
                        <p className="truncate text-sm text-slate-600">{vendor.category || "Wedding vendor"}</p>
                        {vendor.city && <p className="truncate text-xs text-slate-500">{vendor.city}</p>}
                      </div>
                      </div>
                      {vendor.profileId != null && (
                        <Link
                          href={`/vendors/${vendor.profileId}`}
                          className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm font-semibold text-green-800 transition hover:border-green-300 hover:bg-green-100"
                        >
                          <Eye size={16} />
                          View Profile & Work
                        </Link>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {request.quotationAmount && (
              <div className="mt-5 rounded-2xl bg-amber-50 p-5">
                <p className="text-sm font-semibold text-amber-800">Personalized quotation</p>
                <p className="mt-1 flex items-center text-3xl font-bold text-amber-950"><IndianRupee size={25} />{Number(request.quotationAmount).toLocaleString("en-IN")}</p>
                {request.status === "QUOTED" && (
                  <div className="mt-4 flex gap-3">
                    <button onClick={() => void respond(request.id, true)} className="rounded-xl bg-green-600 px-5 py-2 font-semibold text-white">Accept</button>
                    <button onClick={() => void respond(request.id, false)} className="rounded-xl border border-red-200 px-5 py-2 font-semibold text-red-600">Reject</button>
                  </div>
                )}
              </div>
            )}
          </article>
        ))}
      </section>
    </div>
  );
}
