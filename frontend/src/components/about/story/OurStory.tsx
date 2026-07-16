import Image from "next/image";
import { Award, HeartHandshake, Sparkles } from "lucide-react";

export default function OurStory() {
  return (
    <section className="relative overflow-hidden bg-[linear-gradient(135deg,#edb2bc_0%,#f1c5bc_52%,#dc91a8_100%)] py-24">

      {/* Background Glow */}

      <div className="absolute -left-40 top-20 h-[420px] w-[420px] rounded-full bg-rose-400/35 blur-[150px]" />

      <div className="absolute -right-40 bottom-0 h-[420px] w-[420px] rounded-full bg-pink-400/30 blur-[150px]" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-20 px-6 lg:grid-cols-2">

        {/* LEFT */}

        <div>

          <p className="font-semibold uppercase tracking-[0.4em] text-rose-500">
            OUR STORY
          </p>

          <h2 className="mt-6 text-4xl font-bold leading-tight text-gray-900 lg:text-5xl">

            Every Beautiful
            <span className="block text-rose-500">
              Wedding Begins
            </span>
            With A Dream.

          </h2>

          <p className="mt-8 text-lg leading-9 text-gray-600">

            WedPlan was created with one simple mission —
            to make wedding planning effortless, transparent,
            and joyful for every couple.

          </p>

          <p className="mt-6 text-lg leading-9 text-gray-600">

            From discovering trusted vendors to managing budgets,
            guest lists, bookings and timelines,
            everything is designed to help couples enjoy
            every moment leading up to their special day.

          </p>

          {/* Features */}

          <div className="mt-10 space-y-6">

            <div className="flex gap-4">

              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-100">

                <HeartHandshake
                  className="text-rose-500"
                  size={26}
                />

              </div>

              <div>

                <h3 className="text-xl font-semibold text-gray-900">
                  Trusted Relationships
                </h3>

                <p className="mt-2 text-gray-600">
                  Connecting couples with verified wedding professionals.
                </p>

              </div>

            </div>

            <div className="flex gap-4">

              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-100">

                <Award
                  className="text-rose-500"
                  size={26}
                />

              </div>

              <div>

                <h3 className="text-xl font-semibold text-gray-900">
                  Premium Quality
                </h3>

                <p className="mt-2 text-gray-600">
                  Carefully selected vendors delivering unforgettable experiences.
                </p>

              </div>

            </div>

            <div className="flex gap-4">

              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-100">

                <Sparkles
                  className="text-rose-500"
                  size={26}
                />

              </div>

              <div>

                <h3 className="text-xl font-semibold text-gray-900">
                  Beautiful Experiences
                </h3>

                <p className="mt-2 text-gray-600">
                  Every celebration deserves thoughtful planning and lasting memories.
                </p>

              </div>

            </div>

          </div>

        </div>

        {/* RIGHT */}

        <div className="relative">

          <div className="overflow-hidden rounded-[36px] shadow-[0_35px_80px_rgba(0,0,0,.15)]">

            <Image
              src="/images/about-story.jpg"
              alt="Wedding Story"
              width={900}
              height={1200}
              className="h-[720px] w-full object-cover transition duration-700 hover:scale-105"
            />

          </div>

          {/* Floating Card */}

          <div
            className="
            absolute
            -bottom-8
            left-8
            rounded-3xl
            border
            border-white/60
            bg-white/95
            p-8
            shadow-2xl
            backdrop-blur-md
            "
          >

            <p className="text-sm uppercase tracking-[0.3em] text-rose-500">
              Since
            </p>

            <h3 className="mt-2 text-5xl font-bold text-gray-900">
              2026
            </h3>

            <p className="mt-3 text-gray-600">
              Building unforgettable wedding experiences across India.
            </p>

          </div>

        </div>

      </div>

    </section>
  );
}
