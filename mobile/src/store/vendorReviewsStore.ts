import { create } from "zustand";
import { VendorReviewRecord } from "../types/vendorReview";
import {
  getReviewsByVendor,
  replyToReview,
} from "../api/vendorReviews.api";

interface VendorReviewsState {
  reviews: VendorReviewRecord[];
  isLoading: boolean;
  error: string | null;

  fetchReviews: (vendorId: string) => Promise<void>;
  submitReply: (reviewId: string, reply: string) => Promise<void>;
}

export const useVendorReviewsStore = create<VendorReviewsState>(
  (set, get) => ({
    reviews: [],
    isLoading: false,
    error: null,

    fetchReviews: async (vendorId: string) => {
      set({ isLoading: true, error: null });

      try {
        const data = await getReviewsByVendor(vendorId);
        set({ reviews: data, isLoading: false });
      } catch (error) {
        console.log("Failed to fetch reviews", error);
        set({ isLoading: false, error: "Failed to load reviews" });
      }
    },

    submitReply: async (reviewId: string, reply: string) => {
  try {
    const updated = await replyToReview(reviewId, reply);

    set({
      reviews: get().reviews.map((r) =>
        r.id === reviewId
          ? {
              ...r,
              reply: updated.reply,
              repliedAt: updated.repliedAt,
            }
          : r,
      ),
    });
  } catch (error) {
    console.log("Failed to submit reply", error);
    throw error;
  }
},
  }),
);