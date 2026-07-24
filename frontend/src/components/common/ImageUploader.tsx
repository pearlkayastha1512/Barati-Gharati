"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import {
  Upload,
  Loader2,
  Trash2,
  Image as ImageIcon,
} from "lucide-react";

import { uploadImage } from "@/services/upload.service";

interface ImageUploaderProps {
  value?: string;
  onChange: (url: string) => void;
  folder?: string;
}

export default function ImageUploader({
  value,
  onChange,
  folder = "wedding-planner",
}: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const [uploading, setUploading] = useState(false);

  const handleUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    try {
      setUploading(true);

      const url = await uploadImage(file, folder);

      onChange(url);
    } catch (error) {
      console.error(error);
      alert("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <input
        ref={inputRef}
        
        type="file"
        accept="image/*"
        hidden
        onChange={handleUpload}
      />

      {value ? (
        <div className="relative h-64 w-full overflow-hidden rounded-2xl border">
          <Image
            src={value}
            alt="Uploaded"
            fill
            className="object-cover"
          />

          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute right-3 top-3 rounded-full bg-red-500 p-2 text-white"
          >
            <Trash2 size={18} />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex h-64 w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-pink-300 transition hover:border-pink-500"
        >
          {uploading ? (
            <>
              <Loader2
                className="animate-spin text-pink-500"
                size={40}
              />

              <span className="mt-3">
                Uploading...
              </span>
            </>
          ) : (
            <>
              <Upload
                className="text-pink-500"
                size={42}
              />

              <span className="mt-3 font-medium text-gray-600">
                Upload Image
              </span>

              <span className="mt-1 text-sm text-gray-500">
                Click to upload
              </span>
            </>
          )}
        </button>
      )}

      {value && (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-pink-500 to-yellow-500 px-4 py-2 text-white"
        >
          <ImageIcon size={18} />

          Change Image
        </button>
      )}
    </div>
  );
}