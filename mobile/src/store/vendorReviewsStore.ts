import { create } from "zustand";
import { VendorReviewRecord } from "../types/vendorReview";

// TODO: import API functions once wired up
// import { getReviewsByVendor, replyToReview } from "../api/review.api";

interface VendorReviewsState {
  reviews: VendorReviewRecord[];
  setReviews: (reviews: VendorReviewRecord[]) => void;
  submitReply: (reviewId: string, reply: string) => void;
}

// TODO: on mount (in ReviewsScreen), call:
//   const data = await getReviewsByVendor(vendorId);  // GET /reviews/vendor/:vendorId
//   setReviews(data);
// submitReply should call:
//   await replyToReview(reviewId, { reply });  // PATCH /reviews/:id/reply
// then update local state optimistically (as below), with rollback on failure
export const useVendorReviewsStore = create<VendorReviewsState>((set) => ({
  reviews: [],

  setReviews: (reviews) => set({ reviews }),

  submitReply: (reviewId, reply) => {
    set((state) => ({
      reviews: state.reviews.map((r) =>
        r.id === reviewId
          ? { ...r, reply, repliedAt: new Date().toISOString() }
          : r
      ),
    }));
  },
}));