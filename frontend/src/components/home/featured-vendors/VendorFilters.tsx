"use client";

import { vendors } from "./vendor-data";

interface VendorFiltersProps {
  activeCategory: string;
  onCategoryChange: (
    category: string
  ) => void;
}

const filters = [
  "All",
  ...Array.from(
    new Set(
      vendors.map(
        (vendor) => vendor.category
      )
    )
  ),
];

export default function VendorFilters({
  activeCategory,
  onCategoryChange,
}: VendorFiltersProps) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-4">

      {filters.map((item) => (

        <button
          key={item}
          onClick={() =>
            onCategoryChange(item)
          }
          className={`
            rounded-full
            px-6
            py-3
            text-sm
            font-semibold
            transition-all
            duration-300

            ${
              activeCategory === item
                ? "bg-rose-500 text-white shadow-lg"
                : "bg-white text-gray-700 hover:bg-rose-500 hover:text-white"
            }
          `}
        >
          {item}
        </button>

      ))}

    </div>
  );
}