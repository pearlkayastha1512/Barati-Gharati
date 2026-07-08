"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

import { Portfolio } from "@/types/portfolio";
import { getVendorPortfolio } from "@/services/portfolio.service";

interface VendorGalleryProps {
  vendorId: number;
}

export default function VendorGallery({
  vendorId,
}: VendorGalleryProps) {
  const [portfolio, setPortfolio] = useState<
    Portfolio[]
  >([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    async function loadGallery() {
      setLoading(true);

      const data =
        await getVendorPortfolio(
          vendorId
        );

      setPortfolio(
        Array.isArray(data)
          ? data
          : []
      );

      setLoading(false);
    }

    loadGallery();
  }, [vendorId]);

  const images = portfolio.map(
    (item) => item.image
  );

  if (loading) {
    return (
      <section className="mt-10 rounded-3xl border border-white/10 bg-white/[0.06] p-12 text-center text-rose-100 shadow-xl shadow-black/20">
        Loading gallery...
      </section>
    );
  }

  if (images.length === 0) {
    return (
      <section className="mt-10 rounded-3xl border border-dashed border-rose-300/25 bg-white/[0.06] p-12 text-center shadow-xl shadow-black/20">
        <h2 className="text-3xl font-bold text-white">
          Gallery
        </h2>

        <p className="mt-4 text-rose-100/70">
          This vendor hasn&apos;t uploaded any portfolio yet.
        </p>
      </section>
    );
  }

  return (
    <section className="mt-10">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-white">
          Gallery
        </h2>

        <p className="mt-2 text-rose-100/70">
          Explore our beautiful wedding moments.
        </p>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div className="relative col-span-4 h-[500px] overflow-hidden rounded-3xl lg:col-span-2">
          <Image
            src={images[0]}
            alt="Portfolio"
            fill
            className="object-cover transition duration-500 hover:scale-105"
          />
        </div>

        <div className="col-span-4 grid grid-cols-2 gap-4 lg:col-span-2">
          {images
            .slice(1, 5)
            .map((image, index) => (
              <div
                key={index}
                className="relative h-60 overflow-hidden rounded-3xl"
              >
                <Image
                  src={image}
                  alt="Portfolio"
                  fill
                  className="object-cover transition duration-500 hover:scale-105"
                />
              </div>
            ))}
        </div>
      </div>
    </section>
  );
}
