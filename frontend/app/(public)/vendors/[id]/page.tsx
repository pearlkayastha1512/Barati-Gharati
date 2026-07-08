"use client";

import { useEffect, useState } from "react";
import { useParams, notFound } from "next/navigation";

import { getVendors } from "@/services/vendor.service";
import { Vendor } from "@/types/vendor";

import VendorHero from "@/components/vendors/VendorHero";
import VendorAbout from "@/components/vendors/VendorAbout";
import VendorGallery from "@/components/vendors/VendorGallery";
import VendorBookingCard from "@/components/vendors/VendorBookingCard";
import VendorReviews from "@/components/vendors/VendorReviews";
import SimilarVendors from "@/components/vendors/SimilarVendors";

export default function VendorDetailsPage() {
  const params = useParams();

  const id = params.id as string;

  const [registeredVendors, setRegisteredVendors] =
    useState<Vendor[]>([]);

  useEffect(() => {
    async function loadVendors() {
      const vendors = await getVendors();

      setRegisteredVendors(vendors);
    }

    loadVendors();
  }, []);

  // const allVendors = useMemo(() => {
  //   return [
  //     ...demoVendors,
  //     ...registeredVendors,
  //   ];
  // }, [registeredVendors]);


  const allVendors = registeredVendors;

  const vendor = allVendors.find(
    (vendor) =>
      vendor.id != null &&
      vendor.id.toString() === id
  );

  if (
    registeredVendors.length > 0 &&
    !vendor
  ) {
    notFound();
  }

  if (!vendor) {
    return null;
  }

  return (
    <main className="min-h-screen bg-[#12070d] pb-20 pt-32 text-white">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top_left,rgba(225,29,72,0.22),transparent_34%),linear-gradient(135deg,rgba(46,10,26,0.95),rgba(12,10,18,0.98)_58%,rgba(42,8,22,0.95))]" />

      <div className="relative mx-auto max-w-7xl px-6">

        <VendorHero vendor={vendor} />

        <div className="mt-12 grid gap-10 lg:grid-cols-3">

          <div className="space-y-10 lg:col-span-2">

            <VendorGallery
              vendorId={vendor.id}
            />

            <VendorAbout
              description={vendor.description}
              amenities={vendor.amenities}
            />

          </div>

          <div>

            <VendorBookingCard
              vendor={vendor}
            />

          </div>

        </div>

        <div className="mt-12 space-y-10 lg:col-span-2">

          <VendorReviews
            vendorId={vendor.id}
            vendorName={vendor.name}
          />

        </div>

        <SimilarVendors
          currentVendorId={vendor.id}
          category={vendor.category}
        />

      </div>
    </main>
  );
}
