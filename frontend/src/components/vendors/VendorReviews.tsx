




// "use client";

// import { useEffect, useMemo, useState } from "react";
// import { Star } from "lucide-react";

// import { useReviewStore } from "@/store/reviewStore";
// import { useAuthStore } from "@/store/authStore";
// import { useBookingStore } from "@/store/bookingStore";

// import WriteReviewModal from "./WriteReviewModal";

// interface VendorReviewsProps {
//   vendorId: number;
//   vendorName: string;
// }

// export default function VendorReviews({
//   vendorId,
//   vendorName,
// }: VendorReviewsProps) {
//   const [open, setOpen] = useState(false);

//   const { user } = useAuthStore();

//   const {
//     bookings,
//     loadCustomerBookings,
//   } = useBookingStore();

//   useEffect(() => {
//     if (
//       user &&
//       user.role === "customer"
//     ) {
//       loadCustomerBookings(user._id);
//     }
//   }, [user, loadCustomerBookings]);

//   const {
//     reviews,
//     loadVendorReviews,
//   } = useReviewStore();

//   useEffect(() => {
//     loadVendorReviews(vendorId);
//   }, [vendorId, loadVendorReviews]);

//   const averageRating = useMemo(() => {
//     if (reviews.length === 0) {
//       return 0;
//     }

//     const total = reviews.reduce(
//       (sum, review) => sum + review.rating,
//       0
//     );

//     return Number(
//       (total / reviews.length).toFixed(1)
//     );
//   }, [reviews]);

//   const ratingCount = (star: number) =>
//     reviews.filter(
//       (review) => review.rating === star
//     ).length;

//   const hasBookedVendor = useMemo(() => {
//     if (!user || user.role !== "customer") {
//       return false;
//     }

//     return bookings.some(
//       (booking) =>
//         booking.vendorId === vendorId
//     );
//   }, [bookings, vendorId, user]);

//   return (
//     <>
//       <section className="rounded-3xl bg-white p-8 shadow-sm">
//         <div className="flex items-center justify-between">
//           <div>
//             <h2 className="text-3xl font-bold text-gray-900">
//               Customer Reviews
//             </h2>

//             <p className="mt-2 text-gray-500">
//               Hear what couples say about this vendor.
//             </p>
//           </div>

//           {hasBookedVendor && (
//             <button
//               onClick={() => setOpen(true)}
//               className="rounded-xl bg-rose-500 px-5 py-3 font-semibold text-white transition hover:bg-rose-600"
//             >
//               Write Review
//             </button>
//           )}
//         </div>

//         {/* Rating Summary */}
//         <div className="mt-10 flex flex-col gap-6 rounded-2xl bg-rose-50 p-6 md:flex-row md:items-center md:justify-between">
//           <div>
//             <h3 className="text-5xl font-bold text-gray-900">
//               {averageRating || "0.0"}
//             </h3>

//             <div className="mt-2 flex text-yellow-400">
//               {[1, 2, 3, 4, 5].map((star) => (
//                 <Star
//                   key={star}
//                   size={22}
//                   fill={
//                     star <= Math.round(averageRating)
//                       ? "currentColor"
//                       : "none"
//                   }
//                 />
//               ))}
//             </div>

//             <p className="mt-2 text-gray-500">
//               Based on {reviews.length} Reviews
//             </p>
//           </div>

//           <div className="space-y-3">
//             {[5, 4, 3, 2, 1].map((star) => {
//               const count = ratingCount(star);

//               const width =
//                 reviews.length === 0
//                   ? 0
//                   : (count / reviews.length) * 100;

//               return (
//                 <div
//                   key={star}
//                   className="flex items-center gap-4"
//                 >
//                   <span className="w-8 text-sm font-medium">
//                     {star}★
//                   </span>

//                   <div className="h-2 w-48 overflow-hidden rounded-full bg-gray-200">
//                     <div
//                       className="h-full rounded-full bg-yellow-400"
//                       style={{
//                         width: `${width}%`,
//                       }}
//                     />
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         </div>

//         {/* Reviews */}
//         <div className="mt-10 space-y-6">
//           {reviews.length === 0 ? (
//             <div className="rounded-2xl border border-dashed border-gray-300 p-10 text-center text-gray-500">
//               No reviews yet.
//             </div>
//           ) : (
//             reviews.map((review) => (
//               <div
//                 key={review.id}
//                 className="rounded-2xl border border-gray-200 p-6"
//               >
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <h4 className="font-semibold text-gray-900">
//                       {review.customerName}
//                     </h4>

//                     <p className="text-sm text-gray-500">
//                       {new Date(
//                         review.createdAt
//                       ).toLocaleDateString()}
//                     </p>
//                   </div>

//                   <div className="flex text-yellow-400">
//                     {[1, 2, 3, 4, 5].map((star) => (
//                       <Star
//                         key={star}
//                         size={18}
//                         fill={
//                           star <= review.rating
//                             ? "currentColor"
//                             : "none"
//                         }
//                       />
//                     ))}
//                   </div>
//                 </div>

//                 <p className="mt-4 leading-7 text-gray-600">
//                   {review.comment}
//                 </p>
//               </div>
//             ))
//           )}
//         </div>
//       </section>

//       <WriteReviewModal
//         open={open}
//         onClose={() => setOpen(false)}
//         vendorId={vendorId}
//         vendorName={vendorName}
//       />
//     </>
//   );
// }


"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Star,
  Pencil,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";

import { useReviewStore } from "@/store/reviewStore";
import { useAuthStore } from "@/store/authStore";
import { useBookingStore } from "@/store/bookingStore";

import WriteReviewModal from "./WriteReviewModal";

