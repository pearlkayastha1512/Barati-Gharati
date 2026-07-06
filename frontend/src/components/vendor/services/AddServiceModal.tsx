


"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { toast } from "sonner";

import { useAuthStore } from "@/store/authStore";
import { useServiceStore } from "@/store/serviceStore";




interface AddServiceModalProps {
  open: boolean;
  onClose: () => void;
  editMode?: boolean;
}

export default function AddServiceModal({
  open,
  onClose,
}: AddServiceModalProps) {
  const { user } = useAuthStore();
const {
  addService,
  selectedService,
  updateExistingService,
  setSelectedService,
  loadVendorServices,
} = useServiceStore();
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState("");
  const [price, setPrice] = useState("");

  // NEW
  const [image, setImage] = useState("");

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const url = URL.createObjectURL(file);

    setImage(url);
  };

  useEffect(() => {
    if (!open) return;

    if (selectedService) {
      setName(selectedService.name);
      setCategory(selectedService.category);
      setDescription(selectedService.description);
      setDuration(selectedService.duration);
      setPrice(selectedService.price.toString());

      // NEW
      setImage(selectedService.image);
    } else {
      setName("");
      setCategory("");
      setDescription("");
      setDuration("");
      setPrice("");

      // NEW
      setImage("");
    }
  }, [open, selectedService]);

  const handleSave = async () => {
  if (
    !name ||
    !category ||
    !description ||
    !duration ||
    !price ||
    !image
  ) {
    toast.error("Please fill all fields.");
    return;
  }

  if (!user) {
    toast.error("Please login.");
    return;
  }

  if (selectedService) {
    const success =
      await updateExistingService({
        ...selectedService,

        name,

        category,

        description,

        duration,

        price: Number(price),

        image,

        includes:
          selectedService.includes ?? [],
      });

    if (!success) {
      toast.error("Unable to update service.");
      return;
    }

    toast.success("Service updated.");
  } else {
   

const success = await addService({
  id: "",

  vendorId:0,

  name,

  category,

  description,

  duration,

  price: Number(price),

  rating: 5,

  reviews: 0,

  image,

  includes: [],

  status: "active",

  createdAt: "",

  updatedAt: "",
});

    if (!success) {
      toast.error("Unable to create service.");
      return;
    }

    toast.success("Service created.");
  }

  // Backend loads current vendor from JWT.
await loadVendorServices(0);
  setSelectedService(null);

  onClose();
};














  if (!open) {
    return null;
  }

  // Continue with the return (...) JSX in Part 2

    return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-6">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b px-8 py-6">
          <h2 className="text-2xl font-bold text-gray-700">
            {selectedService
              ? "Edit Service"
              : "Add New Service"}
          </h2>

          <button
            onClick={() => {
              setSelectedService(null);
              onClose();
            }}
          >
            <X className="text-gray-600" />
          </button>
        </div>

        {/* Body */}
        <div className="space-y-6 p-8">
          <div>
            <label className="mb-2 block font-medium text-gray-600">
              Service Name
            </label>

            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter service name"
              className="h-12 w-full rounded-xl border border-gray-300 px-4 text-gray-600 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="mb-2 block font-medium text-gray-600">
              Category
            </label>

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="h-12 w-full rounded-xl border border-gray-300 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">
                Select Category
              </option>

              <option value="Photographer">
                Photographer
              </option>

              <option value="Wedding Venue">
                Wedding Venue
              </option>

              <option value="Decorator">
                Decorator
              </option>

              <option value="Caterer">
                Caterer
              </option>

              <option value="Makeup Artist">
                Makeup Artist
              </option>

              <option value="Wedding Transport">
                Wedding Transport
              </option>

              <option value="Mehendi Artist">
                Mehendi Artist
              </option>

              <option value="DJ">
                DJ
              </option>

              <option value="Band">
                Band
              </option>
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
              placeholder="Enter description"
              className="w-full rounded-xl border border-gray-300 p-4 text-gray-600 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className="mb-2 block font-medium text-gray-600">
                Duration
              </label>

              <input
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="e.g. 30 mins"
                className="h-12 w-full rounded-xl border border-gray-300 px-4 text-gray-600 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="mb-2 block font-medium text-gray-600">
                Price
              </label>

              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="Enter price"
                className="h-12 w-full rounded-xl border border-gray-300 px-4 text-gray-600 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Image Upload */}
         <div>
  <label className="mb-3 block font-medium text-gray-600">
    Service Image
  </label>

  <div className="rounded-2xl border-2 border-dashed border-gray-300 p-5">

    {image ? (
      <div className="relative mx-auto h-56 w-full overflow-hidden rounded-xl">
        <img
          src={image}
          alt="Preview"
          className="h-full w-full object-cover"
        />
      </div>
    ) : (
      <div className="flex h-56 items-center justify-center rounded-xl bg-gray-50 text-gray-400">
        No image selected
      </div>
    )}

    <input
      type="file"
      accept="image/*"
      onChange={handleImageChange}
      className="mt-5 block w-full text-sm"
    />

  </div>
</div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 border-t px-8 py-6">
          <button
            onClick={() => {
              setSelectedService(null);
              onClose();
            }}
            className="rounded-xl border border-gray-300 px-6 py-3 text-gray-600 hover:bg-gray-50"
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
          >
            {selectedService
              ? "Update Service"
              : "Save Service"}
          </button>
        </div>
      </div>
    </div>
  );
}