



"use client";

import {
  Building2,
  MapPin,
  Layers3,
  FileText,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";

import { useVendorRegistrationStore } from "@/store/vendorRegistrationStore";
import { useState } from "react";
import { validateBusinessStep } from "@/lib/validations/vendorRegistration";

import { VENDOR_CATEGORIES } from "@/constants/categories";

export default function BusinessStep() {
  const {
    formData,
    updateField,
    nextStep,
    previousStep,
  } = useVendorRegistrationStore();

  const [errors, setErrors] = useState<
    Record<string, string>
  >({});

  const handleFieldChange = (
    field: keyof typeof formData,
    value: string
  ) => {
    updateField(field, value);

    const updatedData = {
      ...formData,
      [field]: value,
    };

    const result =
      validateBusinessStep(updatedData);

    setErrors((prev) => ({
      ...prev,
      [field]: result.errors[field] || "",
    }));
  };

  const handleContinue = () => {
    const result =
      validateBusinessStep(formData);

    if (!result.isValid) {
      setErrors(result.errors);
      return;
    }

    setErrors({});
    nextStep();
  };

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-10">
        <h2 className="text-3xl font-bold text-gray-700">
          Business Information
        </h2>

        <p className="mt-2 text-gray-500">
          Tell customers about your business.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Business Name */}
        <div>
          <label className="mb-2 block font-medium text-gray-600">
            Business Name
          </label>

          <div className="relative">
            <Building2
              size={20}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              placeholder="Royal Palace Banquets"
              value={formData.businessName}
              onChange={(e) =>
                handleFieldChange(
                  "businessName",
                  e.target.value
                )
              }
              className={`h-12 w-full rounded-xl border bg-white pl-12 pr-4 text-gray-700 placeholder:text-gray-400 outline-none transition ${
                errors.businessName
                  ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-100"
                  : "border-gray-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              }`}
            />
          </div>

          {errors.businessName && (
            <p className="mt-2 text-sm text-red-500">
              {errors.businessName}
            </p>
          )}
        </div>

        {/* Category */}
        <div>
          <label className="mb-2 block font-medium text-gray-600">
            Category
          </label>

          <div className="relative">
            <Layers3
              size={20}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />

           <select
  value={formData.category}
  onChange={(e) =>
    handleFieldChange(
      "category",
      e.target.value
    )
  }
  className={`h-12 w-full rounded-xl border bg-white pl-12 pr-4 text-gray-700 outline-none transition ${
    errors.category
      ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-100"
      : "border-gray-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
  }`}
>
  <option value="">
    Select Category
  </option>

  {VENDOR_CATEGORIES.map((category) => (
    <option
      key={category}
      value={category}
    >
      {category}
    </option>
  ))}
</select>
          </div>

          {errors.category && (
            <p className="mt-2 text-sm text-red-500">
              {errors.category}
            </p>
          )}
        </div>

        {/* City */}
        <div>
          <label className="mb-2 block font-medium text-gray-600">
            City
          </label>

          <div className="relative">
            <MapPin
              size={20}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              placeholder="Noida"
              value={formData.city}
              onChange={(e) =>
                handleFieldChange(
                  "city",
                  e.target.value
                )
              }
              className={`h-12 w-full rounded-xl border bg-white pl-12 pr-4 text-gray-700 placeholder:text-gray-400 outline-none transition ${
                errors.city
                  ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-100"
                  : "border-gray-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              }`}
            />
          </div>

          {errors.city && (
            <p className="mt-2 text-sm text-red-500">
              {errors.city}
            </p>
          )}
        </div>
                {/* Address */}
        <div>
          <label className="mb-2 block font-medium text-gray-600">
            Address
          </label>

          <div className="relative">
            <MapPin
              size={20}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              placeholder="Sector 62, Noida"
              value={formData.address}
              onChange={(e) =>
                handleFieldChange(
                  "address",
                  e.target.value
                )
              }
              className={`h-12 w-full rounded-xl border bg-white pl-12 pr-4 text-gray-700 placeholder:text-gray-400 outline-none transition ${
                errors.address
                  ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-100"
                  : "border-gray-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              }`}
            />
          </div>

          {errors.address && (
            <p className="mt-2 text-sm text-red-500">
              {errors.address}
            </p>
          )}
        </div>
      </div>

      {/* Description */}
      <div className="mt-6">
        <label className="mb-2 block font-medium text-gray-600">
          Description
        </label>

        <div className="relative">
          <FileText
            size={20}
            className="absolute left-4 top-5 text-gray-400"
          />

          <textarea
            rows={5}
            placeholder="Tell couples about your services..."
            value={formData.description}
            onChange={(e) =>
              handleFieldChange(
                "description",
                e.target.value
              )
            }
            className={`w-full rounded-xl border bg-white pl-12 pr-4 pt-4 text-gray-700 placeholder:text-gray-400 outline-none transition ${
              errors.description
                ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-100"
                : "border-gray-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
            }`}
          />
        </div>

        {errors.description && (
          <p className="mt-2 text-sm text-red-500">
            {errors.description}
          </p>
        )}
      </div>

      {/* Buttons */}
      <div className="mt-10 flex justify-between">
        <button
          type="button"
          onClick={previousStep}
          className="flex items-center gap-2 rounded-xl border border-gray-300 px-6 py-3 font-medium text-gray-600 transition hover:bg-gray-100"
        >
          <ArrowLeft size={18} />
          Previous
        </button>

        <button
          type="button"
          onClick={handleContinue}
          className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-medium text-white shadow-lg transition-all duration-200 hover:bg-blue-700 hover:shadow-xl"
        >
          Continue
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}