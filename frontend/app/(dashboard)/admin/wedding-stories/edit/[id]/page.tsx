"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

import WeddingStoryForm from "@/components/admin/wedding-stories/WeddingStoryForm";

import { useWeddingStoryStore } from "@/store/weddingStoryStore";
import WeddingStoryFormSkeleton from "@/components/admin/wedding-stories/WeddingStoryFormSkeleton";
import {
  CreateWeddingStoryDto,
} from "@/types/wedding-story";

export default function EditWeddingStoryPage() {
  const router = useRouter();
  const params = useParams();

  const id = params.id as string;

  const {
    selectedStory,
    loading,
    fetchStory,
    updateStory,
    clearSelectedStory,
  } = useWeddingStoryStore();

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchStory(id);

    return () => {
      clearSelectedStory();
    };
  }, [id]);

 const handleSubmit = async (
  data: CreateWeddingStoryDto
) => {
  try {
    setSaving(true);

    const payload = {
      ...data,
      galleryImages: data.galleryImages.map((img) => ({
        image: img.image,
        sortOrder: img.sortOrder,
      })),
      timeline: data.timeline.map((item) => ({
        title: item.title,
        description: item.description,
        sortOrder: item.sortOrder,
      })),
    };

    const success = await updateStory(id, payload);

    if (!success) return;

    toast.success("Wedding story updated successfully.");

    router.push("/admin/wedding-stories");
  } catch (error: any) {
    toast.error(
      error?.message ?? "Failed to update wedding story."
    );
  } finally {
    setSaving(false);
  }
};

if (loading || !selectedStory) {
  return <WeddingStoryFormSkeleton />;
}

  return (
    <div className="space-y-8">
      <div>
        <Link
          href="/admin/wedding-stories"
          className="mb-4 inline-flex items-center gap-2 text-[#ff4d6d] hover:underline"
        >
          <ArrowLeft size={18} />
          Back to Wedding Stories
        </Link>

        <h1 className="text-3xl font-bold text-[#5b2333]">
          Edit Wedding Story
        </h1>

        <p className="mt-2 text-[#8d6171]">
          Update wedding story details.
        </p>
      </div>

      <WeddingStoryForm
        initialData={selectedStory}
        loading={saving}
        onSubmit={handleSubmit}
      />
    </div>
  );
}