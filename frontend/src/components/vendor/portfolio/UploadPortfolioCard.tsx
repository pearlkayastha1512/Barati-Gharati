
"use client";

import { UploadCloud } from "lucide-react";

interface UploadPortfolioCardProps {
  onCreate: () => void;
}

export default function UploadPortfolioCard({
  onCreate,
}: UploadPortfolioCardProps) {
  return (
    <section className="rounded-3xl border-2 border-dashed border-violet-300 bg-violet-50 p-12 text-center">
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-violet-100">
        <UploadCloud
          size={36}
          className="text-violet-700"
        />
      </div>

      <h2 className="mt-6 text-3xl font-bold text-gray-700">
        Upload New Work
      </h2>

      <p className="mx-auto mt-4 max-w-xl text-gray-500">
        Showcase your latest wedding projects with
        high-quality photos and videos.
      </p>

      <button
        onClick={onCreate}
        className="mt-8 rounded-2xl bg-violet-700 px-8 py-4 font-semibold text-white transition hover:bg-violet-800"
      >
        Upload Portfolio
      </button>
    </section>
  );
}