interface VendorReviewsProps {
  vendorId: number;
  vendorName: string;
}

export default function VendorReviews({
  vendorId,
  vendorName,
}: VendorReviewsProps) {
  const [open, setOpen] = useState(false);

  const { user } = useAuthStore();

  const { bookings, loadCustomerBookings } =
    useBookingStore();

  useEffect(() => {
    if (
      user &&
      user.role === "customer"
    ) {
      loadCustomerBookings(user._id);
    }
  }, [user, loadCustomerBookings]);

  const {
    reviews,
    loadVendorReviews,
    setSelectedReview,
    deleteExistingReview,
  } = useReviewStore();

  useEffect(() => {
    loadVendorReviews(vendorId);
  }, [vendorId, loadVendorReviews]);

  const averageRating = useMemo(() => {
    if (reviews.length === 0) {
      return 0;
    }

    const total = reviews.reduce(
      (sum, review) => sum + review.rating,
      0
    );

    return Number(
      (total / reviews.length).toFixed(1)
    );
  }, [reviews]);

  const ratingCount = (star: number) =>
    reviews.filter(
      (review) => review.rating === star
    ).length;

  const hasBookedVendor = useMemo(() => {
    if (
      !user ||
      user.role !== "customer"
    ) {
      return false;
    }

    return bookings.some(
      (booking) =>
        booking.vendorId === vendorId
    );
  }, [bookings, vendorId, user]);

  return (
    <>
      <section className="rounded-3xl bg-white p-8 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">
              Customer Reviews
            </h2>

            <p className="mt-2 text-gray-500">
              Hear what couples say about this vendor.
            </p>
          </div>

          {hasBookedVendor && (
            <button
              onClick={() => {
                setSelectedReview(null);
                setOpen(true);
              }}
              className="rounded-xl bg-rose-500 px-5 py-3 font-semibold text-white transition hover:bg-rose-600"
            >
              Write Review
            </button>
          )}
        </div>

        {/* Rating Summary */}
        <div className="mt-10 flex flex-col gap-6 rounded-2xl bg-rose-50 p-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="text-5xl font-bold text-gray-900">
              {averageRating || "0.0"}
            </h3>

            <div className="mt-2 flex text-yellow-400">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={22}
                  fill={
                    star <=
                    Math.round(
                      averageRating
                    )
                      ? "currentColor"
                      : "none"
                  }
                />
              ))}
            </div>

            <p className="mt-2 text-gray-500">
              Based on {reviews.length} Reviews
            </p>
          </div>

          <div className="space-y-3">
            {[5, 4, 3, 2, 1].map(
              (star) => {
                const count =
                  ratingCount(star);

                const width =
                  reviews.length === 0
                    ? 0
                    : (count /
                        reviews.length) *
                      100;

                return (
                  <div
                    key={star}
                    className="flex items-center gap-4"
                  >
                    <span className="w-8 text-sm font-medium">
                      {star}★
                    </span>

                    <div className="h-2 w-48 overflow-hidden rounded-full bg-gray-200">
                      <div
                        className="h-full rounded-full bg-yellow-400"
                        style={{
                          width: `${width}%`,
                        }}
                      />
                    </div>
                  </div>
                );
              }
            )}
          </div>
        </div>

        {/* Reviews */}
        <div className="mt-10 space-y-6">
          {reviews.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-gray-300 p-10 text-center text-gray-500">
              No reviews yet.
            </div>
          ) : (
            reviews.map((review) => (
              <div
                key={review.id}
                className="rounded-2xl border border-gray-200 p-6"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      {review.customerName}
                    </h4>

                    <p className="text-sm text-gray-500">
                      {new Date(
                        review.createdAt
                      ).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex text-yellow-400">
                    {[1, 2, 3, 4, 5].map(
                      (star) => (
                        <Star
                          key={star}
                          size={18}
                          fill={
                            star <=
                            review.rating
                              ? "currentColor"
                              : "none"
                          }
                        />
                      )
                    )}
                  </div>
                </div>

                <div className="mt-4">
                  <p className="leading-7 text-gray-600">
                    {review.comment}
                  </p>

                  {user?._id ===
                    review.customerId && (
                    <div className="mt-5 flex gap-3">
                      <button
                        onClick={() => {
                          setSelectedReview(
                            review
                          );
                          setOpen(true);
                        }}
                        className="
                          flex
                          items-center
                          gap-2
                          rounded-xl
                          border
                          border-blue-200
                          bg-blue-50
                          px-4
                          py-2
                          text-sm
                          font-medium
                          text-blue-600
                          transition
                          hover:bg-blue-100
                        "
                      >
                        <Pencil
                          size={16}
                        />
                        Edit
                      </button>

                      <button
                        onClick={() => {
  toast("Delete Review?", {
    description:
      "This action cannot be undone.",

    action: {
      label: "Delete",
      onClick: () => {
        deleteExistingReview(review.id);

        loadVendorReviews(vendorId);

        toast.success(
          "Review deleted successfully."
        );
      },
    },

    cancel: {
      label: "Cancel",
      onClick: () => {
        toast.info("Deletion cancelled.");
      },
    },
  });
}}
                        className="
                          flex
                          items-center
                          gap-2
                          rounded-xl
                          border
                          border-red-200
                          bg-red-50
                          px-4
                          py-2
                          text-sm
                          font-medium
                          text-red-600
                          transition
                          hover:bg-red-100
                        "
                      >

                        <Trash2
                          size={16}
                        />
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      <WriteReviewModal
        open={open}
        onClose={() => {
          setSelectedReview(null);
          setOpen(false);
        }}
        vendorId={vendorId}
        vendorName={vendorName}
      />
    </>
  );
}