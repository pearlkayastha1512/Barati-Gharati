"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Building2,
  Mail,
  MapPin,
  Phone,
  IndianRupee,
  ArrowRight,
} from "lucide-react";

import { Booking } from "@/types/booking";

interface VendorInformationProps {
  booking: Booking;
}

export default function VendorInformation({
  booking,
}: VendorInformationProps) {
  return (
    <section className="rounded-3xl border border-gray-200 bg-white p-7 shadow-sm">

      <div className="mb-6">

        <h2 className="text-2xl font-bold text-gray-900">
          Vendor Information
        </h2>

        <p className="mt-1 text-gray-500">
          Details of your booked vendor.
        </p>

      </div>

      <div className="flex flex-col gap-6 lg:flex-row">

        {/* Vendor Image */}

        <div className="relative h-60 w-full overflow-hidden rounded-3xl lg:h-56 lg:w-72">

          <Image
            src="https://images.unsplash.com/photo-1519741497674-611481863552?w=800"
            alt={booking.vendorName}
            fill
            className="object-cover"
          />

        </div>

        {/* Vendor Details */}

        <div className="flex-1">

          <div className="flex items-center justify-between">

            <div>

              <h3 className="text-3xl font-bold text-gray-900">
                {booking.vendorName}
              </h3>

              <p className="mt-2 text-gray-500">
                {booking.category}
              </p>

            </div>

            <span className="rounded-full bg-green-100 px-4 py-2 text-sm font-semibold text-green-700">
              Verified
            </span>

          </div>

          <div className="mt-8 space-y-5">

            <div className="flex items-center gap-3">

              <Building2
                size={20}
                className="text-indigo-500"
              />

              <span className="text-gray-700">
                {booking.packageName}
              </span>

            </div>

            <div className="flex items-center gap-3">

              <Phone
                size={20}
                className="text-indigo-500"
              />

              <span className="text-gray-500">
                Will be available after confirmation
              </span>

            </div>

            <div className="flex items-center gap-3">

              <Mail
                size={20}
                className="text-indigo-500"
              />

              <span className="text-gray-500">
                Hidden for privacy
              </span>

            </div>

            <div className="flex items-center gap-3">

              <MapPin
                size={20}
                className="text-indigo-500"
              />

              <span className="text-gray-700">
                {booking.city}
              </span>

            </div>

            <div className="flex items-center gap-3">

              <IndianRupee
                size={20}
                className="text-indigo-500"
              />

              <span className="font-semibold text-gray-900">
                ₹
                {booking.amount.toLocaleString(
                  "en-IN"
                )}
              </span>

            </div>

          </div>

          <Link
            href={`/vendors/${booking.vendorId}`}
            className="
              mt-8
              inline-flex
              items-center
              gap-2
              rounded-2xl
              bg-indigo-600
              px-6
              py-3
              font-semibold
              text-white
              transition
              hover:bg-indigo-700
            "
          >
            View Vendor Profile

            <ArrowRight size={18} />

          </Link>

        </div>

      </div>

    </section>
  );
}