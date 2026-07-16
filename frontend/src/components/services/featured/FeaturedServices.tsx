import FeaturedServiceCard from "./FeaturedServiceCard";
import { featuredServices } from "./featured-services-data";

export default function FeaturedServices() {
  return (
    <section className="bg-[linear-gradient(145deg,#d9829d_0%,#eeb4bd_48%,#f3c6bb_100%)] py-24">

      <div className="mx-auto max-w-7xl px-6">

        <div className="mb-16 text-center">

          <p className="font-semibold uppercase tracking-[0.35em] text-rose-500">
            FEATURED SERVICES
          </p>

          <h2 className="mt-5 text-4xl font-bold text-gray-900 md:text-5xl">
            Premium Wedding Experiences
          </h2>

          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-gray-600">
            Discover handpicked wedding professionals delivering exceptional experiences across India.
          </p>

        </div>

        <div className="grid gap-10 lg:grid-cols-3">

          {featuredServices.map((service) => (
            <FeaturedServiceCard
              key={service.id}
              {...service}
            />
          ))}

        </div>

      </div>

    </section>
  );
}
