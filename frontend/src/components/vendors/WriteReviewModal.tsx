


// "use client";

// import { useEffect, useState } from "react";
// import { X, Star } from "lucide-react";
// import { toast } from "sonner";

// import { useAuthStore } from "@/store/authStore";
// import { useReviewStore } from "@/store/reviewStore";

// interface WriteReviewModalProps {
//   open: boolean;
//   onClose: () => void;
//   bookingId: string;

//   vendorId: number;
//   vendorName: string;
// }

// export default function WriteReviewModal({
//   open,
//   onClose,
//   bookingId,

//   vendorId,
//   vendorName,
// }: WriteReviewModalProps) {
//   const { user } = useAuthStore();

//   const {
//     addReview,
//     updateExistingReview,
//     selectedReview,
//     setSelectedReview,
//   } = useReviewStore();

//   const [rating, setRating] = useState(5);
//   const [comment, setComment] = useState("");

//   useEffect(() => {
//     if (selectedReview) {
//       setRating(selectedReview.rating);
//       setComment(selectedReview.comment);
//     } else {
//       setRating(5);
//       setComment("");
//     }
//   }, [selectedReview, open]);

//   if (!open) return null;

//   const handleSubmit = async() => {
//     if (!comment.trim()) {
//       toast.error("Please write a review.");
//       return;
//     }

//     if (!user) {
//       toast.error("Please login.");
//       return;
//     }

//     if (selectedReview) {
//       updateExistingReview({
//         ...selectedReview,
//         rating,
//         comment,
//         updatedAt: new Date().toISOString(),
//       });

//       toast.success("Review updated.");
//     } else {
//       // addReview({
//       //   id: crypto.randomUUID(),

//       //   bookingId: "",

//       //   customerId: user._id,

//       //   vendorId,

//       //   customerName: user.name,

//       //   vendorName,

//       //   rating,

//       //   comment,

//       //   customerImage: "",

//       //   createdAt: new Date().toISOString(),

//       //   updatedAt: new Date().toISOString(),
//       // });

//       await addReview({
//   id: "",

//   bookingId,

//   customerId: user._id,

//   vendorId,

//   customerName: user.name,

//   vendorName,

//   rating,

//   comment,

//   customerImage: "",

//   createdAt: "",

//   updatedAt: "",
// });

//       toast.success("Review submitted.");
//     }

//     setComment("");
//     setRating(5);

//     setSelectedReview(null);

//     onClose();
//   };

//   return (
//     <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-6">
//       <div className="w-full max-w-xl rounded-3xl bg-white shadow-2xl">
//         {/* Header */}
//         <div className="flex items-center justify-between border-b px-8 py-6">
//           <h2 className="text-2xl font-bold text-gray-700">
//             {selectedReview
//               ? "Edit Review"
//               : "Write Review"}
//           </h2>

//           <button
//             onClick={() => {
//               setSelectedReview(null);
//               onClose();
//             }}
//             className="text-gray-500 transition hover:text-gray-700"
//           >
//             <X />
//           </button>
//         </div>

//         {/* Body */}
//         <div className="space-y-6 p-8">
//           <div>
//             <label className="mb-3 block font-medium text-gray-600">
//               Rating
//             </label>

//             <div className="flex gap-2">
//               {[1, 2, 3, 4, 5].map((star) => (
//                 <button
//                   key={star}
//                   type="button"
//                   onClick={() => setRating(star)}
//                 >
//                   <Star
//                     size={34}
//                     fill={
//                       star <= rating
//                         ? "#facc15"
//                         : "none"
//                     }
//                     className="text-yellow-400"
//                   />
//                 </button>
//               ))}
//             </div>
//           </div>

//           <div>
//             <label className="mb-3 block font-medium text-gray-600">
//               Review
//             </label>

//             <textarea
//               rows={5}
//               value={comment}
//               onChange={(e) =>
//                 setComment(e.target.value)
//               }
//               placeholder="Share your experience..."
//               className="w-full rounded-xl border border-gray-300 p-4 text-gray-600 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-500"
//             />
//           </div>
//         </div>

