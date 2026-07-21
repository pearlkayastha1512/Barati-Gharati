"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Star, MapPin, CheckCircle, Loader2, Sparkles, Building2 } from "lucide-react";
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
        setVendors(res.data.data || []);
      }
    }
    fetchAlternatives();
  }, [booking.id]);

  const handleSelectVendor = async (vendor: AlternativeVendor) => {
    const confirmChoice = window.confirm(
      `Select ${vendor.businessName} as your new vendor for this booking?`
    );
    if (!confirmChoice) return;

    setSelectingId(vendor.id);
    const res = await customerSelectVendorApi(booking.id, vendor.id);
    setSelectingId(null);

    if (!res.ok) {
      toast.error(res.error ?? "Failed to select vendor.");
      return;
    }

    toast.success(`Request sent to ${vendor.businessName}!`);
    await loadBooking(booking.id);
  };

  if (loading) {
    return (
      <div className="rounded-3xl border border-rose-200 bg-rose-50/50 p-8 text-center">
        <Loader2 className="mx-auto h-8 w-8 animate-spin text-rose-500" />
        <p className="mt-3 text-sm font-medium text-rose-700">
          Finding similar top-rated vendors for your event...
        </p>
      </div>
    );
  }

  if (vendors.length === 0) {
    return null;
  }

  return (
    <section className="rounded-3xl border border-rose-200 bg-gradient-to-br from-rose-50/70 via-white to-pink-50/50 p-7 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-rose-500" />
            <h2 className="text-2xl font-bold text-gray-900">
              Recommended Alternative Vendors
            </h2>
          </div>
          <p className="mt-1 text-sm text-gray-600">
            The previous vendor was unavailable. Choose any of these top-rated vendors in your location & budget to continue your booking:
          </p>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {vendors.map((v) => (
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
            <button
              onClick={() => void handleSelectVendor(v)}
              disabled={selectingId !== null}
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-rose-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-rose-600 disabled:opacity-60"
            >
              {selectingId === v.id ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <CheckCircle size={16} />
              )}
              {selectingId === v.id ? "Selecting..." : "Select Vendor"}
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
