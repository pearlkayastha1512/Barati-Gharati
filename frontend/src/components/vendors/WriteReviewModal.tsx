// "use client";

// import { useState } from "react";
// import { X, Star } from "lucide-react";
// import { toast } from "sonner";

// import { useAuthStore } from "@/store/authStore";
// import { useReviewStore } from "@/store/reviewStore";

// interface WriteReviewModalProps {
//   open: boolean;
//   onClose: () => void;
//   vendorId: number;
//   vendorName: string;
// }

// export default function WriteReviewModal({
//   open,
//   onClose,
//   vendorId,
//   vendorName,
// }: WriteReviewModalProps) {
//   const { user } = useAuthStore();
//   const { addReview } = useReviewStore();

//   const [rating, setRating] = useState(5);
//   const [comment, setComment] = useState("");

//   if (!open) return null;

//   const handleSubmit = () => {
//     if (!comment.trim()) {
//       toast.error("Please write a review.");
//       return;
//     }

//     if (!user) {
//       toast.error("Please login.");
//       return;
//     }

//     addReview({
//       id: crypto.randomUUID(),
//       bookingId: "",
//       customerId: user._id,
//       vendorId,
//       customerName: user.name,
//       vendorName,
//       rating,
//       comment,
//       customerImage: "",
//       createdAt: new Date().toISOString(),
//       updatedAt: new Date().toISOString(),
//     });

//     toast.success("Review submitted.");

//     setComment("");
//     setRating(5);

//     onClose();
//   };

//   return (
//     <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-6">
//       <div className="w-full max-w-xl rounded-3xl bg-white shadow-2xl">
//         {/* Header */}
//         <div className="flex items-center justify-between border-b px-8 py-6">
//           <h2 className="text-2xl font-bold text-gray-700">
//             Write Review
//           </h2>

//           <button
//             onClick={onClose}
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
//                   onClick={() => setRating(star)}
//                 >
//                   <Star
//                     size={34}
//                     fill={star <= rating ? "#facc15" : "none"}
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
//               onChange={(e) => setComment(e.target.value)}
//               placeholder="Share your experience..."
//               className="w-full rounded-xl border border-gray-300 p-4 text-gray-600 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-500"
//             />
//           </div>
//         </div>

//         {/* Footer */}
//         <div className="flex justify-end gap-3 border-t px-8 py-6">
//           <button
//             onClick={onClose}
//             className="rounded-xl border border-gray-300 px-6 py-3 text-gray-600 transition hover:bg-gray-100"
//           >
//             Cancel
//           </button>

//           <button
//             onClick={handleSubmit}
//             className="rounded-xl bg-rose-500 px-6 py-3 font-semibold text-white transition hover:bg-rose-600"
//           >
//             Submit Review
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }



"use client";

import { useEffect, useState } from "react";
import { X, Star } from "lucide-react";
import { toast } from "sonner";

import { useAuthStore } from "@/store/authStore";
import { useReviewStore } from "@/store/reviewStore";

interface WriteReviewModalProps {
  open: boolean;
  onClose: () => void;
  vendorId: number;
  vendorName: string;
}

export default function WriteReviewModal({
  open,
  onClose,
  vendorId,
  vendorName,
}: WriteReviewModalProps) {
  const { user } = useAuthStore();

  const {
    addReview,
    updateExistingReview,
    selectedReview,
    setSelectedReview,
  } = useReviewStore();

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  useEffect(() => {
    if (selectedReview) {
      setRating(selectedReview.rating);
      setComment(selectedReview.comment);
    } else {
      setRating(5);
      setComment("");
    }
  }, [selectedReview, open]);

  if (!open) return null;

  const handleSubmit = () => {
    if (!comment.trim()) {
      toast.error("Please write a review.");
      return;
    }

    if (!user) {
      toast.error("Please login.");
      return;
    }

    if (selectedReview) {
      updateExistingReview({
        ...selectedReview,
        rating,
        comment,
        updatedAt: new Date().toISOString(),
      });

      toast.success("Review updated.");
    } else {
      addReview({
        id: crypto.randomUUID(),

        bookingId: "",

        customerId: user._id,

        vendorId,

        customerName: user.name,

        vendorName,

        rating,

        comment,

        customerImage: "",

        createdAt: new Date().toISOString(),

        updatedAt: new Date().toISOString(),
      });

      toast.success("Review submitted.");
    }

    setComment("");
    setRating(5);

    setSelectedReview(null);

    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-6">
      <div className="w-full max-w-xl rounded-3xl bg-white shadow-2xl">
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
        <div className="space-y-6 p-8">
          <div>
            <label className="mb-3 block font-medium text-gray-600">
              Rating
            </label>

            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
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
              ))}
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
            className="rounded-xl bg-rose-500 px-6 py-3 font-semibold text-white transition hover:bg-rose-600"
          >
            {selectedReview
              ? "Update Review"
              : "Submit Review"}
          </button>
        </div>
      </div>
    </div>
  );
}