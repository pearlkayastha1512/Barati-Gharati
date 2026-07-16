import CategoryCard from "./CategoryCard";
import { serviceCategories } from "./category-data";

const celebrationTypes = [
  "Birthdays",
  "Kids Parties",
  "Anniversaries",
  "Baby Showers",
  "Corporate Events",
  "Housewarming",
  "Naming Ceremonies",
  "Graduation Parties",
];

export default function ServiceCategories() {
  return (
    <section
      id="celebrations"
      className="scroll-mt-24 bg-[linear-gradient(135deg,#e7a1b2_0%,#f1c1bc_55%,#d9829d_100%)] py-24"
    >

      <div className="mx-auto max-w-7xl px-6">

        <div className="mx-auto max-w-3xl text-center">

          <p className="font-semibold uppercase tracking-[0.35em] text-rose-500">
            OUR SERVICES
          </p>

          <h2 className="mt-5 text-4xl font-bold text-gray-900 md:text-5xl">
            Services for Every Celebration
            <span className="block text-rose-500">
              Under One Roof
            </span>
          </h2>

          <p className="mt-6 text-lg leading-8 text-gray-600">
            From weddings to birthdays and milestone events, discover verified professionals for every detail.
          </p>

        </div>

        <div className="mt-12 rounded-[32px] border border-white/60 bg-[#6f2948]/90 p-7 text-white shadow-xl shadow-[#6f2948]/20 backdrop-blur md:p-9">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-xl">
              <p className="text-sm font-bold uppercase tracking-[0.3em] text-rose-200">
                Beyond Weddings
              </p>
              <h3 className="mt-3 text-2xl font-bold md:text-3xl">
                Your celebrations, planned beautifully.
              </h3>
              <p className="mt-3 leading-7 text-rose-100">
                The same trusted vendors and planning support are available for personal, family and corporate occasions too.
              </p>
            </div>

            <div className="flex max-w-2xl flex-wrap gap-3">
              {celebrationTypes.map((celebration) => (
                <span
                  key={celebration}
                  className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white"
                >
                  {celebration}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

          {serviceCategories.map((category) => (
            <CategoryCard
              key={category.id}
              {...category}
            />
          ))}

        </div>

      </div>

    </section>
  );
}
