"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Star, MapPin, CheckCircle, Loader2, Sparkles, Building2, AlertTriangle, Check } from "lucide-react";
import { toast } from "sonner";
import { Booking } from "@/types/booking";
import { getAlternativeVendorsApi, customerSelectVendorApi } from "@/services/api/booking.api";
import { useBookingStore } from "@/store/bookingStore";
import { isSupportedImageSrc } from "@/lib/image-url";

interface AlternativeVendor {
  id: string;
  businessName: string;
  description?: string;
  profileImage?: string;
  coverImage?: string;
  badge?: string;
  city?: string;
  startingPrice?: number;
  category: string;
  rating: number;
  score: number;
  assignmentStatus?: string;
  respondedAt?: string | null;
}

export default function AlternativeVendorsCard({ booking }: { booking: Booking }) {
  const [vendors, setVendors] = useState<AlternativeVendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectingId, setSelectingId] = useState<string | null>(null);

  const loadBooking = useBookingStore((state) => state.loadBooking);

  useEffect(() => {
    async function fetchAlternatives() {
      setLoading(true);
      const res = await getAlternativeVendorsApi(booking.id);
      setLoading(false);
      if (res.ok && res.data?.success) {
        const rawList = res.data.data || [];
        const filtered = rawList.filter(
          (v: AlternativeVendor) =>
            v.id !== String(booking.vendorId) &&
            v.businessName.toLowerCase() !== (booking.vendorName || "").toLowerCase()
        );
        setVendors(filtered);
      }
    }
    fetchAlternatives();
  }, [booking.id, booking.vendorId, booking.vendorName]);

  const isPrimaryRejected =
    booking.bookingStatus === "primary_rejected" ||
    booking.bookingStatus === "rejected" ||
    booking.bookingStatus === "promote_standby" ||
    Boolean(booking.noVendorAvailable);

  const isPrimaryAccepted =
    booking.bookingStatus === "primary_accepted" ||
    booking.bookingStatus === "waiting_payment" ||
    booking.bookingStatus === "accepted" ||
    booking.bookingStatus === "advance_paid" ||
    booking.bookingStatus === "in_progress" ||
    booking.bookingStatus === "completed";

  const handleSelectVendor = async (vendor: AlternativeVendor) => {
    const confirmChoice = window.confirm(
      `Select ${vendor.businessName} as your new primary vendor for this booking?`
    );
    if (!confirmChoice) return;

    setSelectingId(vendor.id);
    const res = await customerSelectVendorApi(booking.id, vendor.id);
    setSelectingId(null);

    if (!res.ok) {
      toast.error(res.error ?? "Failed to select vendor.");
      return;
    }

    toast.success(`Booking request sent to ${vendor.businessName}!`);
    await loadBooking(booking.id);
  };

  if (loading) {
    return (
      <div className="rounded-3xl border border-rose-200 bg-rose-50/50 p-8 text-center">
        <Loader2 className="mx-auto h-8 w-8 animate-spin text-rose-500" />
        <p className="mt-3 text-sm font-medium text-rose-700">
          Fetching matching vendors for your event category & package...
        </p>
      </div>
    );
  }

  if (vendors.length === 0) {
    return null;
  }

  return (
    <section className={`rounded-3xl border p-7 shadow-sm transition ${
      isPrimaryRejected
        ? "border-amber-300 bg-gradient-to-br from-amber-50/80 via-white to-rose-50/60"
        : isPrimaryAccepted
        ? "border-emerald-200 bg-gradient-to-br from-emerald-50/70 via-white to-teal-50/50"
        : "border-rose-200 bg-gradient-to-br from-rose-50/70 via-white to-pink-50/50"
    }`}>
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            {isPrimaryRejected ? (
              <AlertTriangle className="h-6 w-6 text-amber-600 animate-bounce" />
            ) : isPrimaryAccepted ? (
              <Check className="h-6 w-6 text-emerald-600" />
            ) : (
              <Sparkles className="h-6 w-6 text-rose-500" />
            )}
            <h2 className="text-2xl font-bold text-gray-900">
              {isPrimaryRejected
                ? "Primary Vendor Unavailable — Select Alternative Vendor"
                : isPrimaryAccepted
                ? "Primary Vendor Confirmed & Broadcasted Alternatives"
                : "Request Dispatched to Matching Vendors"}
            </h2>
          </div>
          <p className="mt-1.5 text-sm text-gray-600 leading-relaxed">
            {isPrimaryRejected
              ? `Your requested vendor (${booking.vendorName}) is currently unavailable. Choose any of these ${vendors.length} matching alternative vendors to whom your request was sent:`
              : isPrimaryAccepted
              ? `Great news! ${booking.vendorName} accepted your booking. Here are other matching vendors in your category to whom the request was broadcasted:`
              : `Your request has been sent to ${booking.vendorName} (Primary) and broadcasted to ${vendors.length} alternative vendors matching your category & package:`}
          </p>
        </div>

        <span className="self-start md:self-auto inline-flex items-center gap-1.5 rounded-full bg-white px-3.5 py-1.5 text-xs font-bold text-slate-700 shadow-sm border border-slate-200">
          <Sparkles className="h-3.5 w-3.5 text-rose-500" />
          {vendors.length} Matched Vendors
        </span>
      </div>

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {vendors.map((v) => {
          const status = v.assignmentStatus || "PENDING";
          return (
            <div
              key={v.id}
              className="flex flex-col justify-between rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:border-rose-300 hover:shadow-md"
            >
              <div>
                {/* Image / Banner */}
                <div className="relative mb-4 h-36 w-full overflow-hidden rounded-xl bg-slate-100">
                  {isSupportedImageSrc(v.profileImage || v.coverImage) ? (
                    <Image
                      src={v.profileImage || v.coverImage || ""}
                      alt={v.businessName}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-gradient-to-br from-rose-100 to-pink-100 text-4xl font-bold text-rose-500">
                      {v.businessName.charAt(0).toUpperCase()}
                    </div>
                  )}
                  {v.badge && (
                    <span className="absolute right-2 top-2 rounded-full bg-black/70 px-3 py-1 text-xs font-semibold text-white uppercase tracking-wider">
                      {v.badge}
                    </span>
                  )}
                  {/* Status Badge */}
                  <span className={`absolute left-2 top-2 rounded-full px-2.5 py-1 text-[11px] font-bold shadow-sm ${
                    status === "AVAILABLE"
                      ? "bg-emerald-600 text-white"
                      : status === "NOT_AVAILABLE" || status === "REJECTED"
                      ? "bg-rose-600 text-white"
                      : "bg-amber-500 text-white"
                  }`}>
                    {status === "AVAILABLE" ? "✓ Indicated Available" : status === "NOT_AVAILABLE" ? "Unavailable" : "Request Received"}
                  </span>
                </div>

                {/* Vendor Title & Category */}
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">
                      {v.businessName}
                    </h3>
                    <p className="text-xs text-gray-500">{v.category}</p>
                  </div>
                  <div className="flex items-center gap-1 rounded-md bg-amber-50 px-2 py-1 text-xs font-bold text-amber-700">
                    <Star size={13} className="fill-amber-400 text-amber-400" />
                    {v.rating}
                  </div>
                </div>

                {/* Location & Price */}
                <div className="mt-4 space-y-2 text-xs text-gray-600">
                  {v.city && (
                    <div className="flex items-center gap-1.5">
                      <MapPin size={14} className="text-rose-500" />
                      <span>{v.city}</span>
                    </div>
                  )}
                  {v.startingPrice && (
                    <div className="flex items-center gap-1.5">
                      <Building2 size={14} className="text-rose-500" />
                      <span>Starting from ₹{v.startingPrice.toLocaleString("en-IN")}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Button */}
              {isPrimaryRejected ? (
                <button
                  onClick={() => void handleSelectVendor(v)}
                  disabled={selectingId !== null}
                  className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-rose-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-rose-600 disabled:opacity-60 shadow-sm hover:shadow"
                >
                  {selectingId === v.id ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <CheckCircle size={16} />
                  )}
                  {selectingId === v.id ? "Selecting..." : "Select This Vendor"}
                </button>
              ) : (
                <button
                  onClick={() => void handleSelectVendor(v)}
                  disabled={selectingId !== null}
                  className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-rose-300 bg-rose-50/60 px-4 py-2 text-xs font-semibold text-rose-700 transition hover:bg-rose-100 disabled:opacity-60"
                >
                  {selectingId === v.id ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <CheckCircle size={14} />
                  )}
                  {selectingId === v.id ? "Switching..." : "Switch to This Vendor"}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
