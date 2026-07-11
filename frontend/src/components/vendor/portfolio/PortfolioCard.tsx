


"use client";

import Image from "next/image";
import {
  Heart,
  Eye,
  Pencil,
  Trash2,
} from "lucide-react";

interface Props {
  title: string;
  image: string;
  category: string;
  categories?: string[];
  onEdit?: () => void;
  onDelete?: () => void;
}

export default function PortfolioCard({
  title,
  image,
  category,
  categories,
  onEdit,
  onDelete,
}: Props) {
  const visibleCategories =
    categories?.length
      ? categories
      : [category];

  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white text-gray-600 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      {/* Image */}
      <div className="relative h-64 overflow-hidden">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover transition duration-300 hover:scale-105"
        />

        <div className="absolute left-4 top-4 flex max-w-[calc(100%-2rem)] flex-wrap gap-2">
          {visibleCategories.map((item) => (
            <span
              key={item}
              className="rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-gray-600 backdrop-blur"
            >
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* Body */}
      <div className="p-5">
        <h3 className="text-xl font-bold text-gray-700">
          {title}
        </h3>

        <div className="mt-5 flex items-center justify-between">
          <div className="flex gap-5 text-gray-500">
            {/* <div className="flex items-center gap-1">
              <Eye size={17} />
              <span>842</span>
            </div> */}

            {/* <div className="flex items-center gap-1">
              <Heart size={17} />
              <span>218</span>
            </div> */}
          </div>

          <div className="flex gap-2">
            <button
              onClick={onEdit}
              className="rounded-xl bg-[#fff8ef] p-2 text-[#e4005a] transition hover:bg-[#ffe1ec]"
            >
              <Pencil size={18} />
            </button>

            <button
              onClick={onDelete}
              className="rounded-xl bg-red-50 p-2 text-red-600 transition hover:bg-red-100"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
