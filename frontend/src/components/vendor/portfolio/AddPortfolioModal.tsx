

"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { toast } from "sonner";

import { useAuthStore } from "@/store/authStore";
import { usePortfolioStore } from "@/store/portfolioStore";

import { getVendorByUserId } from "@/services/vendor.service";

interface AddPortfolioModalProps {
  open: boolean;
  onClose: () => void;
}

export default function AddPortfolioModal({
  open,
  onClose,
}: AddPortfolioModalProps) {
  const { user } = useAuthStore();

  const {
    addPortfolio,
    selectedPortfolio,
    updateExistingPortfolio,
    setSelectedPortfolio,
  } = usePortfolioStore();

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");

  useEffect(() => {
    if (!open) return;

    if (selectedPortfolio) {
      setTitle(selectedPortfolio.title);
      setCategory(selectedPortfolio.category);
      setDescription(selectedPortfolio.description);
      setImage(selectedPortfolio.image);
    } else {
      setTitle("");
      setCategory("");
      setDescription("");
      setImage("");
    }
  }, [open, selectedPortfolio]);

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setImage(URL.createObjectURL(file));
  };

  const handleSave = () => {
    if (!title || !category || !description || !image) {
      toast.error("Please fill all fields.");
      return;
    }

    if (!user) {
      toast.error("Please login.");
      return;
    }

    const vendor = getVendorByUserId(user._id);

    if (!vendor) {
      toast.error("Vendor not found.");
      return;
    }

    if (selectedPortfolio) {
      updateExistingPortfolio({
        ...selectedPortfolio,
        title,
        category: category as typeof selectedPortfolio.category,
        description,
        image,
        updatedAt: new Date().toISOString(),
      });

      toast.success("Portfolio updated.");
    } else {
      addPortfolio({
        id: crypto.randomUUID(),
        vendorId: vendor.id,
        title,
        category: category as any,
        description,
        image,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      toast.success("Portfolio uploaded.");
    }

    setSelectedPortfolio(null);
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-6">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b px-8 py-6">
          <h2 className="text-2xl font-bold text-gray-700">
            {selectedPortfolio
              ? "Edit Portfolio"
              : "Upload Portfolio"}
          </h2>

          <button
            onClick={() => {
              setSelectedPortfolio(null);
              onClose();
            }}
            className="text-gray-500 hover:text-gray-700"
          >
            <X />
          </button>
        </div>

        {/* Body */}
        <div className="space-y-6 p-8">
          <div>
            <label className="mb-2 block font-medium text-gray-600">
              Title
            </label>

            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="h-12 w-full rounded-xl border border-gray-300 px-4 text-gray-600 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>

          <div>
            <label className="mb-2 block font-medium text-gray-600">
              Category
            </label>

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="h-12 w-full rounded-xl border border-gray-300 px-4 text-gray-600 focus:outline-none focus:ring-2 focus:ring-violet-500"
            >
              <option value="">Select Category</option>
              <option>Wedding</option>
              <option>Reception</option>
              <option>Engagement</option>
              <option>Haldi</option>
              <option>Mehendi</option>
              <option>Pre Wedding</option>
              <option>Bridal Makeup</option>
              <option>Decoration</option>
              <option>Other</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block font-medium text-gray-600">
              Description
            </label>

            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-xl border border-gray-300 p-4 text-gray-600 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>

          <div>
            <label className="mb-3 block font-medium text-gray-600">
              Portfolio Image
            </label>

            <div className="rounded-2xl border-2 border-dashed border-gray-300 p-5">
              {image ? (
                <img
                  src={image}
                  alt="Preview"
                  className="h-56 w-full rounded-xl object-cover"
                />
              ) : (
                <div className="flex h-56 items-center justify-center text-gray-400">
                  No image selected
                </div>
              )}

              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="mt-5 text-gray-600 file:mr-4 file:rounded-lg file:border-0 file:bg-violet-100 file:px-4 file:py-2 file:text-violet-700 hover:file:bg-violet-200"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 border-t px-8 py-6">
          <button
            onClick={() => {
              setSelectedPortfolio(null);
              onClose();
            }}
            className="rounded-xl border border-gray-300 px-6 py-3 text-gray-600 transition hover:bg-gray-100"
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            className="rounded-xl bg-violet-700 px-6 py-3 font-semibold text-white transition hover:bg-violet-800"
          >
            {selectedPortfolio
              ? "Update Portfolio"
              : "Upload Portfolio"}
          </button>
        </div>
      </div>
    </div>
  );
}