//         {/* Footer */}
//         <div className="flex justify-end gap-3 border-t px-8 py-6">
//           <button
//             onClick={() => {
//               setSelectedReview(null);
//               onClose();
//             }}
//             className="rounded-xl border border-gray-300 px-6 py-3 text-gray-600 transition hover:bg-gray-100"
//           >
//             Cancel
//           </button>

//           <button
//             onClick={handleSubmit}
//             className="rounded-xl bg-rose-500 px-6 py-3 font-semibold text-white transition hover:bg-rose-600"
//           >
//             {selectedReview
//               ? "Update Review"
//               : "Submit Review"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }


"use client";

import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { ImagePlus, Loader2, Star, Trash2, X } from "lucide-react";
import { toast } from "sonner";

import { useAuthStore } from "@/store/authStore";
import { useReviewStore } from "@/store/reviewStore";
import { uploadReviewImagesApi } from "@/services/api/review.api";

const MAX_REVIEW_IMAGES = 5;
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

interface WriteReviewModalProps {
  open: boolean;
  onClose: () => void;

  bookingId: string;

  vendorId: number;
  vendorName: string;
}

export default function WriteReviewModal({
  open,
  onClose,
  bookingId,
  vendorId,
  vendorName,
}: WriteReviewModalProps) {
  const { user } = useAuthStore();

  const {
    addReview,
    updateExistingReview,
    selectedReview,
    setSelectedReview,
    loadVendorReviews,
  } = useReviewStore();

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const imagePreviews = useMemo(
    () => imageFiles.map((file) => URL.createObjectURL(file)),
    [imageFiles]
  );

  useEffect(() => {
    return () => {
      imagePreviews.forEach((preview) => URL.revokeObjectURL(preview));
    };
  }, [imagePreviews]);

  useEffect(() => {
    if (!open) return;

    if (selectedReview) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setRating(selectedReview.rating);
      setComment(selectedReview.comment);
      setImageFiles([]);
    } else {
      setRating(5);
      setComment("");
      setImageFiles([]);
    }
  }, [open, selectedReview]);

  if (!open) return null;

  const handleImageSelection = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const selected = Array.from(event.target.files ?? []);
    event.target.value = "";

    const validImages = selected.filter((file) => {
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
        toast.error(`${file.name}: only JPG, PNG and WEBP are allowed.`);
        return false;
      }

      if (file.size > MAX_IMAGE_SIZE) {
        toast.error(`${file.name}: image must be within 5 MB.`);
        return false;
      }

      return true;
    });

    setImageFiles((current) => {
      const remainingSlots = MAX_REVIEW_IMAGES - current.length;

      if (validImages.length > remainingSlots) {
        toast.error(`You can upload up to ${MAX_REVIEW_IMAGES} event photos.`);
      }

      return [...current, ...validImages.slice(0, remainingSlots)];
    });
  };

  const handleSubmit = async () => {
    if (!comment.trim()) {
      toast.error("Please write a review.");
      return;
    }

    if (!user) {
      toast.error("Please login.");
      return;
    }

    setIsSubmitting(true);

    try {
      if (selectedReview) {
        const result = await updateExistingReview({
          ...selectedReview,
          rating,
          comment,
          updatedAt: new Date().toISOString(),
        });

        if (!result.ok) {
          toast.error(result.error ?? "Unable to update review.");
          return;
        }

        await loadVendorReviews(vendorId);

        toast.success("Review updated.");
      } else {
        if (!bookingId) {
          toast.error(
            "You can review after the vendor marks your event completed."
          );
          return;
        }

        let proofImages: string[] = [];

        if (imageFiles.length > 0) {
          const uploadResult = await uploadReviewImagesApi(imageFiles);

          if (!uploadResult.ok) {
            toast.error(uploadResult.error);
            return;
          }

          proofImages = uploadResult.images;
        }

        const result = await addReview({
          id: "",
          bookingId,
          customerId: user._id,
          vendorId,
          customerName: user.name,
          vendorName,
          rating,
          comment,
          customerImage: "",
          proofImages,
          createdAt: "",
          updatedAt: "",
        });

        if (!result.ok) {
          toast.error(result.error ?? "Unable to submit review.");
          return;
        }

        await loadVendorReviews(vendorId);

        toast.success("Review and event photos submitted.");
      }

      setComment("");
      setRating(5);
      setImageFiles([]);

      setSelectedReview(null);

      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-6">
      <div className="flex max-h-[90vh] w-full max-w-xl flex-col rounded-3xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b px-8 py-6">
          <h2 className="text-2xl font-bold text-gray-700">
            {selectedReview
              ? "Edit Review"
              : "Write Review"}
          </h2>

          <button
            onClick={() => {
              setSelectedReview(null);
              onClose();
            }}
            className="text-gray-500 transition hover:text-gray-700"
          >
            <X />
          </button>
        </div>

        {/* Body */}
        <div className="space-y-6 overflow-y-auto p-8">
          <div>
            <label className="mb-3 block font-medium text-gray-600">
              Rating
            </label>

            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map(
                (star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() =>
                      setRating(star)
                    }
                  >
                    <Star
                      size={34}
                      fill={
                        star <= rating
                          ? "#facc15"
                          : "none"
                      }
                      className="text-yellow-400"
                    />
                  </button>
                )
              )}
            </div>
          </div>

          <div>
            <label className="mb-3 block font-medium text-gray-600">
              Review
            </label>

            <textarea
              rows={5}
              value={comment}
              onChange={(e) =>
                setComment(e.target.value)
              }
              placeholder="Share your experience..."
              className="w-full rounded-xl border border-gray-300 p-4 text-gray-600 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>

          {!selectedReview && (
            <div>
              <div className="flex items-end justify-between gap-4">
                <div>
                  <label className="block font-medium text-gray-700">
                    Event Photos <span className="text-gray-400">(Optional)</span>
                  </label>
                  <p className="mt-1 text-sm text-gray-500">
                    Add up to 5 JPG, PNG or WEBP photos, maximum 5 MB each.
                  </p>
                </div>
                <span className="text-sm font-semibold text-rose-600">
                  {imageFiles.length}/{MAX_REVIEW_IMAGES}
                </span>
              </div>

              {imagePreviews.length > 0 && (
                <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {imagePreviews.map((preview, index) => (
                    <div
                      key={`${imageFiles[index].name}-${index}`}
                      className="group relative aspect-square overflow-hidden rounded-2xl border border-rose-100 bg-rose-50 bg-cover bg-center"
                      style={{ backgroundImage: `url(${JSON.stringify(preview)})` }}
                    >
                      <button
                        type="button"
                        onClick={() =>
                          setImageFiles((current) =>
                            current.filter((_, itemIndex) => itemIndex !== index)
                          )
                        }
                        aria-label={`Remove ${imageFiles[index].name}`}
                        className="absolute right-2 top-2 rounded-full bg-black/65 p-2 text-white transition hover:bg-rose-600"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {imageFiles.length < MAX_REVIEW_IMAGES && (
                <label className="mt-4 flex cursor-pointer items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-rose-200 bg-rose-50/60 px-5 py-5 font-semibold text-rose-600 transition hover:border-rose-400 hover:bg-rose-50">
                  <ImagePlus size={22} />
                  Select Event Photos
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    multiple
                    onChange={handleImageSelection}
                    className="sr-only"
                  />
                </label>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 border-t px-8 py-6">
          <button
            onClick={() => {
              setSelectedReview(null);
              onClose();
            }}
            className="rounded-xl border border-gray-300 px-6 py-3 text-gray-600 transition hover:bg-gray-100"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="inline-flex min-w-40 items-center justify-center gap-2 rounded-xl bg-rose-500 px-6 py-3 font-semibold text-white transition hover:bg-rose-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting && <Loader2 size={18} className="animate-spin" />}
            {isSubmitting
              ? "Submitting..."
              : selectedReview
              ? "Update Review"
              : "Submit Review"}
          </button>
        </div>
      </div>
    </div>
  );
}
