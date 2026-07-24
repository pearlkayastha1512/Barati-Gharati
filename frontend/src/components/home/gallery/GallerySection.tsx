"use client";

import { useEffect } from "react";

import GalleryCard from "./GalleryCard";

import { useWeddingStoryStore } from "@/store/weddingStoryStore";

export default function GallerySection() {
  const {
    homeStories,
    fetchHomeStories,
    loading,
  } = useWeddingStoryStore();

  useEffect(() => {
    fetchHomeStories();
  }, []);

  if (loading && homeStories.length === 0) {
    return (
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-[360px] animate-pulse rounded-[30px] bg-pink-100"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative overflow-hidden bg-[linear-gradient(145deg,#f5d0c8_0%,#e8a2b5_48%,#f8ddd0_100%)] py-24">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute left-0 top-20 h-72 w-72 rounded-full bg-rose-400/35 blur-[120px]" />
        <div className="absolute bottom-10 right-0 h-72 w-72 rounded-full bg-pink-400/30 blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6">
        <div className="mb-16 text-center">
          <p className="font-semibold uppercase tracking-[0.4em] text-rose-500">
            WEDDING INSPIRATION
          </p>

          <h2 className="mt-6 text-4xl font-bold text-gray-900 lg:text-6xl">
            Real Wedding
            <span className="text-rose-500">
              {" "}
              Stories
            </span>
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-600">
            Discover breathtaking weddings,
            beautiful venues and unforgettable
            celebrations.
          </p>
        </div>

        <div className="columns-1 gap-6 sm:columns-2 lg:columns-3">
          {homeStories.map((story) => (
            <div
              key={story.id}
              className="mb-6 break-inside-avoid"
            >
              <GalleryCard
                slug={story.slug}
                image={story.coverImage}
                title={story.title}
                location={story.location}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}