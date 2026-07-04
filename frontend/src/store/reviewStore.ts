import { create } from "zustand";

import { Review } from "@/types/review";

import {
  getReviews,
  createReview,
  updateReview,
  deleteReview,
  getVendorReviews,
  getCustomerReviews,
} from "@/services/review.service";

interface ReviewStore {
  reviews: Review[];

  selectedReview: Review | null;

  loadReviews: () => void;

  loadVendorReviews: (
    vendorId: number
  ) => void;

  loadCustomerReviews: (
    customerId: string
  ) => void;

  setSelectedReview: (
    review: Review | null
  ) => void;

  addReview: (
    review: Review
  ) => void;

  updateExistingReview: (
    review: Review
  ) => void;

  replyToReview: (
    reviewId: string,
    reply: string
  ) => void;

  deleteExistingReview: (
    id: string
  ) => void;
}

export const useReviewStore =
  create<ReviewStore>((set) => ({
    reviews: [],

    selectedReview: null,

    loadReviews: () => {
      set({
        reviews: getReviews(),
      });
    },

    loadVendorReviews: (
      vendorId
    ) => {
      set({
        reviews:
          getVendorReviews(vendorId),
      });
    },

    loadCustomerReviews: (
      customerId
    ) => {
      set({
        reviews:
          getCustomerReviews(customerId),
      });
    },

    setSelectedReview: (
      review
    ) => {
      set({
        selectedReview: review,
      });
    },

    addReview: (review) => {
      createReview(review);

      set({
        reviews: getReviews(),
      });
    },

    updateExistingReview: (
      review
    ) => {
      updateReview(review);

      set({
        reviews: getReviews(),
      });
    },
    replyToReview: (
  reviewId,
  reply
) => {
  const review = getReviews().find(
    (item) => item.id === reviewId
  );

  if (!review) {
    return;
  }

  updateReview({
    ...review,

    reply,

    repliedAt:
      new Date().toISOString(),
  });

  set({
    reviews: getReviews(),
  });
},

    deleteExistingReview: (
      id
    ) => {
      deleteReview(id);

      set({
        reviews: getReviews(),
      });
    },
  }));