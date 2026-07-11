


// "use client";

// import Image from "next/image";
// import {
//   ImagePlus,
//   ArrowLeft,
//   ArrowRight,
// } from "lucide-react";

// import { useVendorRegistrationStore } from "@/store/vendorRegistrationStore";
// import { useState } from "react";


// export default function GalleryStep() {
//   const {
//     formData,
//     updateField,
//     nextStep,
//     previousStep,
//   } = useVendorRegistrationStore();

//   const handleImage = (
//     e: React.ChangeEvent<HTMLInputElement>,
//     field: "profileImage" | "coverImage"
//   ) => {
//     const file = e.target.files?.[0];

//     if (!file) return;

//     const preview = URL.createObjectURL(file);

//     updateField(field, preview);
//   };

//   return (
//     <div className="mx-auto max-w-4xl">
//       <div className="mb-10">
//         <h2 className="text-3xl font-bold text-gray-700">
//           Gallery
//         </h2>

//         <p className="mt-2 text-gray-500">
//           Upload images that represent your business.
//         </p>
//       </div>

//       <div className="grid gap-8 md:grid-cols-2">
//         {/* Profile Image */}
//         <div>
//           <label className="mb-3 block font-medium text-gray-600">
//             Profile Image
//           </label>

//           <label className="flex h-60 cursor-pointer items-center justify-center rounded-2xl border-2 border-dashed border-gray-300 bg-white transition hover:border-blue-500">
//             {formData.profileImage ? (
//               <Image
//                 src={formData.profileImage}
//                 alt="Profile"
//                 width={220}
//                 height={220}
//                 className="h-52 w-52 rounded-xl object-cover"
//               />
//             ) : (
//               <div className="text-center text-gray-500">
//                 <ImagePlus
//                   size={34}
//                   className="mx-auto mb-3 text-gray-400"
//                 />
//                 <p>Select Profile Image</p>
//               </div>
//             )}

//             <input
//               hidden
//               type="file"
//               accept="image/*"
//               onChange={(e) =>
//                 handleImage(e, "profileImage")
//               }
//             />
//           </label>
//         </div>

//         {/* Cover Image */}
//         <div>
//           <label className="mb-3 block font-medium text-gray-600">
//             Cover Image
//           </label>

//           <label className="flex h-60 cursor-pointer items-center justify-center rounded-2xl border-2 border-dashed border-gray-300 bg-white transition hover:border-blue-500">
//             {formData.coverImage ? (
//               <Image
//                 src={formData.coverImage}
//                 alt="Cover"
//                 width={220}
//                 height={220}
//                 className="h-52 w-52 rounded-xl object-cover"
//               />
//             ) : (
//               <div className="text-center text-gray-500">
//                 <ImagePlus
//                   size={34}
//                   className="mx-auto mb-3 text-gray-400"
//                 />
//                 <p>Select Cover Image</p>
//               </div>
//             )}

//             <input
//               hidden
//               type="file"
//               accept="image/*"
//               onChange={(e) =>
//                 handleImage(e, "coverImage")
//               }
//             />
//           </label>
//         </div>
//       </div>

//       <div className="mt-12 flex justify-between">
//         <button
//           type="button"
//           onClick={previousStep}
//           className="flex items-center gap-2 rounded-xl border border-gray-300 px-6 py-3 font-medium text-gray-600 transition hover:bg-gray-100"
//         >
//           <ArrowLeft size={18} />
//           Previous
//         </button>

//         <button
//           type="button"
//           onClick={nextStep}
//           className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-medium text-white shadow-lg transition-all duration-200 hover:bg-blue-700 hover:shadow-xl"
//         >
//           Continue
//           <ArrowRight size={18} />
//         </button>
//       </div>
//     </div>
//   );
// }


"use client";

