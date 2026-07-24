"use client";

import Image from "next/image";
import Link from "next/link";

import {
  Edit,
  Trash2,
  Eye,
  Star,
  StarOff,
  CheckCircle2,
  XCircle,
} from "lucide-react";

import { WeddingStory } from "@/types/wedding-story";
import { useWeddingStoryStore } from "@/store/weddingStoryStore";

interface Props {
  stories: WeddingStory[];
  loading: boolean;
}

export default function WeddingStoriesTable({
  stories,
  loading,
}: Props) {
  const {
    deleteStory,
    toggleFeatured,
    togglePublished,
  } = useWeddingStoryStore();

  if (loading) {
    return (
      <div className="flex h-60 items-center justify-center">
        <p className="text-gray-500">
          Loading wedding stories...
        </p>
      </div>
    );
  }

  if (!stories.length) {
    return (
      <div className="flex h-72 flex-col items-center justify-center rounded-3xl border-2 border-dashed border-[#ffd5dd]">
        <h3 className="text-xl font-semibold text-[#5b2333]">
          No Wedding Stories
        </h3>

        <p className="mt-2 text-gray-500">
          Click "Add Story" to create your first
          wedding story.
        </p>

        <Link
          href="/admin/wedding-stories/create"
          className="mt-6 rounded-2xl bg-gradient-to-r from-[#ff4d6d] to-[#ffb703] px-6 py-3 font-semibold text-white"
        >
          Create Story
        </Link>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full">
        <thead>
          <tr className="border-b border-[#ffe2e8] text-left text-gray-600">
            <th className="px-4 py-4 font-semibold">
              Cover
            </th>
            <th className="px-4 py-4 font-semibold">
              Title
            </th>
            <th className="px-4 py-4 font-semibold">
              Location
            </th>
            <th className="px-4 py-4 font-semibold">
              Guests
            </th>
            <th className="px-4 py-4 font-semibold">
              Featured
            </th>
            <th className="px-4 py-4 font-semibold">
              Published
            </th>
            <th className="px-4 py-4 font-semibold">
              Actions
            </th>
          </tr>
        </thead>

        <tbody>
          {stories.map((story) => (
            <tr
              key={story.id}
              className="border-b border-[#fff0f3] transition hover:bg-[#fff9fa]"
            >
              <td className="px-4 py-4">
                <div className="relative h-20 w-28 overflow-hidden rounded-2xl">
                  <Image
                    src={story.coverImage}
                    alt={story.title}
                    fill
                    className="object-cover"
                  />
                </div>
              </td>

              <td className="px-4 py-4">
                <h3 className="font-semibold text-gray-700">
                  {story.title}
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  {story.venue}
                </p>
              </td>

              <td className="px-4 py-4 text-gray-600">
                {story.location}
              </td>

              <td className="px-4 py-4 text-gray-600">
                {story.guests}
              </td>

              <td className="px-4 py-4">
                <button
                  onClick={() =>
                    toggleFeatured(story.id)
                  }
                  className={`rounded-full p-2 transition ${
                    story.featured
                      ? "bg-yellow-100 text-yellow-600"
                      : "bg-gray-100 text-gray-400"
                  }`}
                >
                  {story.featured ? (
                    <Star
                      size={18}
                      fill="currentColor"
                    />
                  ) : (
                    <StarOff size={18} />
                  )}
                </button>
              </td>

              <td className="px-4 py-4">
                <button
                  onClick={() =>
                    togglePublished(story.id)
                  }
                  className={`rounded-full p-2 transition ${
                    story.published
                      ? "bg-green-100 text-green-600"
                      : "bg-red-100 text-red-500"
                  }`}
                >
                  {story.published ? (
                    <CheckCircle2 size={18} />
                  ) : (
                    <XCircle size={18} />
                  )}
                </button>
              </td>

              <td className="px-4 py-4">
                <div className="flex items-center gap-3">
                  <Link
                    href={`/stories/${story.slug}`}
                    target="_blank"
                    className="rounded-xl bg-blue-50 p-2 text-blue-600 transition hover:bg-blue-100"
                    title="Preview"
                  >
                    <Eye size={18} />
                  </Link>

                  <Link
                    href={`/admin/wedding-stories/edit/${story.id}`}
                    className="rounded-xl bg-amber-50 p-2 text-amber-600 transition hover:bg-amber-100"
                    title="Edit"
                  >
                    <Edit size={18} />
                  </Link>

                  <button
                    onClick={() =>
                      deleteStory(story.id)
                    }
                    className="rounded-xl bg-red-50 p-2 text-red-600 transition hover:bg-red-100"
                    title="Delete"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}