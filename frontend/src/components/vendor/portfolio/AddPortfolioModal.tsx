// "use client";

// import { useEffect, useState } from "react";
// import { X } from "lucide-react";
// import { toast } from "sonner";

// import { usePortfolioStore } from "@/store/portfolioStore";

// interface AddPortfolioModalProps {
//   open: boolean;
//   onClose: () => void;
// }

// export default function AddPortfolioModal({
//   open,
//   onClose,
// }: AddPortfolioModalProps) {
//   const {
//     addPortfolio,
//     selectedPortfolio,
//     updateExistingPortfolio,
//     setSelectedPortfolio,
//   } = usePortfolioStore();

//   const [title, setTitle] = useState("");
//   const [category, setCategory] = useState("");
//   const [description, setDescription] = useState("");

//   const [imagePreview, setImagePreview] = useState("");
//   const [imageFile, setImageFile] = useState<File | null>(null);

//   useEffect(() => {
//     if (!open) return;

//     if (selectedPortfolio) {
//       setTitle(selectedPortfolio.title);
//       setCategory(selectedPortfolio.category);
//       setDescription(selectedPortfolio.description);
//       setImagePreview(selectedPortfolio.image);
//       setImageFile(null);
//     } else {
//       setTitle("");
//       setCategory("");
//       setDescription("");
//       setImagePreview("");
//       setImageFile(null);
//     }
//   }, [open, selectedPortfolio]);

//   const handleSubmit = async () => {
//     if (!title.trim()) {
//       toast.error("Please enter title.");
//       return;
//     }

//     if (!category) {
//       toast.error("Please select category.");
//       return;
//     }

//     // Edit mode
//     if (selectedPortfolio) {
//       updateExistingPortfolio({
//         ...selectedPortfolio,
//         title,
//         category: category as typeof selectedPortfolio.category,
//         description,
//         image: imagePreview,
//       });

//       toast.success("Portfolio updated successfully.");
//       setSelectedPortfolio(null);
//       onClose();
//       return;
//     }

//     // Upload mode
//     if (!imageFile) {
//       toast.error("Please select an image.");
//       return;
//     }

//     const formData = new FormData();

//     formData.append("title", title);
//     formData.append("category", category);
//     formData.append("description", description);
//     formData.append("image", imageFile);

//     const success = await addPortfolio(formData);

//     if (!success) {
//       toast.error("Unable to upload portfolio.");
//       return;
//     }

//     toast.success("Portfolio uploaded successfully.");

//     setTitle("");
//     setCategory("");
//     setDescription("");
//     setImagePreview("");
//     setImageFile(null);

//     onClose();
//   };

//   if (!open) return null;

//   return (
//     <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-6">
//       <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white shadow-2xl">
//         {/* Header */}
//         <div className="flex items-center justify-between border-b px-8 py-6">
//           <h2 className="text-2xl font-bold text-gray-700">
//             {selectedPortfolio ? "Edit Portfolio" : "Upload Portfolio"}
//           </h2>

//           <button
//             onClick={() => {
//               setSelectedPortfolio(null);
//               onClose();
//             }}
//             className="text-gray-500 hover:text-gray-700"
//           >
//             <X />
//           </button>
//         </div>

//         {/* Body */}
//         <div className="space-y-6 p-8">
//           <div>
//             <label className="mb-2 block font-medium text-gray-600">
//               Title
//             </label>

//             <input
//               value={title}
//               onChange={(e) => setTitle(e.target.value)}
//               className="h-12 w-full rounded-xl border border-gray-300 px-4 text-gray-600 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#e4005a]"
//             />
//           </div>

//           <div>
//             <label className="mb-2 block font-medium text-gray-600">
//               Category
//             </label>

//             <select
//               value={category}
//               onChange={(e) => setCategory(e.target.value)}
//               className="h-12 w-full rounded-xl border border-gray-300 px-4 text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#e4005a]"
//             >
//               <option value="">Select Category</option>
//               <option>Wedding</option>
//               <option>Reception</option>
//               <option>Engagement</option>
//               <option>Haldi</option>
//               <option>Mehendi</option>
//               <option>Pre Wedding</option>
//               <option>Bridal Makeup</option>
//               <option>Decoration</option>
//               <option>Other</option>
//             </select>
//           </div>

