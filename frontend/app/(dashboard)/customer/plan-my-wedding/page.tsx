"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { Check, CheckCircle2, ChevronRight, Crown, Eye, IndianRupee, Loader2, Sparkles, CreditCard } from "lucide-react";

import { toast } from "sonner";
import axios from "axios";
import { useAuthStore } from "@/store/authStore";
import {
  createPremiumPlanningRequestApi,
  getMyPremiumPlanningRequestsApi,
  PremiumPlanningRequest,
  respondToPremiumQuotationApi,
  createPremiumAdvanceOrderApi,
  verifyPremiumAdvancePaymentApi,
} from "@/services/api/premium-planning.api";

type RazorpayResponse = {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
};

type RazorpayOptions = {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  prefill?: { name?: string; email?: string; contact?: string };
  theme?: { color?: string };
  modal?: { ondismiss?: () => void };
  handler: (response: RazorpayResponse) => void;
};

declare global {
  interface Window {
    Razorpay?: new (options: RazorpayOptions) => { open: () => void };
  }
}

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}


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
  const [payingAdvanceId, setPayingAdvanceId] = useState<string | null>(null);
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

  const handlePayAdvance = async (id: string) => {
    setPayingAdvanceId(id);
    try {
      const orderResult = await createPremiumAdvanceOrderApi(id);
      if (!orderResult.ok || !orderResult.data) {
        toast.error("Unable to prepare payment order.");
        setPayingAdvanceId(null);
        return;
      }

      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded || !window.Razorpay) {
        toast.error("Payment gateway could not be loaded.");
        setPayingAdvanceId(null);
        return;
      }

      const order = orderResult.data;
      const razorpay = new window.Razorpay({
        key: order.keyId,
        amount: order.amountInPaise,
        currency: order.currency,
        name: "Barati Gharati",
        description: `${order.advancePercentage}% advance for Premium Wedding Plan`,
        order_id: order.orderId,
        prefill: {
          name: user?.name ?? "",
          email: user?.email ?? "",
        },
        theme: { color: "#e4005a" },
        modal: {
          ondismiss: () => setPayingAdvanceId(null),
        },
        handler: async (response) => {
          try {
            await verifyPremiumAdvancePaymentApi({
              planningRequestId: id,
              orderId: response.razorpay_order_id,
              paymentId: response.razorpay_payment_id,
              signature: response.razorpay_signature,
            });
            toast.success("🎉 Payment successful! Your wedding plan is booked & vendors confirmed!");
            await load();
          } catch (err: unknown) {
            toast.error(axios.isAxiosError(err) ? err.response?.data?.message ?? "Payment verification failed." : "Payment verification failed.");
          } finally {
            setPayingAdvanceId(null);
          }
        },
      });

      razorpay.open();
    } catch (error: unknown) {
      toast.error(axios.isAxiosError(error) ? error.response?.data?.message ?? "Failed to initiate payment." : "Failed to initiate payment.");
      setPayingAdvanceId(null);
    }
  };


  if (!isPremium) return (
    <div className="mx-auto max-w-3xl rounded-[2rem] border border-amber-200 bg-white p-10 text-center shadow-xl shadow-rose-100">
      <Crown className="mx-auto text-amber-500" size={54} />
      <h1 className="mt-5 text-3xl font-bold">Plan My Wedding is a Premium feature</h1>
      <p className="mx-auto mt-3 max-w-xl text-[#8d6171]">Premium members can submit complete wedding preferences, get vendor assignments reviewed by the Barati Gharati team, and receive one personalized quotation.</p>
      <div className="mx-auto mt-7 max-w-sm rounded-2xl bg-amber-50 p-5 text-center">
        <p className="font-bold text-amber-900">Premium · ₹4,999 one-time</p>
        <p className="mt-2 text-sm text-amber-800">Upgrade your account anytime from Account Settings.</p>
        <Link href="/customer/settings" className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#ff4d6d] px-5 py-2.5 text-sm font-bold text-white shadow-md hover:bg-[#e63b5f] transition-all">
          <Sparkles size={16} /> Upgrade in Settings
        </Link>
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
              <div className="mt-5 rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50/80 via-orange-50/50 to-amber-50/80 p-6 shadow-sm space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-amber-200/60 pb-4">
                  <div>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-900 uppercase tracking-wider">
                      ✨ Official Wedding Quotation
                    </span>
                    <h4 className="mt-2 text-3xl font-extrabold text-amber-950 flex items-center">
                      <IndianRupee size={26} />
                      {Number(request.quotationAmount).toLocaleString("en-IN")}
                    </h4>
                  </div>

                  {(() => {
                    const details = (request.quotationDetails ?? {}) as Record<string, any>;
                    const advancePct = details.advancePercentage ?? 50;
                    const advanceAmt = details.advanceAmount ?? Math.round((Number(request.quotationAmount) * advancePct) / 100);
                    return (
                      <div className="rounded-xl bg-white border border-amber-200 p-3.5 text-right shadow-xs">
                        <p className="text-xs font-semibold text-amber-800">Advance Due to Confirm ({advancePct}%):</p>
                        <p className="text-xl font-black text-amber-950 mt-0.5">
                          ₹{Number(advanceAmt).toLocaleString("en-IN")}
                        </p>
                      </div>
                    );
                  })()}
                </div>

                {/* Vendor Breakdown Table if available */}
                {(() => {
                  const details = (request.quotationDetails ?? {}) as Record<string, any>;
                  const breakdown = (details.vendorBreakdown as Array<{ vendorName: string; category: string; cost: number }>) || [];
                  if (breakdown.length === 0) return null;
                  return (
                    <div className="space-y-2">
                      <p className="text-xs font-bold uppercase tracking-wider text-amber-950">Itemized Cost Breakdown</p>
                      <div className="divide-y divide-amber-200/60 rounded-xl border border-amber-200 bg-white overflow-hidden text-sm">
                        {breakdown.map((item, idx) => (
                          <div key={idx} className="flex items-center justify-between p-3">
                            <div>
                              <span className="font-bold text-slate-900">{item.vendorName}</span>
                              <span className="ml-2 text-xs font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md">{item.category}</span>
                            </div>
                            <span className="font-extrabold text-slate-900">₹{Number(item.cost).toLocaleString("en-IN")}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })()}

                {/* Inclusions */}
                {(() => {
                  const details = (request.quotationDetails ?? {}) as Record<string, any>;
                  const inclusionsText = details.inclusions as string | undefined;
                  if (!inclusionsText) return null;
                  return (
                    <div className="rounded-xl bg-white/80 p-4 border border-amber-200 text-sm">
                      <p className="text-xs font-bold uppercase tracking-wider text-amber-950 mb-1">Included Package Services & Terms</p>
                      <p className="text-slate-700 font-medium whitespace-pre-line">{inclusionsText}</p>
                    </div>
                  );
                })()}

                {request.status === "QUOTED" && (
                  <div className="mt-4 flex flex-wrap items-center gap-3 pt-2">
                    <button
                      onClick={() => void respond(request.id, true)}
                      className="rounded-xl bg-green-600 px-7 py-3 font-extrabold text-white transition hover:bg-green-700 shadow-md"
                    >
                      Accept Quotation & Proceed
                    </button>
                    <button
                      onClick={() => void respond(request.id, false)}
                      className="rounded-xl border border-red-200 bg-white px-5 py-3 font-bold text-red-600 transition hover:bg-red-50"
                    >
                      Reject Quotation
                    </button>
                  </div>
                )}

                {request.status === "ACCEPTED" && (
                  <div className="mt-4 rounded-xl bg-emerald-100/80 p-5 border border-emerald-300 space-y-3">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="text-emerald-700" size={22} />
                      <p className="font-extrabold text-emerald-950 text-base">Quotation Accepted!</p>
                    </div>
                    <p className="text-sm text-emerald-900 font-medium">
                      Pay the advance to lock in your assigned vendors and confirm your booking.
                    </p>
                    {(() => {
                      const details = (request.quotationDetails ?? {}) as Record<string, any>;
                      const advancePct = details.advancePercentage ?? 50;
                      const advanceAmt = details.advanceAmount ?? Math.round((Number(request.quotationAmount) * advancePct) / 100);
                      return (
                        <button
                          disabled={payingAdvanceId === request.id}
                          onClick={() => void handlePayAdvance(request.id)}
                          className="mt-2 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-7 py-3.5 font-extrabold text-white transition hover:bg-emerald-700 shadow-md disabled:opacity-60"
                        >
                          {payingAdvanceId === request.id ? (
                            <Loader2 className="animate-spin" size={18} />
                          ) : (
                            <CreditCard size={18} />
                          )}
                          Pay Advance (₹{Number(advanceAmt).toLocaleString("en-IN")}) & Confirm Booking
                        </button>
                      );
                    })()}
                  </div>
                )}

                {request.status === "BOOKED" && (
                  <div className="mt-4 rounded-xl bg-emerald-50 p-5 border border-emerald-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="text-emerald-600" size={24} />
                        <div>
                          <p className="font-extrabold text-emerald-950 text-base">🎉 Booking Fully Confirmed!</p>
                          <p className="text-xs text-emerald-800 font-medium">Your advance payment has been received and individual vendor bookings are active.</p>
                        </div>
                      </div>
                    </div>
                    <Link
                      href="/customer/bookings"
                      className="mt-2 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-700"
                    >
                      View Your Bookings Dashboard →
                    </Link>
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
