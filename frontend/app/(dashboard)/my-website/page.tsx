"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import {
  Copy,
  ExternalLink,
  Images,
  Globe,
  Sparkles,
  ImagePlus,
} from "lucide-react";

import { toast } from "sonner";

import {
  getMyWeddingWebsite,
  updateWeddingWebsite,
} from "@/services/api/wedding-website.api";

import { uploadToCloudinary } from "@/lib/cloudinary";

export default function MyWebsitePage() {
  const [website, setWebsite] =
    useState<any>(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    const fetchWebsite =
      async () => {
        try {
          const data =
            await getMyWeddingWebsite();

          setWebsite(data);
        } catch {
          toast.error(
            "Unable to load website",
          );
        } finally {
          setLoading(false);
        }
      };

    fetchWebsite();
  }, []);

  const handleCopyLink =
    async () => {
      if (!website) return;

      const url = `${window.location.origin}/website/${website.slug}`;

      await navigator.clipboard.writeText(
        url,
      );

      toast.success(
        "Website link copied ✨",
      );
    };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#faf7f5]">
        <p className="text-lg text-slate-500">
          Loading your wedding website...
        </p>
      </div>
    );
  }

  if (!website) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#faf7f5]">
        <div className="rounded-3xl bg-white p-10 shadow-xl">
          <h2 className="font-serif text-3xl text-slate-900">
            No Website Found
          </h2>

          <p className="mt-3 text-slate-500">
            Create your wedding website first.
          </p>
        </div>
      </div>
    );
  }
const handleImageUpload = async (
  file: File,
  type: "hero" | "story",
) => {
  try {
    toast.loading("Uploading image...", {
      id: "upload-image",
    });

    const imageUrl =
      await uploadToCloudinary(file);

    await updateWeddingWebsite({
      heroImage:
        type === "hero"
          ? imageUrl
          : website.heroImage,

      coverImage:
        type === "story"
          ? imageUrl
          : website.coverImage,
    });

    setWebsite((prev: any) => ({
      ...prev,
      heroImage:
        type === "hero"
          ? imageUrl
          : prev.heroImage,

      coverImage:
        type === "story"
          ? imageUrl
          : prev.coverImage,
    }));

    toast.success(
      `${
        type === "hero"
          ? "Hero"
          : "Story"
      } image updated ✨`,
      {
        id: "upload-image",
      }
    );
  } catch {
    toast.error(
      "Failed to upload image",
      {
        id: "upload-image",
      }
    );
  }
};
  return (
  <div className="relative min-h-screen overflow-hidden bg-[#fffaf7] px-6 py-16">
    {/* Background */}

    <div className="absolute left-[-150px] top-[-100px] h-[28rem] w-[28rem] rounded-full bg-rose-200/30 blur-3xl" />

    <div className="absolute bottom-[-180px] right-[-150px] h-[32rem] w-[32rem] rounded-full bg-pink-200/30 blur-3xl" />

    <div className="absolute left-1/2 top-20 -translate-x-1/2 text-rose-100 opacity-60">
      <span className="text-[250px]">💍</span>
    </div>

    <div className="relative mx-auto max-w-7xl">
      {/* Hero */}

      <div className="overflow-hidden rounded-[40px] border border-white/60 bg-white/70 p-10 shadow-[0_25px_90px_rgba(0,0,0,0.08)] backdrop-blur-xl md:p-14">
        <div className="text-center">
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-rose-100 to-pink-100 shadow-xl">
            <Sparkles className="h-10 w-10 text-rose-500" />
          </div>

          <p className="mt-6 text-xs uppercase tracking-[0.7em] text-rose-500">
            Wedding Dashboard
          </p>

          <h1 className="mt-5 font-serif text-5xl text-slate-900 md:text-7xl">
            {website.groomName}{" "}
            <span className="text-rose-400">
              &
            </span>{" "}
            {website.brideName}
          </h1>

          <p className="mx-auto mt-6 max-w-3xl text-lg leading-9 text-slate-600">
            Manage your wedding website,
            upload memories, share your
            special day, and customize
            every detail beautifully.
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <div className="rounded-full bg-rose-50 px-5 py-3 shadow-md">
              💍 Wedding
            </div>

            <div className="rounded-full bg-pink-50 px-5 py-3 shadow-md">
              📸 Memories
            </div>

            <div className="rounded-full bg-amber-50 px-5 py-3 shadow-md">
              ❤️ Love Story
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Cards */}

      <div className="mt-14 grid gap-8 md:grid-cols-2 xl:grid-cols-6">
        {/* Gallery */}

        <Link
          href="/my-website/gallery"
          className="group rounded-[32px] bg-white p-8 shadow-[0_20px_70px_rgba(0,0,0,0.08)] transition-all duration-500 hover:-translate-y-3 hover:shadow-2xl"
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-100 text-rose-500 transition-all duration-300 group-hover:bg-rose-500 group-hover:text-white">
            <Images size={30} />
          </div>

          <h3 className="mt-8 font-serif text-3xl text-slate-900">
            Gallery
          </h3>

          <p className="mt-3 leading-7 text-slate-500">
            Upload and manage all your
            wedding memories.
          </p>
        </Link>

        {/* Website */}

        <Link
          href={`/website/${website.slug}`}
          target="_blank"
          className="group rounded-[32px] bg-white p-8 shadow-[0_20px_70px_rgba(0,0,0,0.08)] transition-all duration-500 hover:-translate-y-3 hover:shadow-2xl"
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-700 transition-all duration-300 group-hover:bg-slate-900 group-hover:text-white">
            <ExternalLink size={30} />
          </div>

          <h3 className="mt-8 font-serif text-3xl text-slate-900">
            Website
          </h3>

          <p className="mt-3 leading-7 text-slate-500">
            Preview your public wedding
            page.
          </p>
        </Link>



        {/* Hero Image */}

