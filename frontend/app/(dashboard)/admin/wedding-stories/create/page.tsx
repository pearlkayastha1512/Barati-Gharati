"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

import WeddingStoryForm from "@/components/admin/wedding-stories/WeddingStoryForm";
import { useWeddingStoryStore } from "@/store/weddingStoryStore";
import { CreateWeddingStoryDto } from "@/types/wedding-story";

export default function CreateWeddingStoryPage() {
  const router = useRouter();

  const { createStory } = useWeddingStoryStore();

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (
    data: CreateWeddingStoryDto
  ) => {
    try {
      setLoading(true);

      await createStory(data);

      toast.success(
        "Wedding story created successfully."
      );

      router.push("/admin/wedding-stories");
    } catch (error: any) {
      toast.error(
        error?.message ??
          "Failed to create wedding story."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <Link
            href="/admin/wedding-stories"
            className="mb-4 inline-flex items-center gap-2 text-[#ff4d6d] hover:underline"
          >
            <ArrowLeft size={18} />
            Back to Wedding Stories
          </Link>

          <h1 className="text-3xl font-bold text-[#5b2333]">
            Create Wedding Story
          </h1>

          <p className="mt-2 text-[#8d6171]">
            Add a new real wedding story to your platform.
          </p>
        </div>
      </div>

      <WeddingStoryForm
        loading={loading}
        onSubmit={handleSubmit}
      />
    </div>
  );
}