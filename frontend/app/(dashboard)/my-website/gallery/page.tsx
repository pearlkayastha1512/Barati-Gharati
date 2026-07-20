"use client";

import WeddingGalleryManager from "@/components/wedding-website/WeddingGalleryManager";

export default function GalleryPage() {
  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="mx-auto max-w-7xl">
        <h1 className="text-4xl font-bold text-slate-900">
          Manage Gallery
        </h1>

        <p className="mt-2 text-slate-500">
          Upload and organize your wedding memories.
        </p>

        <div className="mt-10">
          <WeddingGalleryManager />
        </div>
      </div>
    </div>
  );
}