

"use client";

import { useEffect, useState } from "react";

import {
  CreateWeddingStoryDto,
  WeddingStory,
} from "@/types/wedding-story";
import StoryParagraphs from "./StoryParagraphs";
import StoryGallery from "./StoryGallery";
import ImageUploader from "@/components/common/ImageUploader";
import StoryTimeline from "./StoryTimeline";

interface WeddingStoryFormProps {
  initialData?: WeddingStory;
  onSubmit: (
    data: CreateWeddingStoryDto
  ) => Promise<void>;
  loading?: boolean;
}

const defaultForm: CreateWeddingStoryDto = {
  title: "",
  slug: "",
  location: "",
  coverImage: "",
  story: [""],
  guests: 0,
  vendors: 0,
  celebrationDays: 1,
  budget: "",
  venue: "",
  photographer: "",
  decor: "",
  featured: false,
  published: true,
  galleryImages: [],
  timeline: [],
};

export default function WeddingStoryForm({
  initialData,
  onSubmit,
  loading = false,
}: WeddingStoryFormProps) {
  const [form, setForm] =
    useState<CreateWeddingStoryDto>(defaultForm);

useEffect(() => {
  if (initialData) {
    setForm({
      title: initialData.title,
      slug: initialData.slug,
      location: initialData.location,
      coverImage: initialData.coverImage,
      story: initialData.story,
      guests: initialData.guests,
      vendors: initialData.vendors,
      celebrationDays: initialData.celebrationDays,
      budget: initialData.budget,
      venue: initialData.venue,
      photographer: initialData.photographer,
      decor: initialData.decor,
      featured: initialData.featured,
      published: initialData.published,

      // ✅ Remove id, storyId, createdAt
      galleryImages: initialData.galleryImages.map((img) => ({
        image: img.image,
        sortOrder: img.sortOrder,
      })),

      // ✅ Remove id, storyId, createdAt
      timeline: initialData.timeline.map((item) => ({
        title: item.title,
        description: item.description,
        sortOrder: item.sortOrder,
      })),
    });
  }
}, [initialData]);






  const handleChange = (
    key: keyof CreateWeddingStoryDto,
    value: any
  ) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };



  

  const submit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();
    await onSubmit(form);
  };

  return (
    <form
      onSubmit={submit}
      className="space-y-8"
    >
      {/* Basic Information */}

      <div className="rounded-3xl border border-[#ffd7df] bg-white p-8 shadow-sm">
        <h2 className="mb-6 text-xl font-bold text-[#5b2333]">
          Basic Information
        </h2>

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label className="mb-2 block font-medium text-gray-600">
              Story Title
            </label>

            <input
              value={form.title}
              onChange={(e) =>
                handleChange(
                  "title",
                  e.target.value
                )
              }
              className="w-full rounded-xl border border-[#ffd7df] p-3 text-gray-700 placeholder:text-gray-400 outline-none focus:border-[#ff4d6d]"
              placeholder="Royal Palace Wedding"
              required
            />
          </div>

          <div>
            <label className="mb-2 block font-medium text-gray-600">
              Slug
            </label>

            <input
              value={form.slug}
              onChange={(e) =>
                handleChange(
                  "slug",
                  e.target.value
                )
              }
              className="w-full rounded-xl border border-[#ffd7df] p-3 text-gray-700 placeholder:text-gray-400 outline-none focus:border-[#ff4d6d]"
              placeholder="royal-palace-wedding"
              required
            />
          </div>

          <div>
            <label className="mb-2 block font-medium text-gray-600">
              Location
            </label>

            <input
              value={form.location}
              onChange={(e) =>
                handleChange(
                  "location",
                  e.target.value
                )
              }
              className="w-full rounded-xl border border-[#ffd7df] p-3 text-gray-700 placeholder:text-gray-400 outline-none focus:border-[#ff4d6d]"
              placeholder="Jaipur"
              required
            />
          </div>

          <div>
            <label className="mb-3 block font-medium text-gray-600">
              Cover Image
            </label>

            <ImageUploader
              value={form.coverImage}
              folder="wedding-planner/stories"
              onChange={(url) =>
                handleChange("coverImage", url)
              }
            />
          </div>
        </div>
      </div>

      {/* Wedding Details */}

      <div className="rounded-3xl border border-[#ffd7df] bg-white p-8 shadow-sm">
  <h2 className="mb-2 text-xl font-bold text-[#5b2333]">
    Wedding Details
  </h2>

  <p className="mb-8 text-sm text-gray-500">
    Enter the key wedding details that will be displayed in the Wedding Highlights
    and Statistics section on the public story page.
  </p>

  <div className="grid gap-6 md:grid-cols-2">

    {/* Venue */}
    <div>
      <label className="mb-2 block text-sm font-semibold text-[#5b2333]">
        Venue Name
      </label>
      <input
        value={form.venue}
        onChange={(e) => handleChange("venue", e.target.value)}
        placeholder="e.g. Fairmont Jaipur"
        className="w-full rounded-xl border border-[#ffd7df] p-3 text-gray-700 placeholder:text-gray-400 outline-none focus:border-[#ff4d6d]"
      />
    </div>

    {/* Photographer */}
    <div>
      <label className="mb-2 block text-sm font-semibold text-[#5b2333]">
        Photographer
      </label>
      <input
        value={form.photographer}
        onChange={(e) => handleChange("photographer", e.target.value)}
        placeholder="e.g. The Wedding Files"
        className="w-full rounded-xl border border-[#ffd7df] p-3 text-gray-700 placeholder:text-gray-400 outline-none focus:border-[#ff4d6d]"
      />
    </div>

    {/* Decorator */}
    <div>
      <label className="mb-2 block text-sm font-semibold text-[#5b2333]">
        Decorator
      </label>
      <input
        value={form.decor}
        onChange={(e) => handleChange("decor", e.target.value)}
        placeholder="e.g. Floral Paradise"
        className="w-full rounded-xl border border-[#ffd7df] p-3 text-gray-700 placeholder:text-gray-400 outline-none focus:border-[#ff4d6d]"
      />
    </div>

    {/* Budget */}
    <div>
      <label className="mb-2 block text-sm font-semibold text-[#5b2333]">
        Wedding Budget
      </label>
      <input
        value={form.budget}
        onChange={(e) => handleChange("budget", e.target.value)}
        placeholder="e.g. ₹45 Lakhs"
        className="w-full rounded-xl border border-[#ffd7df] p-3 text-gray-700 placeholder:text-gray-400 outline-none focus:border-[#ff4d6d]"
      />
    </div>

    {/* Guests */}
    <div>
      <label className="mb-2 block text-sm font-semibold text-[#5b2333]">
        Total Guests
      </label>
      <input
        type="number"
        value={form.guests}
        onChange={(e) => handleChange("guests", Number(e.target.value))}
        placeholder="e.g. 500"
        className="w-full rounded-xl border border-[#ffd7df] p-3 text-gray-700 placeholder:text-gray-400 outline-none focus:border-[#ff4d6d]"
      />
    </div>

    {/* Vendors */}
    <div>
      <label className="mb-2 block text-sm font-semibold text-[#5b2333]">
        Total Vendors
      </label>
      <input
        type="number"
        value={form.vendors}
        onChange={(e) => handleChange("vendors", Number(e.target.value))}
        placeholder="e.g. 18"
        className="w-full rounded-xl border border-[#ffd7df] p-3 text-gray-700 placeholder:text-gray-400 outline-none focus:border-[#ff4d6d]"
      />
    </div>

    {/* Celebration Days */}
    <div>
      <label className="mb-2 block text-sm font-semibold text-[#5b2333]">
        Celebration Duration (Days)
      </label>
      <input
        type="number"
        value={form.celebrationDays}
        onChange={(e) =>
          handleChange("celebrationDays", Number(e.target.value))
        }
        placeholder="e.g. 3"
        className="w-full rounded-xl border border-[#ffd7df] p-3 text-gray-700 placeholder:text-gray-400 outline-none focus:border-[#ff4d6d]"
      />
    </div>

  </div>
</div>

      {/* Dynamic Sections */}

      <StoryParagraphs
        paragraphs={form.story}
        onChange={(story) =>
          handleChange("story", story)
        }
      />

      <StoryGallery
        images={form.galleryImages}
        onChange={(galleryImages) =>
          handleChange(
            "galleryImages",
            galleryImages
          )
        }
      />

      <StoryTimeline
        timeline={form.timeline}
        onChange={(timeline) =>
          handleChange("timeline", timeline)
        }
      />

      {/* Status */}

      <div className="rounded-3xl border border-[#ffd7df] bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-6 md:flex-row">
          <label className="flex items-center gap-3 text-gray-600">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(e) =>
                handleChange(
                  "featured",
                  e.target.checked
                )
              }
            />
            Featured Story
          </label>

          <label className="flex items-center gap-3 text-gray-600">
            <input
              type="checkbox"
              checked={form.published}
              onChange={(e) =>
                handleChange(
                  "published",
                  e.target.checked
                )
              }
            />
            Published
          </label>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="rounded-2xl bg-gradient-to-r from-[#ff4d6d] to-[#ffb703] px-8 py-4 font-semibold text-white shadow-lg transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading
          ? "Saving..."
          : initialData
          ? "Update Story"
          : "Create Story"}
      </button>
    </form>
  );
}