//           <div>
//             <label className="mb-2 block font-medium text-gray-600">
//               Description
//             </label>

//             <textarea
//               rows={4}
//               value={description}
//               onChange={(e) => setDescription(e.target.value)}
//               className="w-full rounded-xl border border-gray-300 p-4 text-gray-600 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#e4005a]"
//             />
//           </div>

//           <div>
//             <label className="mb-3 block font-medium text-gray-600">
//               Portfolio Image
//             </label>

//             <div className="rounded-2xl border-2 border-dashed border-gray-300 p-5">
//               {imagePreview ? (
//                 <img
//                   src={imagePreview}
//                   alt="Preview"
//                   className="h-56 w-full rounded-xl object-cover"
//                 />
//               ) : (
//                 <div className="flex h-56 items-center justify-center text-gray-400">
//                   No image selected
//                 </div>
//               )}

//               <input
//                 type="file"
//                 accept="image/*"
//                 onChange={(e) => {
//                   const file = e.target.files?.[0];

//                   if (file) {
//                     setImageFile(file);
//                     setImagePreview(URL.createObjectURL(file));
//                   }
//                 }}
//                 className="mt-5 text-gray-600 file:mr-4 file:rounded-lg file:border-0 file:bg-[#ffe1ec] file:px-4 file:py-2 file:text-[#e4005a] hover:file:bg-[#ffd6e5]"
//               />
//             </div>
//           </div>
//         </div>

//         {/* Footer */}
//         <div className="flex justify-end gap-3 border-t px-8 py-6">
//           <button
//             onClick={() => {
//               setSelectedPortfolio(null);
//               onClose();
//             }}
//             className="rounded-xl border border-gray-300 px-6 py-3 text-gray-600 transition hover:bg-gray-100"
//           >
//             Cancel
//           </button>

//           <button
//             onClick={handleSubmit}
//             className="rounded-xl bg-[#e4005a] px-6 py-3 font-semibold text-white transition hover:bg-[#c8004e]"
//           >
//             {selectedPortfolio ? "Update Portfolio" : "Upload Portfolio"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }


"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { toast } from "sonner";

import { usePortfolioStore } from "@/store/portfolioStore";

interface AddPortfolioModalProps {
  open: boolean;
  onClose: () => void;
}

