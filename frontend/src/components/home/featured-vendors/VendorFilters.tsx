"use client";

import { vendors } from "./vendor-data";

interface VendorFiltersProps {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
  categories?: string[];
}

const defaultFilters = [
  "All",
  "Venue",
  "Photographer",
  "Decorator",
  "Catering",
  "Makeup Artist",
  "DJ",
];

export default function VendorFilters({
  activeCategory,
  onCategoryChange,
  categories,
}: VendorFiltersProps) {
  const filterItems = categories && categories.length > 1 ? categories : defaultFilters;
  return (
    <div className="flex flex-wrap items-center justify-center gap-4">

      {filterItems.map((item) => (

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