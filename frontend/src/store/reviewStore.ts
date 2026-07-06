// import { create } from "zustand";

// import { Review } from "@/types/review";

// import {
//   getReviews,
//   createReview,
//   updateReview,
//   deleteReview,
//   getVendorReviews,
//   getCustomerReviews,
// } from "@/services/review.service";

// interface ReviewStore {
//   reviews: Review[];

//   selectedReview: Review | null;

//   loadReviews: () => void;

//   loadVendorReviews: (
//     vendorId: number
//   ) => void;

//   loadCustomerReviews: (
//     customerId: string
//   ) => void;

//   setSelectedReview: (
//     review: Review | null
//   ) => void;

//   addReview: (
//     review: Review
//   ) => void;

//   updateExistingReview: (
//     review: Review
//   ) => void;

//   replyToReview: (
//     reviewId: string,
//     reply: string
//   ) => void;

//   deleteExistingReview: (
//     id: string
//   ) => void;
// }

// export const useReviewStore =
//   create<ReviewStore>((set) => ({
//     reviews: [],

//     selectedReview: null,

//     loadReviews: () => {
//       set({
//         reviews: getReviews(),
//       });
//     },

//     loadVendorReviews: (
//       vendorId
//     ) => {
//       set({
//         reviews:
//           getVendorReviews(vendorId),
//       });
//     },

//     loadCustomerReviews: (
//       customerId
//     ) => {
//       set({
//         reviews:
//           getCustomerReviews(customerId),
//       });
//     },

//     setSelectedReview: (
//       review
//     ) => {
//       set({
//         selectedReview: review,
//       });
//     },

//     addReview: (review) => {
//       createReview(review);

//       set({
//         reviews: getReviews(),
//       });
//     },

//     updateExistingReview: (
//       review
//     ) => {
//       updateReview(review);

//       set({
//         reviews: getReviews(),
//       });
//     },
//     replyToReview: (
//   reviewId,
//   reply
// ) => {
//   const review = getReviews().find(
//     (item) => item.id === reviewId
//   );

//   if (!review) {
//     return;
//   }

//   updateReview({
//     ...review,

//     reply,

//     repliedAt:
//       new Date().toISOString(),
//   });

//   set({
//     reviews: getReviews(),
//   });
// },

//     deleteExistingReview: (
//       id
//     ) => {
//       deleteReview(id);

//       set({
//         reviews: getReviews(),
//       });
//     },
//   }));





import { create } from "zustand";

import { Review } from "@/types/review";

import {
  getReviews,
  getVendorReviews,
  getCustomerReviews,
  createReview,
  updateReview,
  replyReview,
  deleteReview,
} from "@/services/review.service";

interface ReviewStore {
  reviews: Review[];

  selectedReview: Review | null;

  loading: boolean;

  loadReviews: () => Promise<void>;

  loadVendorReviews: (
    vendorId: number
  ) => Promise<void>;

  loadCustomerReviews: (
    customerId: string
  ) => Promise<void>;

  setSelectedReview: (
    review: Review | null
  ) => void;

  addReview: (
    review: Review
  ) => Promise<boolean>;

  updateExistingReview: (
    review: Review
  ) => Promise<boolean>;

  replyToReview: (
    reviewId: string,
    reply: string
  ) => Promise<boolean>;

  deleteExistingReview: (
    id: string
  ) => Promise<boolean>;
}

export const useReviewStore =
  create<ReviewStore>((set, get) => ({
    reviews: [],

    selectedReview: null,

    loading: false,

    loadReviews: async () => {
      set({
        loading: true,
      });

      const reviews =
        await getReviews();

      set({
        reviews,
        loading: false,
      });
    },

    loadVendorReviews: async (
      vendorId
    ) => {
      set({
        loading: true,
      });

      const reviews =
        await getVendorReviews(
          vendorId
        );

      set({
        reviews,
        loading: false,
      });
    },

    loadCustomerReviews: async (
      customerId
    ) => {
      set({
        loading: true,
      });

      const reviews =
        await getCustomerReviews(
          customerId
        );

      set({
        reviews,
        loading: false,
      });
    },

    

    setSelectedReview: (
      review
    ) =>
      set({
        selectedReview: review,
      }),

    addReview: async (
      review
    ) => {
      const success =
        await createReview(
          review
        );

      if (!success) {
        return false;
      }

      const reviews =
        await getVendorReviews(
          review.vendorId
        );

      set({
        reviews,
      });

      return true;
    },

    updateExistingReview:
      async (review) => {
        const success =
          await updateReview(
            review
          );

        if (!success) {
          return false;
        }

        const reviews =
          await getVendorReviews(
            review.vendorId
          );

        set({
          reviews,
        });

        return true;
      },

    replyToReview: async (
      reviewId,
      reply
    ) => {
      const review = get().reviews.find(
        (r) => r.id === reviewId
      );

      const success =
        await replyReview(
          reviewId,
          reply
        );

      if (!success) {
        return false;
      }

      if (review) {
        const reviews =
          await getVendorReviews(
            review.vendorId
          );

        set({
          reviews,
        });
      }

      return true;
    },

    deleteExistingReview:
      async (id) => {
        const review =
          get().reviews.find(
            (r) => r.id === id
          );

        const success =
          await deleteReview(id);

        if (!success) {
          return false;
        }

        if (review) {
          const reviews =
            await getVendorReviews(
              review.vendorId
            );

          set({
            reviews,
          });
        }

        return true;
      },
  }));