export default function AddPortfolioModal({
  open,
  onClose,
}: AddPortfolioModalProps) {
  const {
    addPortfolio,
    selectedPortfolio,
    updateExistingPortfolio,
    setSelectedPortfolio,
  } = usePortfolioStore();

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");

  const [imagePreview, setImagePreview] =
    useState("");

  const [imageFile, setImageFile] =
    useState<File | null>(null);

  const [loading, setLoading] =
    useState(false);

  useEffect(() => {
    if (!open) return;

    if (selectedPortfolio) {
      setTitle(selectedPortfolio.title);
      setCategory(selectedPortfolio.category);
      setDescription(
        selectedPortfolio.description
      );
      setImagePreview(
        selectedPortfolio.image
      );
      setImageFile(null);
    } else {
      resetForm();
    }
  }, [open, selectedPortfolio]);

  function resetForm() {
    setTitle("");
    setCategory("");
    setDescription("");
    setImagePreview("");
    setImageFile(null);
  }

  async function handleSubmit() {
    if (loading) return;

    if (!title.trim()) {
      toast.error(
        "Please enter title."
      );
      return;
    }

    if (!category) {
      toast.error(
        "Please select category."
      );
      return;
    }

    setLoading(true);

    try {
      // ===============================
      // Edit
      // ===============================

      if (selectedPortfolio) {
        const success =
          await updateExistingPortfolio({
            ...selectedPortfolio,
            title,
            category:
              category as typeof selectedPortfolio.category,
            description,
            image: imagePreview,
          });

        if (!success) {
          toast.error(
            "Unable to update portfolio."
          );
          return;
        }

        toast.success(
          "Portfolio updated successfully."
        );

        resetForm();

        setSelectedPortfolio(null);

        onClose();

        return;
      }

      // ===============================
      // Upload
      // ===============================

      if (!imageFile) {
        toast.error(
          "Please select an image."
        );
        return;
      }

      const formData =
        new FormData();

      formData.append(
        "title",
        title
      );

      formData.append(
        "category",
        category
      );

      formData.append(
        "description",
        description
      );

      formData.append(
        "image",
        imageFile
      );

      const success =
        await addPortfolio(
          formData
        );

      if (!success) {
        toast.error(
          "Unable to upload portfolio."
        );
        return;
      }

      toast.success(
        "Portfolio uploaded successfully."
      );

      resetForm();

      setSelectedPortfolio(null);

      onClose();
    } finally {
      setLoading(false);
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-6">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white shadow-2xl">

        <div className="flex items-center justify-between border-b px-8 py-6">
          <h2 className="text-2xl font-bold text-gray-700">
            {selectedPortfolio
              ? "Edit Portfolio"
              : "Upload Portfolio"}
          </h2>

          <button
            onClick={() => {
              resetForm();
              setSelectedPortfolio(null);
              onClose();
            }}
            disabled={loading}
            className="text-gray-500 hover:text-gray-700"
          >
            <X />
          </button>
        </div>

        <div className="space-y-6 p-8">

          <div>
            <label className="mb-2 block font-medium text-gray-600">
              Title
            </label>

            <input
              value={title}
              onChange={(e) =>
                setTitle(
                  e.target.value
                )
              }
              className="h-12 w-full rounded-xl border border-gray-300 px-4 text-gray-600 focus:ring-2 focus:ring-[#e4005a] focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-2 block font-medium text-gray-600">
              Category
            </label>

            <select
              value={category}
              onChange={(e) =>
                setCategory(
                  e.target.value
                )
              }
              className="h-12 w-full rounded-xl border border-gray-300 px-4 text-gray-600 focus:ring-2 focus:ring-[#e4005a] focus:outline-none"
            >
              <option value="">
                Select Category
              </option>

              <option>
                Wedding
              </option>

              <option>
                Reception
              </option>

              <option>
                Engagement
              </option>

              <option>
                Haldi
              </option>

              <option>
                Mehendi
              </option>

              <option>
                Pre Wedding
              </option>

              <option>
                Bridal Makeup
              </option>

              <option>
                Decoration
              </option>

              <option>
                Other
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
              onChange={(e) =>
                setDescription(
                  e.target.value
                )
              }
              className="w-full rounded-xl border border-gray-300 p-4 text-gray-600 focus:ring-2 focus:ring-[#e4005a] focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-3 block font-medium text-gray-600">
              Portfolio Image
            </label>

            <div className="rounded-2xl border-2 border-dashed border-gray-300 p-5">

              {imagePreview ? (
                <img
                  src={imagePreview}
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
                disabled={loading}
                onChange={(e) => {
                  const file =
                    e.target.files?.[0];

                  if (!file)
                    return;

                  setImageFile(file);

                  setImagePreview(
                    URL.createObjectURL(
                      file
                    )
                  );
                }}
                className="mt-5 text-gray-600 file:mr-4 file:rounded-lg file:border-0 file:bg-[#ffe1ec] file:px-4 file:py-2 file:text-[#e4005a]"
              />
            </div>
          </div>

        </div>

        <div className="flex justify-end gap-3 border-t px-8 py-6">

          <button
            disabled={loading}
            onClick={() => {
              resetForm();
              setSelectedPortfolio(null);
              onClose();
            }}
            className="rounded-xl border border-gray-300 px-6 py-3 text-gray-600 hover:bg-gray-100"
          >
            Cancel
          </button>

          <button
            disabled={loading}
            onClick={handleSubmit}
            className="rounded-xl bg-[#e4005a] px-6 py-3 font-semibold text-white hover:bg-[#c8004e] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading
              ? "Please wait..."
              : selectedPortfolio
              ? "Update Portfolio"
              : "Upload Portfolio"}
          </button>

        </div>

      </div>
    </div>
  );
}