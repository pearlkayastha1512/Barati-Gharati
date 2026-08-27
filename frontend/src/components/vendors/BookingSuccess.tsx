"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Sparkles, Package, ArrowRight, Tag, Loader2, Check, Store, Star } from "lucide-react";
import { getPublicVendorServicesApi, getServicesApi } from "@/services/api/service.api";
import { toast } from "sonner";
import Link from "next/link";

interface BookingSuccessProps {
  bookingId: string;
  vendorId?: number;
  vendorName: string;
  category?: string;
  currentPackageName?: string;
  date: string;
  eventType: string;
  onClose: () => void;
}

interface VendorPackage {
  id: string | number;
  vendorId?: number;
  vendorName?: string;
  name: string;
  title?: string;
  price: number;
  category?: string;
  description?: string;
  features?: string[];
  includes?: string[];
  images?: string[];
  rating?: number;
}

export default function BookingSuccess({
  bookingId,
  vendorId,
  vendorName,
  category,
  currentPackageName,
  date,
  eventType,
  onClose,
}: BookingSuccessProps) {
  const [sameVendorPackages, setSameVendorPackages] = useState<VendorPackage[]>([]);
  const [similarVendorPackages, setSimilarVendorPackages] = useState<VendorPackage[]>([]);
  const [loadingPackages, setLoadingPackages] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;
    setLoadingPackages(true);

    const promises: Promise<any>[] = [];

    // 1. Fetch same vendor packages
    if (vendorId) {
      promises.push(getPublicVendorServicesApi(vendorId));
    } else {
      promises.push(Promise.resolve({ ok: false }));
    }

    // 2. Fetch all public packages to filter similar packages from OTHER vendors
    promises.push(getServicesApi());

    Promise.all(promises)
      .then(([sameRes, allRes]) => {
        if (!isMounted) return;

        // Process same vendor packages
        if (sameRes && sameRes.ok && Array.isArray(sameRes.data)) {
          const filteredSame = sameRes.data.filter((pkg: any) => {
            const pkgTitle = pkg.name || pkg.title || "";
            return (
              !currentPackageName ||
              pkgTitle.toLowerCase() !== currentPackageName.toLowerCase()
            );
          });
          setSameVendorPackages(filteredSame);
        }

        // Process similar packages from OTHER vendors
        if (allRes && allRes.ok && Array.isArray(allRes.data)) {
          const targetCat = (category || "").toLowerCase().trim();
          const targetPkgName = (currentPackageName || "").toLowerCase().trim();

          let otherVendorsPkgs = allRes.data.filter((pkg: any) => {
            // Exclude current vendor
            if (vendorId && Number(pkg.vendorId) === Number(vendorId)) return false;

            const pkgCat = (pkg.category || "").toLowerCase();
            const pkgTitle = (pkg.name || pkg.title || "").toLowerCase();
            const pkgDesc = (pkg.description || "").toLowerCase();

            // Category or keyword match
            const categoryMatch = targetCat && pkgCat.includes(targetCat);
            const titleMatch = targetPkgName && pkgTitle.includes(targetPkgName);
            const catInTitle = targetCat && pkgTitle.includes(targetCat);
            const catInDesc = targetCat && pkgDesc.includes(targetCat);

            return categoryMatch || titleMatch || catInTitle || catInDesc;
          });

          // Fallback: If strict category match returns empty, pick top active packages from other vendors
          if (otherVendorsPkgs.length === 0) {
            otherVendorsPkgs = allRes.data
              .filter((pkg: any) => !vendorId || Number(pkg.vendorId) !== Number(vendorId))
              .slice(0, 4);
          }

          setSimilarVendorPackages(otherVendorsPkgs.slice(0, 6));
        }
      })
      .catch((err) => console.error("Error fetching recommendation packages:", err))
      .finally(() => {
        if (isMounted) setLoadingPackages(false);
      });

    return () => {
      isMounted = false;
    };
  }, [vendorId, category, currentPackageName]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="p-6 sm:p-10 text-center max-w-4xl mx-auto"
    >
      {/* Animated Success Badge */}
      <div className="relative mx-auto inline-flex items-center justify-center">
        <div className="absolute -inset-2 rounded-full bg-emerald-100 blur-md opacity-70 animate-pulse" />
        <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 text-emerald-500 shadow-inner">
          <CheckCircle2 className="h-14 w-14" />
        </div>
      </div>

      <h2 className="mt-6 text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
        Booking Request Sent!
      </h2>

      <p className="mt-2 text-sm sm:text-base text-slate-600 max-w-xl mx-auto leading-relaxed">
        Your booking request for <span className="font-bold text-slate-900">{vendorName}</span> has been dispatched. The vendor has 2 hours to accept your booking request.
      </p>

      {/* Booking Summary Box */}
      <div className="mt-8 rounded-3xl bg-slate-50/80 border border-slate-100 p-6 text-left shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-200">
          <div className="pb-3 sm:pb-0">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Booking ID</p>
            <p className="mt-1 text-lg font-black text-rose-600 tracking-tight">#{bookingId}</p>
          </div>

          <div className="py-3 sm:py-0 sm:px-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Vendor Name</p>
            <p className="mt-1 text-base font-bold text-slate-900">{vendorName}</p>
          </div>

          <div className="pt-3 sm:pt-0 sm:pl-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{eventType} Date</p>
            <p className="mt-1 text-base font-bold text-rose-600">{date}</p>
          </div>
        </div>
      </div>

      {/* Notice Banner */}
      <div className="mt-4 rounded-2xl bg-rose-50/70 border border-rose-100 p-3.5 text-xs text-rose-700 text-left flex items-center gap-2.5">
        <Sparkles className="h-4 w-4 shrink-0 text-rose-500" />
        <span>Once {vendorName} accepts your request, you will receive a notification to pay the advance payment and lock your date.</span>
      </div>

      {/* SECTION 1: SAME VENDOR PACKAGES */}
      {loadingPackages ? (
        <div className="mt-10 p-6 text-center text-slate-400 text-xs flex items-center justify-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Loading recommendations...</span>
        </div>
      ) : (
        <>
          {sameVendorPackages.length > 0 && (
            <div className="mt-10 text-left border-t border-slate-100 pt-8">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-amber-500 fill-amber-400" />
                    More Packages & Services from {vendorName}
                  </h3>
                  <p className="text-xs text-slate-500">Explore additional services offered by this vendor for your wedding</p>
                </div>
                <span className="rounded-full bg-rose-50 px-3 py-1 text-xs font-bold text-rose-600 border border-rose-100">
                  {sameVendorPackages.length} Available
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {sameVendorPackages.map((pkg) => {
                  const title = pkg.name || pkg.title || "Package Service";
                  const price = pkg.price ? `₹${Number(pkg.price).toLocaleString("en-IN")}` : "Custom Pricing";
                  const pkgCat = pkg.category || "Service";

                  return (
                    <div
                      key={pkg.id}
                      className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md hover:border-rose-300 transition-all duration-200"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <span className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-2.5 py-0.5 text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                            <Tag className="h-3 w-3 text-rose-500" />
                            {pkgCat}
                          </span>
                          <h4 className="font-bold text-slate-900 text-sm group-hover:text-rose-600 transition">
                            {title}
                          </h4>
                        </div>
                        <span className="text-sm font-black text-rose-600 shrink-0">
                          {price}
                        </span>
                      </div>

                      {pkg.description && (
                        <p className="mt-2 text-xs text-slate-500 line-clamp-2 leading-relaxed">
                          {pkg.description}
                        </p>
                      )}

                      <div className="mt-4 flex items-center justify-between pt-3 border-t border-slate-100">
                        <span className="text-[11px] font-semibold text-rose-600">Available to add</span>
                        <button
                          type="button"
                          onClick={() => {
                            toast.info(`You can request "${title}" directly from ${vendorName}'s profile page.`);
                          }}
                          className="inline-flex items-center gap-1 text-xs font-bold text-slate-700 hover:text-rose-600 transition"
                        >
                          <span>Explore</span>
                          <ArrowRight className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* SECTION 2: SIMILAR PACKAGES FROM OTHER VENDORS */}
          {similarVendorPackages.length > 0 && (
            <div className="mt-10 text-left border-t border-slate-100 pt-8">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <Store className="h-5 w-5 text-rose-600" />
                    Similar {category ? `${category} ` : ""}Packages from Other Top Vendors
                  </h3>
                  <p className="text-xs text-slate-500">Explore similar packages offered by other verified vendors on Barati Gharati</p>
                </div>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700 border border-slate-200">
                  {similarVendorPackages.length} Suggestions
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {similarVendorPackages.map((pkg) => {
                  const title = pkg.name || pkg.title || "Package Service";
                  const price = pkg.price ? `₹${Number(pkg.price).toLocaleString("en-IN")}` : "Custom Pricing";
                  const pkgCat = pkg.category || category || "Service";
                  const otherVendorName = pkg.vendorName || "Top Vendor";

                  return (
                    <div
                      key={pkg.id}
                      className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md hover:border-rose-300 transition-all duration-200"
                    >
                      {/* Vendor Badge Header */}
                      <div className="flex items-center justify-between mb-2">
                        <span className="inline-flex items-center gap-1.5 rounded-lg bg-rose-50 px-2.5 py-1 text-xs font-bold text-rose-700 border border-rose-100">
                          <Store className="h-3.5 w-3.5 text-rose-500" />
                          {otherVendorName}
                        </span>
                        {pkg.rating && (
                          <span className="flex items-center gap-1 text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-100">
                            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                            {pkg.rating}
                          </span>
                        )}
                      </div>

                      <div className="flex items-start justify-between gap-3 mt-1">
                        <div>
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
                            <Tag className="h-3 w-3 text-rose-400" />
                            {pkgCat}
                          </span>
                          <h4 className="font-bold text-slate-900 text-sm group-hover:text-rose-600 transition">
                            {title}
                          </h4>
                        </div>
                        <span className="text-sm font-black text-rose-600 shrink-0">
                          {price}
                        </span>
                      </div>

                      {pkg.description && (
                        <p className="mt-2 text-xs text-slate-500 line-clamp-2 leading-relaxed">
                          {pkg.description}
                        </p>
                      )}

                      <div className="mt-4 flex items-center justify-between pt-3 border-t border-slate-100">
                        <span className="text-[11px] font-semibold text-slate-500">Alternative Option</span>
                        {pkg.vendorId ? (
                          <Link
                            href={`/vendors/${pkg.vendorId}`}
                            onClick={onClose}
                            className="inline-flex items-center gap-1 text-xs font-bold text-rose-600 hover:text-rose-700 transition"
                          >
                            <span>Explore Vendor</span>
                            <ArrowRight className="h-3.5 w-3.5" />
                          </Link>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              toast.info(`Explore ${otherVendorName}'s services from the Vendors directory.`);
                            }}
                            className="inline-flex items-center gap-1 text-xs font-bold text-rose-600 hover:text-rose-700 transition"
                          >
                            <span>Explore Vendor</span>
                            <ArrowRight className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}

      {/* Footer Action Button */}
      <div className="mt-10 pt-4 border-t border-slate-100">
        <button
          onClick={onClose}
          className="w-full sm:w-auto rounded-2xl bg-slate-900 hover:bg-slate-800 px-10 py-3.5 text-sm font-bold text-white shadow-lg shadow-slate-900/20 transition hover:scale-[1.01] active:scale-[0.99]"
        >
          Back to Vendor
        </button>
      </div>
    </motion.div>
  );
}
