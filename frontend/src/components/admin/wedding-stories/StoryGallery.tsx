"use client";

import { Plus, Trash2 } from "lucide-react";

import ImageUploader from "@/components/common/ImageUploader";
import { WeddingStoryImage } from "@/types/wedding-story";

interface Props {
  images: WeddingStoryImage[];
  onChange: (images: WeddingStoryImage[]) => void;
}

export default function StoryGallery({
  images,
  onChange,
}: Props) {
  const addImage = () => {
    onChange([
      ...images,
      {
        image: "",
        sortOrder: images.length,
      },
    ]);
  };

  const updateImage = (
    index: number,
    value: string
  ) => {
    const updated = [...images];

    updated[index] = {
      ...updated[index],
      image: value,
    };

    onChange(updated);
  };

  const removeImage = (index: number) => {
    const updated = images
      .filter((_, i) => i !== index)
      .map((img, idx) => ({
        ...img,
        sortOrder: idx,
      }));

    onChange(updated);
  };

  return (
    <div className="rounded-3xl border border-[#ffd7df] bg-white p-8 shadow-sm">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-[#5b2333]">
            Wedding Gallery
          </h2>

          <p className="mt-1 text-sm text-[#8d6171]">
            Upload all gallery images for this wedding story.
          </p>
        </div>

        <button
          type="button"
          onClick={addImage}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#ff4d6d] to-[#ffb703] px-5 py-3 font-medium text-white shadow transition hover:scale-105"
        >
          <Plus size={18} />
          Add Image
        </button>
      </div>

      {!images.length && (
        <div className="rounded-2xl border-2 border-dashed border-pink-200 py-16 text-center">
          <p className="text-lg font-medium text-[#8d6171]">
            No gallery images added yet
          </p>

          <p className="mt-2 text-sm text-gray-500">
            Click "Add Image" to upload your first image.
          </p>
        </div>
      )}

      <div className="space-y-10">
        {images.map((image, index) => (
          <div
            key={index}
            className="rounded-3xl border border-pink-100 bg-pink-50/30 p-6"
          >
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-[#5b2333]">
                Gallery Image {index + 1}
              </h3>

              <button
                type="button"
                onClick={() => removeImage(index)}
                className="rounded-xl bg-red-50 p-3 text-red-500 transition hover:bg-red-100"
              >
                <Trash2 size={18} />
              </button>
            </div>

            <ImageUploader
              value={image.image}
              folder="wedding-planner/stories"
              onChange={(url) =>
                updateImage(index, url)
              }
            />
          </div>
        ))}
      </div>
    </div>
  );
}