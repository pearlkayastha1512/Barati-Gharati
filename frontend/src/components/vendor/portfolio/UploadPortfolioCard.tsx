
"use client";

import { UploadCloud } from "lucide-react";

interface UploadPortfolioCardProps {
  onCreate: () => void;
}

export default function UploadPortfolioCard({
  onCreate,
}: UploadPortfolioCardProps) {
  return (
    <section className="rounded-3xl border-2 border-dashed border-[#ffc43d] bg-[#fff8ef] p-12 text-center">
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#ffe1ec]">
        <UploadCloud
          size={36}
          className="text-[#e4005a]"
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
        className="mt-8 rounded-2xl bg-[#e4005a] px-8 py-4 font-semibold text-white transition hover:bg-[#c8004e]"
      >
        Upload Portfolio
      </button>
    </section>
  );
}