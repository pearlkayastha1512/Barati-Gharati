"use client";

import Image from "next/image";
import {
  ArrowLeft,
  CheckCircle2,
} from "lucide-react";
import { registerVendor } from "@/services/vendor.service";


import { useVendorRegistrationStore } from "@/store/vendorRegistrationStore";
import { registerVendorApi } from "@/services/api/auth.api";

export default function ReviewStep() {
  const {
    formData,
    previousStep,
    nextStep,
  } = useVendorRegistrationStore();

//  const handleSubmit = () => {
//   const result = registerVendor(formData);

//   if (!result.success) {
//     alert(result.message);
//     return;
//   }

//   nextStep();
// };






const handleSubmit = async () => {
  const result = await registerVendorApi({
    ownerName: formData.ownerName,
    email: formData.email,
    phone: formData.phone,
    password: formData.password,

    businessName: formData.businessName,
    category: formData.category,
    city: formData.city,
    address: formData.address,
    description: formData.description,

    website: formData.website,
    instagram: formData.instagram,
    facebook: formData.facebook,
    youtube: formData.youtube,
    linkedin: formData.linkedin,

    experience: formData.experience,
    gstNumber: formData.gstNumber,
  });

  if (!result.ok) {
    alert(result.data.message);
    return;
  }

  nextStep();
};












  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-10">
        <h2 className="text-3xl font-bold text-gray-700">
          Review Your Information
        </h2>

        <p className="mt-2 text-gray-500">
          Please verify everything before submitting.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Account */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6">
          <h3 className="mb-5 text-xl font-semibold text-gray-700">
            Account Information
          </h3>

          <div className="space-y-3">
            <Info
              label="Owner Name"
              value={formData.ownerName}
            />

            <Info
              label="Email"
              value={formData.email}
            />

            <Info
              label="Phone"
              value={formData.phone}
            />
          </div>
        </div>

        {/* Business */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6">
          <h3 className="mb-5 text-xl font-semibold text-gray-700">
            Business Information
          </h3>

          <div className="space-y-3">
            <Info
              label="Business"
              value={formData.businessName}
            />

            <Info
              label="Category"
              value={formData.category}
            />

            <Info
              label="City"
              value={formData.city}
            />

            <Info
              label="Address"
              value={formData.address}
            />
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-6">
        <h3 className="mb-4 text-xl font-semibold text-gray-700">
          Description
        </h3>

        <p className="leading-7 text-gray-600">
          {formData.description || "-"}
        </p>
      </div>

      {/* Images */}
      <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-6">
        <h3 className="mb-5 text-xl font-semibold text-gray-700">
          Uploaded Images
        </h3>

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <p className="mb-3 font-medium text-gray-600">
              Profile Image
            </p>

            {formData.profileImage ? (
              <Image
                src={formData.profileImage}
                alt="Profile"
                width={300}
                height={220}
                className="rounded-xl object-cover"
              />
            ) : (
              <p className="text-gray-400">
                Not Uploaded
              </p>
            )}
          </div>

          <div>
            <p className="mb-3 font-medium text-gray-600">
              Cover Image
            </p>

            {formData.coverImage ? (
              <Image
                src={formData.coverImage}
                alt="Cover"
                width={300}
                height={220}
                className="rounded-xl object-cover"
              />
            ) : (
              <p className="text-gray-400">
                Not Uploaded
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="mt-12 flex justify-between">
        <button
          onClick={previousStep}
          className="flex items-center gap-2 rounded-xl border border-gray-300 px-6 py-3 font-medium text-gray-600 transition hover:bg-gray-100"
        >
          <ArrowLeft size={18} />
          Previous
        </button>

        <button
          onClick={handleSubmit}
          className="flex items-center gap-3 rounded-xl bg-green-600 px-8 py-3 font-semibold text-white shadow-lg transition-all duration-200 hover:bg-green-700 hover:shadow-xl"
        >
          <CheckCircle2 size={20} />
          Submit Registration
        </button>
      </div>
    </div>
  );
}

interface InfoProps {
  label: string;
  value: string;
}

function Info({
  label,
  value,
}: InfoProps) {
  return (
    <div className="flex justify-between border-b border-gray-100 pb-3">
      <span className="text-gray-500">
        {label}
      </span>

      <span className="font-medium text-gray-700">
        {value || "-"}
      </span>
    </div>
  );
}