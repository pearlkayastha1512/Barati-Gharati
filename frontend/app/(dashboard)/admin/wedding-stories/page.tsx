"use client";

import { useEffect } from "react";
import Link from "next/link";

import { Plus, BookOpen } from "lucide-react";

import { useWeddingStoryStore } from "@/store/weddingStoryStore";

import WeddingStoriesTable from "@/components/admin/wedding-stories/WeddingStoriesTable";

export default function WeddingStoriesPage() {
  const {
    stories,
    loading,
    fetchStories,
  } = useWeddingStoryStore();

  useEffect(() => {
    fetchStories();
  }, [fetchStories]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-5 rounded-3xl border border-[#ffd5dd] bg-white p-8 shadow-sm lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-r from-[#ff4d6d] to-[#ffb703] text-white shadow-lg">
            <BookOpen size={28} />
          </div>

          <h1 className="text-3xl font-bold text-[#5b2333]">
            Wedding Stories
          </h1>

          <p className="mt-2 text-[#8d6171]">
            Manage real wedding stories displayed on your platform.
          </p>
        </div>

        <Link
          href="/admin/wedding-stories/create"
          className="inline-flex items-center gap-3 rounded-2xl bg-gradient-to-r from-[#ff4d6d] to-[#ffb703] px-6 py-3 font-semibold text-white shadow-lg transition hover:scale-105"
        >
          <Plus size={20} />

          Add Story
        </Link>
      </div>

      {/* Stats */}
      <div className="grid gap-5 md:grid-cols-3">
        <div className="rounded-3xl border border-[#ffd7df] bg-white p-6 shadow-sm">
          <p className="text-sm text-[#8d6171]">
            Total Stories
          </p>

          <h2 className="mt-2 text-4xl font-bold text-[#ff4d6d]">
            {stories.length}
          </h2>
        </div>

        <div className="rounded-3xl border border-[#ffd7df] bg-white p-6 shadow-sm">
          <p className="text-sm text-[#8d6171]">
            Published
          </p>

          <h2 className="mt-2 text-4xl font-bold text-emerald-600">
            {
              stories.filter(
                (story) => story.published
              ).length
            }
          </h2>
        </div>

        <div className="rounded-3xl border border-[#ffd7df] bg-white p-6 shadow-sm">
          <p className="text-sm text-[#8d6171]">
            Featured
          </p>

          <h2 className="mt-2 text-4xl font-bold text-amber-500">
            {
              stories.filter(
                (story) => story.featured
              ).length
            }
          </h2>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-3xl border border-[#ffd7df] bg-white p-6 shadow-sm">
        <WeddingStoriesTable
          stories={stories}
          loading={loading}
        />
      </div>
    </div>
  );
}