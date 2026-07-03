import Link from "next/link";
import { MapPin } from "lucide-react";

import { Vendor } from "@/types/vendor";

interface VendorInfoProps {
  id: Vendor["id"];
  name: Vendor["name"];
  category: Vendor["category"];
  city: Vendor["city"];
  price: Vendor["price"];
}
export default function VendorInfo({
  id,
  name,
  category,
  city,
  price,
}: VendorInfoProps) {
  return (
    <div className="space-y-5 p-6">

      <div>

        <p className="text-sm font-semibold uppercase tracking-wide text-rose-500">
          {category}
        </p>

        <h3 className="mt-2 text-2xl font-bold text-gray-900">
          {name}
        </h3>

      </div>

      <div className="flex items-center gap-2 text-gray-500">
        <MapPin size={18} />
        <span>{city}</span>
      </div>

      <div>

        <p className="text-sm text-gray-400">
          Starting From
        </p>

        <h4 className="mt-1 text-3xl font-bold text-rose-600">
          {price}
        </h4>

      </div>

      <div className="flex gap-3">

        <Link
          href={`/vendors/${id}`}
          className="flex-1 rounded-xl border border-gray-700 py-3 text-center  text-gray-600 font-semibold transition hover:border-rose-500 hover:text-rose-500"
        >
          View Profile
        </Link>
 

       <Link href={`/vendors/${id}`} 
        // className="flex-1 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 py-3 font-semibold text-white shadow-lg transition hover:shadow-xl"

        className="flex-1 rounded-xl border border-gray-100 py-3 text-center  text-gray-100 font-semibold transition hover:border-rose-500 hover:text-rose-100 bg-gradient-to-r from-rose-500 to-pink-500"
       >
        
          Book Now
       
        </Link>

      </div>

    </div>
  );
}