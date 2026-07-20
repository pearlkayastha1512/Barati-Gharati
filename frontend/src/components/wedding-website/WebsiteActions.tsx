"use client";

import Link from "next/link";

import {
  Copy,
  ExternalLink,
  Images,
} from "lucide-react";

import { toast } from "sonner";

type Props = {
  slug: string;
  isOwner?: boolean;
};

export default function WebsiteActions({
  slug,
  isOwner = false,
}: Props) {
  const websiteUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/website/${slug}`
      : "";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(
        websiteUrl,
      );

      toast.success(
        "Wedding website link copied successfully ✨",
      );
    } catch {
      toast.error(
        "Failed to copy link",
      );
    }
  };

  return (





    <div className="mx-auto mt-16 flex max-w-7xl flex-wrap justify-end gap-4 px-6">
      {/* Manage Gallery */}

      {/* <Link
        href="/my-website/gallery"
        className="group flex items-center gap-3 rounded-2xl border border-rose-200 bg-white px-6 py-4 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-rose-300 hover:shadow-2xl"
      >
        <div className="rounded-xl bg-rose-100 p-3 text-rose-500 transition group-hover:bg-rose-500 group-hover:text-white">
          <Images size={20} />
        </div>

        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-slate-400">
            Dashboard
          </p>

          <h3 className="font-semibold text-slate-900">
            Manage Gallery
          </h3>
        </div>
      </Link> */}


{isOwner && (
  <Link
    href="/my-website/gallery"
    className="group flex items-center gap-3 rounded-2xl border border-rose-200 bg-white px-6 py-4 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-rose-300 hover:shadow-2xl"
  >
    <div className="rounded-xl bg-rose-100 p-3 text-rose-500 transition group-hover:bg-rose-500 group-hover:text-white">
      <Images size={20} />
    </div>

    <div>
      <p className="text-xs uppercase tracking-[0.25em] text-slate-400">
        Dashboard
      </p>

      <h3 className="font-semibold text-slate-900">
        Manage Gallery
      </h3>
    </div>
  </Link>
)}









      {/* View Website */}

      <Link
        href={`/website/${slug}`}
        target="_blank"
        className="group flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-6 py-4 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-2xl"
      >
        <div className="rounded-xl bg-slate-100 p-3 text-slate-700">
          <ExternalLink size={20} />
        </div>

        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-slate-400">
            Preview
          </p>

          <h3 className="font-semibold text-slate-900">
            View Website
          </h3>
        </div>
      </Link>

      {/* Copy Link */}

      <button
        onClick={handleCopy}
        className="group flex items-center gap-3 rounded-2xl border border-amber-200 bg-white px-6 py-4 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-amber-300 hover:shadow-2xl"
      >
        <div className="rounded-xl bg-amber-100 p-3 text-amber-600">
          <Copy size={20} />
        </div>

        <div className="text-left">
          <p className="text-xs uppercase tracking-[0.25em] text-slate-400">
            Share
          </p>

          <h3 className="font-semibold text-slate-900">
            Copy Link
          </h3>
        </div>
      </button>
    </div>
  );
}