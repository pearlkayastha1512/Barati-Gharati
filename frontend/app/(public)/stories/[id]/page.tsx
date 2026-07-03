import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

import { gallery } from "@/components/home/gallery/gallery-data";

interface StoryPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function StoryPage({
  params,
}: StoryPageProps) {
  const { id } = await params;

  const story = gallery.find(
    (item) => item.id === Number(id)
  );

  if (!story) {
    notFound();
  }

 return (
  <main className="overflow-hidden bg-white">
    {/* ================= HERO ================= */}

    <section className="relative h-[88vh] min-h-[700px] overflow-hidden">
      <Image
        src={story.image}
        alt={story.title}
        fill
        priority
        className="object-cover object-center"
      />

      {/* Luxury Overlay */}

      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-black/20" />

      <div className="absolute inset-0 bg-gradient-to-r from-black/45 via-transparent to-transparent" />

      {/* Hero Content */}

      <div className="absolute inset-0 flex items-end">
        <div className="mx-auto flex w-full max-w-7xl items-end justify-between px-6 pb-24">

          <div className="max-w-3xl">

            <p className="text-sm font-semibold uppercase tracking-[0.45em] text-rose-300">
              REAL WEDDING STORY
            </p>

            <h1 className="mt-5 text-6xl font-black leading-tight text-white lg:text-7xl">
              {story.title}
            </h1>

            <div className="mt-6 flex items-center gap-3 text-xl text-gray-200">
              <span className="text-rose-400">📍</span>
              {story.location}
            </div>

          </div>

        </div>
      </div>
    </section>

    {/* ================= QUICK STATS ================= */}

    <section className="-mt-16 relative z-20">
      <div className="mx-auto grid max-w-6xl gap-6 rounded-[32px] bg-white p-10 shadow-2xl md:grid-cols-4">

        <div className="text-center">
          <p className="text-4xl font-black text-rose-500">
  {story.guests}+
</p>

          <p className="mt-2 text-gray-600">
            Guests
          </p>
        </div>

        <div className="text-center">
          <p className="text-4xl font-black text-rose-500">
            {story.vendors}
          </p>

          <p className="mt-2 text-gray-600">
            Vendors
          </p>
        </div>

        <div className="text-center">
          <p className="text-4xl font-black text-rose-500">
  {story.celebrationDays} Days
</p>

          <p className="mt-2 text-gray-600">
            Celebration
          </p>
        </div>

        <div className="text-center">
        <p className="text-4xl font-black text-rose-500">
  {story.budget}
</p>

          <p className="mt-2 text-gray-600">
            Budget
          </p>
        </div>

      </div>
    </section>

    {/* ================= STORY ================= */}

    <section className="py-28">

      <div className="mx-auto grid max-w-7xl gap-20 px-6 lg:grid-cols-[1.2fr_.8fr]">

        {/* LEFT */}

        <div>

          <p className="font-semibold uppercase tracking-[0.35em] text-rose-500">
            THEIR STORY
          </p>

          <h2 className="mt-5 text-5xl font-bold text-gray-900">
            Their Beautiful Journey
          </h2>

          <div className="mt-10 space-y-8 text-lg leading-9 text-gray-600">

<div className="mt-10 space-y-8 text-lg leading-9 text-gray-600">
  {story.story.map((paragraph, index) => (
    <p key={index}>{paragraph}</p>
  ))}
</div>

          </div>

        </div>

        {/* RIGHT */}

        <div className="rounded-[36px] bg-gradient-to-br from-rose-50 to-white p-10 shadow-xl">

          <h3 className="text-3xl font-bold text-gray-900">
            Wedding Highlights
          </h3>

          <div className="mt-10 space-y-8">

            <div className="flex items-center justify-between border-b pb-4">
              <span className="text-gray-500">
                Venue
              </span>

              <span className="font-semibold text-rose-500">
                {story.highlights.venue}
              </span>
            </div>

            <div className="flex items-center justify-between border-b pb-4">
              <span className="text-gray-500">
                Photographer
              </span>

              <span className="font-semibold text-rose-500">
               {story.highlights.photographer}
              </span>
            </div>

            <div className="flex items-center justify-between border-b pb-4">
              <span className="text-gray-500">
                Decor
              </span>

              <span className="font-semibold text-rose-500">
                {story.highlights.decor}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-500">
                Budget
              </span>

              <span className="font-semibold text-rose-500">
                {story.highlights.budget}
              </span>
            </div>

          </div>

        </div>

      </div>

    </section>


        {/* ================= WEDDING GALLERY ================= */}

    <section className="bg-rose-50 py-28">

      <div className="mx-auto max-w-7xl px-6">

        <div className="text-center">

          <p className="font-semibold uppercase tracking-[0.35em] text-rose-500">
            WEDDING GALLERY
          </p>

          <h2 className="mt-4 text-5xl font-bold text-gray-900">
            Captured Moments
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-gray-600">
            Every smile, every ritual and every emotion beautifully preserved
            forever.
          </p>

        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">

          <div className="relative h-[260px] overflow-hidden rounded-[28px]">
            <Image
              src={story.image}
              alt={story.title}
              fill
              className="object-cover transition duration-700 hover:scale-110"
            />
          </div>

          <div className="relative h-[260px] overflow-hidden rounded-[28px]">
            <Image
              src={story.image}
              alt={story.title}
              fill
              className="object-cover transition duration-700 hover:scale-110"
            />
          </div>

          <div className="relative h-[260px] overflow-hidden rounded-[28px]">
            <Image
              src={story.image}
              alt={story.title}
              fill
              className="object-cover transition duration-700 hover:scale-110"
            />
          </div>

          <div className="relative h-[260px] overflow-hidden rounded-[28px] md:col-span-2">
            <Image
              src={story.image}
              alt={story.title}
              fill
              className="object-cover transition duration-700 hover:scale-110"
            />
          </div>

          <div className="relative h-[260px] overflow-hidden rounded-[28px]">
            <Image
              src={story.image}
              alt={story.title}
              fill
              className="object-cover transition duration-700 hover:scale-110"
            />
          </div>

        </div>

      </div>

    </section>

    {/* ================= WEDDING TIMELINE ================= */}

    <section className="py-28">

      <div className="mx-auto max-w-6xl px-6">

        <div className="text-center">

          <p className="font-semibold uppercase tracking-[0.35em] text-rose-500">
            THE JOURNEY
          </p>

          <h2 className="mt-4 text-5xl font-bold text-gray-900">
            Wedding Timeline
          </h2>

        </div>

        <div className="relative mt-20">

          <div className="absolute left-1/2 top-0 hidden h-full w-1 -translate-x-1/2 rounded-full bg-rose-100 lg:block" />

          <div className="space-y-12">

            {[
              {
                title: "Engagement",
                text: "The journey began with a beautiful engagement ceremony surrounded by family.",
              },
              {
                title: "Venue Selection",
                text: "A luxurious palace venue was chosen to host the grand celebration.",
              },
              {
                title: "Wedding Ceremony",
                text: "Traditional rituals blended with elegant décor created unforgettable memories.",
              },
              {
                title: "Reception",
                text: "A glamorous evening of celebration, music and heartfelt moments.",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="relative rounded-[28px] border border-rose-100 bg-white p-8 shadow-lg lg:w-[46%] even:ml-auto"
              >
                <div className="absolute -left-3 top-10 hidden h-6 w-6 rounded-full border-4 border-white bg-rose-500 lg:block even:left-auto even:-right-3" />

                <h3 className="text-2xl font-bold text-gray-900">
                  {item.title}
                </h3>

                <p className="mt-4 leading-8 text-gray-600">
                  {item.text}
                </p>

              </div>
            ))}

          </div>

        </div>

      </div>

    </section>


        {/* ================= LUXURY CTA ================= */}

    <section className="pb-28">

      <div className="mx-auto max-w-6xl px-6">

        <div className="overflow-hidden rounded-[40px] bg-gradient-to-r from-[#2b0f12] via-[#40161c] to-[#5a1f2a] p-12 text-white shadow-[0_25px_80px_rgba(236,72,153,.25)]">

          <div className="grid items-center gap-10 lg:grid-cols-[1fr_auto]">

            <div>

              <p className="font-semibold uppercase tracking-[0.35em] text-rose-300">
                INSPIRED BY THIS WEDDING?
              </p>

              <h2 className="mt-5 text-5xl font-bold leading-tight">
                Plan Your Dream Wedding
                <br />
                With India's Best Vendors
              </h2>

              <p className="mt-6 max-w-2xl text-lg leading-8 text-rose-100">
                Discover verified photographers, decorators, makeup artists,
                venues and planners who can transform your dream wedding into
                reality.
              </p>

            </div>

            <div className="flex flex-col gap-4">

              <Link
                href="/vendors"
                className="rounded-full bg-gradient-to-r from-rose-500 to-pink-500 px-10 py-4 text-center font-semibold text-white transition duration-300 hover:scale-105"
              >
                Explore Vendors →
              </Link>

              <Link
                href="/contact"
                className="rounded-full border border-white/30 px-10 py-4 text-center font-semibold transition hover:bg-white/10"
              >
                Talk To Our Experts
              </Link>

            </div>

          </div>

        </div>

      </div>

    </section>

    {/* ================= MORE STORIES ================= */}

    <section className="bg-rose-50 py-24">

      <div className="mx-auto max-w-7xl px-6">

        <div className="flex items-center justify-between">

          <div>

            <p className="font-semibold uppercase tracking-[0.35em] text-rose-500">
              MORE STORIES
            </p>

            <h2 className="mt-3 text-4xl font-bold text-gray-900">
              Explore More Real Weddings
            </h2>

          </div>

          <Link
            href="/gallery"
            className="hidden rounded-full border border-rose-200 px-6 py-3 font-semibold text-rose-500 transition hover:bg-rose-500 hover:text-white md:inline-flex"
          >
            View All
          </Link>

        </div>

        <div className="mt-14 grid gap-8 md:grid-cols-3">

          {gallery
            .filter((item) => item.id !== story.id)
            .slice(0, 3)
            .map((item) => (
              <Link
                key={item.id}
                href={`/gallery/${item.id}`}
                className="group overflow-hidden rounded-[30px] bg-white shadow-xl transition duration-300 hover:-translate-y-2"
              >
                <div className="relative h-72 overflow-hidden">

                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover transition duration-700 group-hover:scale-110"
                  />

                </div>

                <div className="p-6">

                  <p className="text-sm uppercase tracking-[0.25em] text-rose-500">
                    {item.location}
                  </p>

                  <h3 className="mt-3 text-2xl font-bold text-gray-900">
                    {item.title}
                  </h3>

                </div>

              </Link>
            ))}

        </div>

        <div className="mt-14 text-center">

          <Link
            href="/gallery"
            className="inline-flex rounded-full bg-gradient-to-r from-rose-500 to-pink-500 px-8 py-4 font-semibold text-white transition hover:scale-105"
          >
            Browse All Wedding Stories
          </Link>

        </div>

      </div>

    </section>

  </main>
);
}
    
