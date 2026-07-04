"use client";

import { useVendorStore } from "@/store/vendorStore";
import {
  Building2,
  Camera,
  Sparkles,
  Flower2,
  UtensilsCrossed,
  Music2,
  HeartHandshake,
  
} from "lucide-react";

import { RotateCcw } from "lucide-react";
import { CATEGORY_CARDS } from "@/constants/categories";

import { CITIES } from "@/constants/cities";
export default function FilterSidebar() {

  

  const { categories, toggleCategory } = useVendorStore();
 const { cities, toggleCity } = useVendorStore();
  const { rating, setRating } = useVendorStore();
  const { budget, setBudget, resetFilters } = useVendorStore();
  return (
   <aside
  className="
    hidden
    lg:block
    sticky
    top-32
    w-72
    h-[calc(100vh-8rem)]
    overflow-y-auto
    rounded-3xl
    border
    border-gray-200
    bg-white
    p-6
    shadow-lg
    scrollbar-thin
    scrollbar-thumb-rose-300
    scrollbar-track-transparent
  "
>

      <div className="mb-8 flex items-center justify-between">

        <h2 className="text-xl font-bold text-gray-700">
          Filters
        </h2>

        <button
  onClick={resetFilters}
  className="flex items-center gap-2 text-sm font-medium text-rose-500 transition hover:text-rose-600"
>
  <RotateCcw size={16} />
  Reset
</button>

      </div>

      {/* Categories */}

      <div className="mb-8">

        <h3 className="mb-4 font-semibold  text-rose-500 hover:text-rose-600">
          Categories
        </h3>

        <div className="space-y-3">

         {CATEGORY_CARDS.map(({ title, icon: Icon }) => (
  <label
    key={title}
    className={`flex cursor-pointer items-center gap-3 rounded-xl p-2 transition ${
      categories.includes(title)
        ? "border border-rose-300 bg-rose-100"
        : "hover:bg-rose-50"
    }`}
  >
    <input
      type="checkbox"
      checked={categories.includes(title)}
      onChange={() => toggleCategory(title)}
      className="accent-rose-500"
    />

    <Icon
      size={18}
      className="text-rose-500"
    />

    <span className="text-gray-700">
      {title}
    </span>
  </label>
))}

        </div>

      </div>

      {/* Rating */}

      <div className="mb-8">
  <h3 className="mb-4 font-semibold text-rose-500">
    Minimum Rating
  </h3>

  <div className="space-y-3">
    {[5, 4.5, 4, 3.5, 3].map((star) => (
      <label
        key={star}
        className="flex cursor-pointer items-center gap-3 rounded-lg p-2 hover:bg-rose-50"
      >
        <input
          type="radio"
          name="rating"
          checked={rating === star}
          onChange={() => setRating(star)}
          className="accent-rose-500"
        />

        <span className="text-lg">
          {"⭐".repeat(star)}
        </span>

        <span className="text-sm text-gray-500">
          & Up
        </span>
      </label>
    ))}
  </div>
</div>

      {/* Price */}

      <div className="mb-8">

        <h3 className="mb-4 font-semibold text-rose-500 hover:text-rose-600">
          Budget
        </h3>

       <input
  type="range"
  min={20000}
  max={1000000}
  step={5000}
  value={budget}
  onChange={(e) => setBudget(Number(e.target.value))}
  className="w-full accent-rose-500"
/>

 <p className="mt-3 text-center text-sm font-medium text-rose-600">
    Up to ₹{budget.toLocaleString("en-IN")}
  </p>

        <div className="mt-2 flex justify-between text-sm text-gray-500">

          <span>₹20K</span>

<span>₹10L+</span>

        </div>

      </div>

      {/* Cities */}

      <div>

        <h3 className="mb-4 font-semibold text-rose-500 hover:text-rose-600">
          Cities
        </h3>

        <div className="space-y-3">

     {CITIES.map((city) => (
  <label
    key={city}
    className={`flex cursor-pointer items-center gap-3 rounded-xl p-2 transition ${
      cities.includes(city)
        ? "border border-rose-300 bg-rose-100"
        : "hover:bg-rose-50"
    }`}
  >
    <input
      type="checkbox"
      checked={cities.includes(city)}
      onChange={() => toggleCity(city)}
      className="accent-rose-500"
    />

    <span className="text-gray-700">
      {city}
    </span>
  </label>
))}

        </div>

      </div>

    </aside>
  );
}