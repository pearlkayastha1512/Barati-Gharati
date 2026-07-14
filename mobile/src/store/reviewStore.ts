import { create } from "zustand";
import { getMyReviews } from "../api/review.api";

export type Review = {
  id: string;
  vendorId: string;
  userId: string;
  rating: number;
  text: string;
  date: string;
};

interface ReviewState {
  reviews: Review[];
  loadMyReviews: () => Promise<void>;
  addReview: (vendorId: string, userId: string, rating: number, text: string) => void;
  updateReview: (reviewId: string, rating: number, text: string) => void;
  deleteReview: (reviewId: string) => void;
  getReviewsForVendor: (vendorId: string) => Review[];
  getUserReviewForVendor: (vendorId: string, userId: string) => Review | undefined;
  getVendorAverage: (vendorId: string) => { average: number; total: number; breakdown: number[] };
}

// TODO: once backend is connected, replace local state with API-backed state:
// - on mount (per vendor), fetch via getVendorReviews(vendorId) and populate reviews
// - addReview should call createReview(vendorId, { rating, text })
// - updateReview should call updateReview(reviewId, { rating, text })
// - deleteReview should call deleteReview(reviewId) — optimistic update with rollback on failure
export const useReviewStore = create<ReviewState>((set, get) => ({
  reviews: [],

  loadMyReviews: async () => {
    try {
      const reviews = await getMyReviews();
      set({
        reviews: reviews.map((review) => ({
          id: review.id,
          vendorId: String(review.vendorId),
          userId: review.customerId,
          rating: review.rating,
          text: review.comment ?? "",
          date: review.createdAt,
        })),
      });
    } catch {
      // Keep the last successful snapshot when a refresh fails.
    }
  },

  addReview: (vendorId, userId, rating, text) => {
    const newReview: Review = {
      id: Date.now().toString(),
      vendorId,
      userId,
      rating,
      text,
      date: new Date().toISOString(),
    };
    set((state) => ({ reviews: [newReview, ...state.reviews] }));
  },

  updateReview: (reviewId, rating, text) => {
    set((state) => ({
      reviews: state.reviews.map((r) =>
        r.id === reviewId ? { ...r, rating, text, date: new Date().toISOString() } : r
      ),
    }));
  },

  deleteReview: (reviewId) => {
    set((state) => ({ reviews: state.reviews.filter((r) => r.id !== reviewId) }));
  },

  getReviewsForVendor: (vendorId) => {
    return get().reviews.filter((r) => r.vendorId === vendorId);
  },

  getUserReviewForVendor: (vendorId, userId) => {
    return get().reviews.find((r) => r.vendorId === vendorId && r.userId === userId);
  },

  getVendorAverage: (vendorId) => {
    const vendorReviews = get().reviews.filter((r) => r.vendorId === vendorId);
    const total = vendorReviews.length;
    if (total === 0) return { average: 0, total: 0, breakdown: [0, 0, 0, 0, 0] };

    const sum = vendorReviews.reduce((acc, r) => acc + r.rating, 0);
    const average = Math.round((sum / total) * 10) / 10;
    const breakdown = [5, 4, 3, 2, 1].map(
      (star) => vendorReviews.filter((r) => r.rating === star).length
    );

    return { average, total, breakdown };
  },
}));
