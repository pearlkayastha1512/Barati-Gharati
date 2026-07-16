import ValueCard from "./ValueCard";
import { values } from "./values-data";

export default function CoreValues() {
  return (
    <section className="relative overflow-hidden bg-[linear-gradient(135deg,#efb9b9_0%,#d98ca5_50%,#c96d8e_100%)] py-24">

      {/* Background Glow */}

      <div className="absolute left-0 top-20 h-[350px] w-[350px] rounded-full bg-rose-400/35 blur-[140px]" />

      <div className="absolute right-0 bottom-0 h-[350px] w-[350px] rounded-full bg-pink-400/30 blur-[140px]" />

      <div className="relative mx-auto max-w-7xl px-6">

        <div className="mx-auto max-w-3xl text-center">

          <p className="font-semibold uppercase tracking-[0.4em] text-rose-500">
            OUR VALUES
          </p>

          <h2 className="mt-5 text-4xl font-bold text-gray-900 md:text-5xl">
            The Principles That
            <span className="block text-rose-500">
              Guide Everything We Do
            </span>
          </h2>

          <p className="mt-6 text-lg leading-8 text-gray-600">
            Every feature, every partnership and every experience is built
            around these core values.
          </p>

        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-2 xl:grid-cols-4">

          {values.map((value) => (
            <ValueCard
              key={value.id}
              icon={value.icon}
              title={value.title}
              description={value.description}
            />
          ))}

        </div>

      </div>

    </section>
  );
}
