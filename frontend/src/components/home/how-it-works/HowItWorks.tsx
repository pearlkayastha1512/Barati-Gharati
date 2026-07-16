import StepCard from "./StepCard";
import { steps } from "./steps-data";

export default function HowItWorks() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#f8d8cc] via-[#e9a6b8] to-[#f6cec6] py-24">
      {/* Background Glow */}

      <div className="absolute inset-0">

        <div className="absolute left-0 top-20 h-80 w-80 rounded-full bg-rose-300/60 blur-[120px]" />

        <div className="absolute right-0 bottom-20 h-80 w-80 rounded-full bg-pink-300/55 blur-[140px]" />

        <div className="absolute left-1/2 top-24 h-3 w-3 -translate-x-1/2 animate-pulse rounded-full bg-rose-400" />

        <div className="absolute left-1/4 bottom-28 h-2 w-2 animate-pulse rounded-full bg-pink-300" />

        <div className="absolute right-1/4 top-52 h-2 w-2 animate-pulse rounded-full bg-rose-300" />

      </div>

      <div className="relative mx-auto max-w-7xl px-6">

        {/* Heading */}

        <div className="text-center">

          <p className="font-semibold uppercase tracking-[0.45em] text-rose-500">
            HOW IT WORKS
          </p>

          <div className="mt-4 flex items-center justify-center gap-4">

            <div className="h-px w-20 bg-gradient-to-r from-transparent to-rose-400" />

            <span className="text-rose-500 text-xl">♥</span>

            <div className="h-px w-20 bg-gradient-to-l from-transparent to-rose-400" />

          </div>

          <h2 className="mt-8 text-4xl font-light text-gray-900 lg:text-6xl">
            Plan Your
            <span className="font-semibold text-rose-500">
              {" "}Perfect Wedding
            </span>
            <br />
            In Four Easy Steps
          </h2>

          <p className="mx-auto mt-8 max-w-3xl text-lg leading-8 text-gray-900">
            From discovering the perfect vendors to celebrating your
            unforgettable day, we've simplified every step of your wedding
            planning journey.
          </p>

        </div>

        {/* Timeline */}

        <div className="relative mt-24">

          {/* Desktop Line */}

          <div className="absolute left-0 right-0 top-12 hidden lg:block">

            <div className="mx-auto h-1 max-w-5xl rounded-full bg-gradient-to-r from-rose-300 via-pink-400 to-rose-300" />

          </div>

          {/* Cards */}

          <div className="grid gap-16 lg:grid-cols-4">

            {steps.map((step) => (

              <StepCard
                key={step.id}
                step={step.id}
                icon={step.icon}
                title={step.title}
                description={step.description}
              />

            ))}

          </div>

        </div>

      </div>
    </section>
  );
}
