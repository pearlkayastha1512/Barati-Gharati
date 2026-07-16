import TestimonialCard from "./TestimonialCard";
import { testimonials } from "./testimonials-data";

export default function TestimonialsSection() {
  return (
    <section className="relative overflow-hidden bg-[linear-gradient(135deg,#df91a8_0%,#efb8c1_52%,#d9809d_100%)] py-24">
      {/* Background Glow */}

      <div className="absolute inset-0">
        <div className="absolute left-0 top-20 h-72 w-72 rounded-full bg-rose-400/40 blur-[120px]" />

        <div className="absolute right-0 bottom-10 h-72 w-72 rounded-full bg-pink-400/35 blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6">

        {/* Heading */}

        <div className="mb-16 text-center">

          <p className="font-semibold uppercase tracking-[0.35em] text-rose-500">
            TESTIMONIALS
          </p>

          <h2 className="mt-5 text-4xl font-bold text-gray-900 lg:text-6xl">
            Loved by
            <span className="text-rose-500"> Thousands</span>
            <br />
            of Happy Couples
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-600">
            Hear from couples who trusted us to make one of the biggest
            moments of their lives truly unforgettable.
          </p>

        </div>

        {/* Cards */}

        <div className="grid gap-8 lg:grid-cols-3">

          {testimonials.map((testimonial) => (

            <TestimonialCard
              key={testimonial.id}
              name={testimonial.name}
              city={testimonial.city}
              image={testimonial.image}
              rating={testimonial.rating}
              review={testimonial.review}
            />

          ))}

        </div>

      </div>
    </section>
  );
}
