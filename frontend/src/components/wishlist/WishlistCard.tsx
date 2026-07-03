"use client";

import Image from "next/image";
import Link from "next/link";
import {
  MapPin,
  Star,
  Heart,
  ArrowRight,
} from "lucide-react";

interface WishlistCardProps {
  vendorName: string;
  category: string;
  city: string;
  rating: number;
  startingPrice: number;
  image: string;
}

export default function WishlistCard({
  vendorName,
  category,
  city,
  rating,
  startingPrice,
  image,
}: WishlistCardProps) {
  return (
    <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-xl">

      <div className="relative h-60">

        <Image
          src={image}
          alt={vendorName}
          fill
          className="object-cover"
        />

        <button className="absolute right-4 top-4 rounded-full bg-white p-3 shadow">

          <Heart
            size={18}
            className="fill-rose-500 text-rose-500"
          />

        </button>

      </div>

      <div className="p-6">

        <div className="flex items-center justify-between">

          <h3 className="text-2xl font-bold text-gray-900">
            {vendorName}
          </h3>

          <span className="flex items-center gap-1 text-yellow-500">

            <Star
              size={18}
              className="fill-current"
            />

            {rating}

          </span>

        </div>

        <p className="mt-2 text-gray-500">
          {category}
        </p>

        <div className="mt-4 flex items-center gap-2 text-gray-500">

          <MapPin size={18} />

          {city}

        </div>

        <p className="mt-6 text-3xl font-bold text-gray-900">
          ₹{startingPrice.toLocaleString()}
        </p>

        <div className="mt-6 flex gap-3">

          <Link
            href="/vendors/1"
            className="flex-1 rounded-2xl border border-gray-200 py-3 text-center font-semibold transition hover:bg-gray-50 text-gray-600"
          >
            View
          </Link>

          <button className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-rose-500 py-3 font-semibold text-white transition hover:bg-rose-600">

            Book Now

            <ArrowRight size={18} />

          </button>

        </div>

      </div>

    </div>
  );
}