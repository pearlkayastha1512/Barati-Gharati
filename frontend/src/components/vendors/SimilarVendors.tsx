import Link from "next/link";
import Image from "next/image";
import { MapPin, Star } from "lucide-react";
import { vendors } from "@/components/home/featured-vendors/vendor-data";

interface SimilarVendorsProps {
  currentVendorId: number;
  category: string;
}

export default function SimilarVendors({
  currentVendorId,
  category,
}: SimilarVendorsProps) {
  const similarVendors = vendors
    .filter(
      (vendor) =>
        vendor.id !== currentVendorId &&
        vendor.category === category
    )
    .slice(0, 4);

  // If not enough vendors of same category,
  // fill remaining slots with other vendors
  const finalVendors =
    similarVendors.length >= 4
      ? similarVendors
      : [
          ...similarVendors,
          ...vendors
            .filter(
              (vendor) =>
                vendor.id !== currentVendorId &&
                !similarVendors.some((v) => v.id === vendor.id)
            )
            .slice(0, 4 - similarVendors.length),
        ];

  return (
    <section className="mt-20">

      <div className="mb-10 flex items-center justify-between">

        <div>

          <h2 className="text-3xl font-bold text-white">
            Similar Vendors
          </h2>

          <p className="mt-2 text-rose-100/70">
            Explore more amazing wedding professionals.
          </p>

        </div>

        <Link
          href="/vendors"
          className="font-semibold text-rose-300 hover:text-rose-100"
        >
          View All →
        </Link>

      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-4">

        {finalVendors.map((vendor) => (
          <article
            key={vendor.id}
            className="group overflow-hidden rounded-3xl border border-white/10 bg-white/[0.06] shadow-xl shadow-black/20 transition-all duration-500 hover:-translate-y-2 hover:bg-white/[0.09]"
          >
            <div className="relative h-56 overflow-hidden">
              <Image
                src={vendor.image}
                alt={vendor.name}
                fill
                sizes="
                  (max-width:768px) 100vw,
                  (max-width:1280px) 50vw,
                  25vw
                "
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

              <div className="absolute bottom-4 right-4 flex items-center gap-1 rounded-full border border-white/15 bg-black/40 px-3 py-1 text-sm font-semibold text-white backdrop-blur">
                <Star
                  size={14}
                  className="fill-yellow-400 text-yellow-400"
                />
                {vendor.rating} ({vendor.reviews})
              </div>
            </div>

            <div className="space-y-5 p-6">
              <div>
                <p className="text-sm font-semibold uppercase text-rose-300">
                  {vendor.category}
                </p>

                <h3 className="mt-2 text-2xl font-bold text-white">
                  {vendor.name}
                </h3>
              </div>

              <div className="flex items-center gap-2 text-rose-100/65">
                <MapPin size={18} />
                <span>{vendor.city}</span>
              </div>

              <div>
                <p className="text-sm text-rose-100/50">
                  Starting From
                </p>

                <h4 className="mt-1 text-3xl font-bold text-rose-300">
                  ₹{vendor.price.toLocaleString("en-IN")}
                </h4>
              </div>

              <Link
                href={`/vendors/${vendor.id}`}
                className="block rounded-xl border border-rose-300/25 py-3 text-center font-semibold text-rose-50 transition hover:border-rose-300 hover:bg-rose-400/10"
              >
                View Profile
              </Link>
            </div>
          </article>
        ))}

      </div>

    </section>
  );
}