<label className="group cursor-pointer rounded-[32px] bg-white p-8 shadow-[0_20px_70px_rgba(0,0,0,0.08)] transition-all duration-500 hover:-translate-y-3 hover:shadow-2xl">
  <input
    type="file"
    accept="image/*"
    className="hidden"
    onChange={(e) => {
      const file =
        e.target.files?.[0];

      if (file) {
        handleImageUpload(
          file,
          "hero",
        );
      }
    }}
  />

  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-pink-100 text-pink-500 transition-all duration-300 group-hover:bg-pink-500 group-hover:text-white">
    <ImagePlus size={30} />
  </div>

  <h3 className="mt-8 font-serif text-3xl text-slate-900">
    Hero Image
  </h3>

  <p className="mt-3 leading-7 text-slate-500">
    Change your website banner.
  </p>
</label>

{/* Story Image */}

<label className="group cursor-pointer rounded-[32px] bg-white p-8 shadow-[0_20px_70px_rgba(0,0,0,0.08)] transition-all duration-500 hover:-translate-y-3 hover:shadow-2xl">
  <input
    type="file"
    accept="image/*"
    className="hidden"
    onChange={(e) => {
      const file =
        e.target.files?.[0];

      if (file) {
        handleImageUpload(
          file,
          "story",
        );
      }
    }}
  />

  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-100 text-violet-500 transition-all duration-300 group-hover:bg-violet-500 group-hover:text-white">
    <ImagePlus size={30} />
  </div>

  <h3 className="mt-8 font-serif text-3xl text-slate-900">
    Story Image
  </h3>

  <p className="mt-3 leading-7 text-slate-500">
    Update your love story photo.
  </p>
</label>

        {/* Copy */}

        <button
          onClick={handleCopyLink}
          className="group rounded-[32px] bg-white p-8 text-left shadow-[0_20px_70px_rgba(0,0,0,0.08)] transition-all duration-500 hover:-translate-y-3 hover:shadow-2xl"
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-100 text-amber-600 transition-all duration-300 group-hover:bg-amber-500 group-hover:text-white">
            <Copy size={30} />
          </div>

          <h3 className="mt-8 font-serif text-3xl text-slate-900">
            Share
          </h3>

          <p className="mt-3 leading-7 text-slate-500">
            Copy and share your wedding
            link instantly.
          </p>
        </button>

        {/* Status */}

        <div className="rounded-[32px] bg-white p-8 shadow-[0_20px_70px_rgba(0,0,0,0.08)]">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600">
            <Globe size={30} />
          </div>

          <h3 className="mt-8 font-serif text-3xl text-slate-900">
            Status
          </h3>

          <p className="mt-3 text-slate-500">
            {website.isPublished
              ? "Your website is live."
              : "Your website is private."}
          </p>

          <div
            className={`mt-6 inline-flex rounded-full px-5 py-2 text-sm font-semibold ${
              website.isPublished
                ? "bg-emerald-100 text-emerald-700"
                : "bg-slate-100 text-slate-700"
            }`}
          >
            {website.isPublished
              ? "🌍 Published"
              : "🔒 Private"}
          </div>
        </div>
      </div>

      {/* Upcoming */}

     {/* Love Quote Section */}

<div className="mt-16 overflow-hidden rounded-[36px] border border-rose-100 bg-white/80 p-12 shadow-[0_20px_70px_rgba(0,0,0,0.06)] backdrop-blur-xl">
  {/* Top decoration */}

  <div className="flex justify-center gap-6 text-4xl text-rose-400">
    <span>❦</span>
    <span>💍</span>
    <span>❦</span>
  </div>

  <div className="mt-10 text-center">
    <p className="text-xs uppercase tracking-[0.5em] text-rose-500">
      Forever Begins
    </p>

    <h2 className="mt-6 font-serif text-4xl leading-tight text-slate-900 md:text-5xl">
      “Two souls with but a single
      thought, two hearts that beat
      as one.”
    </h2>

    <p className="mt-6 text-lg italic text-slate-500">
      Celebrating love, laughter,
      and happily ever after.
    </p>
  </div>

  {/* Symbols */}

  <div className="mt-12 flex flex-wrap justify-center gap-8 text-center">
    <div>
      <div className="text-5xl">🤍</div>

      <p className="mt-3 text-sm uppercase tracking-[0.25em] text-slate-500">
        Love
      </p>
    </div>

    <div>
      <div className="text-5xl">✨</div>

      <p className="mt-3 text-sm uppercase tracking-[0.25em] text-slate-500">
        Memories
      </p>
    </div>

    <div>
      <div className="text-5xl">🌸</div>

      <p className="mt-3 text-sm uppercase tracking-[0.25em] text-slate-500">
        Together
      </p>
    </div>

    <div>
      <div className="text-5xl">🕊️</div>

      <p className="mt-3 text-sm uppercase tracking-[0.25em] text-slate-500">
        Forever
      </p>
    </div>
  </div>

  {/* Bottom divider */}

  <div className="mt-12 flex justify-center text-3xl text-rose-300">
    ✦ ✦ ✦
  </div>
</div>
    </div>
  </div>
);
}