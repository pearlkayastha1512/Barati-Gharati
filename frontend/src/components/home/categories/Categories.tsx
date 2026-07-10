import CategoryCard from "./CategoryCard";
import { categories } from "./category-data";

export default function Categories() {
  return (
    <section className="bg-rose-50 py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-16 text-center">
          <p className="font-semibold uppercase tracking-[0.3em] text-rose-500">
            CATEGORIES
          </p>

          <h2 className="mt-4 text-5xl font-bold text-gray-900">
            Services for Every Celebration
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-lg text-gray-600">
            From weddings and birthdays to kids&apos; parties and
            milestone events, find trusted professionals in one place.
          </p>
        </div>

        <div
          className="
            grid
            grid-cols-2
            gap-6
            md:grid-cols-4
            xl:grid-cols-8
          "
        >
          {categories.slice(0, 8).map((item) => (
            <CategoryCard
              key={item.id}
              {...item}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