import Image from "next/image";
import {
  ImagePlus,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";

import { useVendorRegistrationStore } from "@/store/vendorRegistrationStore";
import { useState } from "react";
import { validateGalleryStep } from "@/lib/validations/vendorRegistration";
import { uploadVendorRegistrationImageApi } from "@/services/api/auth.api";

const MAX_IMAGE_SIZE_MB = 5;
const MAX_IMAGE_SIZE_BYTES =
  MAX_IMAGE_SIZE_MB * 1024 * 1024;

export default function GalleryStep() {
  const {
    formData,
    updateField,
    nextStep,
    previousStep,
  } = useVendorRegistrationStore();

  const [errors, setErrors] = useState<
    Record<string, string>
  >({});
  const [uploadingField, setUploadingField] =
    useState<"profileImage" | "coverImage" | null>(
      null
    );

  const handleImage = async (
    e: React.ChangeEvent<HTMLInputElement>,
    field: "profileImage" | "coverImage"
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (file.size > MAX_IMAGE_SIZE_BYTES) {
      e.target.value = "";
      setErrors((prev) => ({
        ...prev,
        [field]: `Please upload image within ${MAX_IMAGE_SIZE_MB} MB.`,
      }));
      return;
    }

    const preview = URL.createObjectURL(file);
    updateField(field, preview);
    setUploadingField(field);

    setErrors((prev) => ({
      ...prev,
      [field]: "",
    }));

    const result =
      await uploadVendorRegistrationImageApi(file);

    setUploadingField(null);

    if (!result.ok || !result.data.image) {
      updateField(field, "");
      setErrors((prev) => ({
        ...prev,
        [field]:
          result.data.message ??
          "Unable to upload image. Please try again.",
      }));
      return;
    }

    updateField(field, result.data.image);
  };

  const handleContinue = () => {
    if (uploadingField) {
      setErrors((prev) => ({
        ...prev,
        [uploadingField]:
          "Please wait, image is still uploading.",
      }));
      return;
    }

    const result = validateGalleryStep(formData);

    if (!result.isValid) {
      setErrors(result.errors);
      return;
    }

    setErrors({});
    nextStep();
  };

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-10">
        <h2 className="text-3xl font-bold text-gray-700">
          Gallery
        </h2>

        <p className="mt-2 text-gray-500">
          Upload images that represent your business.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        {/* Profile Image */}
        <div>
          <label className="mb-3 block font-medium text-gray-600">
            Profile Image
          </label>
          <p className="mb-3 text-xs font-medium text-rose-600">
            Please upload image within 5 MB.
          </p>

          <label
            className={`flex h-60 cursor-pointer items-center justify-center rounded-2xl border-2 border-dashed bg-white transition ${
              errors.profileImage
                ? "border-red-500"
                : "border-gray-300 hover:border-blue-500"
            }`}
          >
            {formData.profileImage ? (
              <Image
                src={formData.profileImage}
                alt="Profile"
                width={220}
                height={220}
                className="h-52 w-52 rounded-xl object-cover"
              />
            ) : (
              <div className="text-center text-gray-500">
                <ImagePlus
                  size={34}
                  className="mx-auto mb-3 text-gray-400"
                />
                <p>Select Profile Image</p>
                {uploadingField ===
                  "profileImage" && (
                  <p className="mt-2 text-sm text-rose-600">
                    Uploading...
                  </p>
                )}
              </div>
            )}

            <input
              hidden
              type="file"
              accept="image/*"
              onChange={(e) =>
                handleImage(e, "profileImage")
              }
            />
          </label>

          {errors.profileImage && (
            <p className="mt-3 text-sm text-red-500">
              {errors.profileImage}
            </p>
          )}
        </div>

        {/* Cover Image */}
        <div>
          <label className="mb-3 block font-medium text-gray-600">
            Cover Image
          </label>
          <p className="mb-3 text-xs font-medium text-rose-600">
            Please upload image within 5 MB.
          </p>

          <label
            className={`flex h-60 cursor-pointer items-center justify-center rounded-2xl border-2 border-dashed bg-white transition ${
              errors.coverImage
                ? "border-red-500"
                : "border-gray-300 hover:border-blue-500"
            }`}
          >
            {formData.coverImage ? (
              <Image
                src={formData.coverImage}
                alt="Cover"
                width={220}
                height={220}
                className="h-52 w-52 rounded-xl object-cover"
              />
            ) : (
              <div className="text-center text-gray-500">
                <ImagePlus
                  size={34}
                  className="mx-auto mb-3 text-gray-400"
                />
                <p>Select Cover Image</p>
                {uploadingField ===
                  "coverImage" && (
                  <p className="mt-2 text-sm text-rose-600">
                    Uploading...
                  </p>
                )}
              </div>
            )}

            <input
              hidden
              type="file"
              accept="image/*"
              onChange={(e) =>
                handleImage(e, "coverImage")
              }
            />
          </label>

          {errors.coverImage && (
            <p className="mt-3 text-sm text-red-500">
              {errors.coverImage}
            </p>
          )}
        </div>
      </div>

      <div className="mt-12 flex justify-between">
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
          disabled={Boolean(uploadingField)}
          className="flex items-center gap-2 rounded-xl bg-[#e4005a] px-6 py-3 font-medium text-white shadow-lg transition-all duration-200 hover:bg-[#c9004f] hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-70"
        >
          {uploadingField
            ? "Uploading..."
            : "Continue"}
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}
