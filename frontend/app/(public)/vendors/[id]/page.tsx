"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, notFound } from "next/navigation";

import { vendors as demoVendors } from "@/components/home/featured-vendors/vendor-data";
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
    <main className="bg-rose-50 pb-20 pt-32">
      <div className="mx-auto max-w-7xl px-6">

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

        <div className="space-y-10 lg:col-span-2">

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