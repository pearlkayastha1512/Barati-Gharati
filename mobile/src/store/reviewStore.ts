import { create } from "zustand";
import {
  getMyReviews,
  getReviewsByVendor,
  createReview as apiCreateReview,
  updateReview as apiUpdateReview,
  deleteReview as apiDeleteReview,
  uploadReviewPhotos,
} from "../api/review.api";

export type Review = {
  id: string;
  vendorId: string;
  userId: string;
  bookingId: string;
  rating: number;
  text: string;
  proofImages: string[];
  date: string;
   reply?: string | null;
  repliedAt?: string;
};

interface ReviewState {
  reviews: Review[];
  loadingVendorId: string | null;
  loadMyReviews: () => Promise<void>;
  loadReviewsForVendor: (vendorId: string) => Promise<void>;
  addReview: (
    bookingId: string,
    vendorId: string,
    userId: string,
    rating: number,
    text: string,
    photos?: string[], // 👈 local device URIs from image picker, not yet uploaded
  ) => Promise<boolean>;
  updateReview: (
    reviewId: string,
    rating: number,
    text: string,
    photos?: string[], // 👈 local device URIs from image picker, not yet uploaded
  ) => Promise<boolean>;
  deleteReview: (reviewId: string) => Promise<boolean>;
  getReviewsForVendor: (vendorId: string) => Review[];
  getUserReviewForVendor: (vendorId: string, userId: string) => Review | undefined;
  getVendorAverage: (vendorId: string) => { average: number; total: number; breakdown: number[] };
}

const mapRecord = (review: any): Review => ({
  id: review.id,
  vendorId: String(review.vendorId),
  userId: review.userId ?? review.customerId,
  bookingId: review.bookingId,
  rating: review.rating,
  text: review.comment ?? "",
  proofImages: review.proofImages ?? [],
  reply: review.reply ?? null,
  repliedAt: review.repliedAt,
  date: review.createdAt ?? review.updatedAt ?? new Date().toISOString(),
});

// Ensures the reviews array can never contain two entries with the same id,
// no matter which loading/mutation paths ran or overlapped.
const dedupeById = (reviews: Review[]): Review[] => {
  const map = new Map<string, Review>();
  for (const r of reviews) {
    map.set(r.id, r);
  }
  return Array.from(map.values());
};

// Uploads only local device URIs (file://, ph://, content://) and leaves
// already-hosted URLs (http/https) untouched — needed when editing a review
// that already has some server-side photos mixed with newly picked ones.
const uploadLocalPhotosIfAny = async (photos?: string[]): Promise<string[]> => {
  if (!photos || photos.length === 0) return [];

  const localUris = photos.filter((uri) => !uri.startsWith("http"));
  const alreadyHosted = photos.filter((uri) => uri.startsWith("http"));

  if (localUris.length === 0) return alreadyHosted;

  const uploadedUrls = await uploadReviewPhotos(localUris);
  return [...alreadyHosted, ...uploadedUrls];
};

export const useReviewStore = create<ReviewState>((set, get) => ({
  reviews: [],
  loadingVendorId: null,

  loadMyReviews: async () => {
    try {
      const reviews = await getMyReviews();
      const mine = reviews.map(mapRecord);
      set((state) => {
        const otherVendors = state.reviews.filter(
          (r) => !mine.some((m) => m.id === r.id),
        );
        return { reviews: dedupeById([...otherVendors, ...mine]) };
      });
    } catch {
      // Keep the last successful snapshot when a refresh fails.
    }
  },

  loadReviewsForVendor: async (vendorId) => {
    set({ loadingVendorId: vendorId });
    try {
      const reviews = await getReviewsByVendor(vendorId);
      const vendorReviews = reviews.map(mapRecord);
      set((state) => {
        const others = state.reviews.filter((r) => r.vendorId !== vendorId);
        return { reviews: dedupeById([...others, ...vendorReviews]) };
      });
    } catch {
      // Keep whatever was already loaded for this vendor on failure.
    } finally {
      set({ loadingVendorId: null });
    }
  },

  addReview: async (bookingId, vendorId, userId, rating, text, photos) => {
    try {
      // Photos abhi local device URIs hain — pehle server pe upload karo,
      // phir unke public URLs hi backend ko bhejo.
      const uploadedUrls = await uploadLocalPhotosIfAny(photos);

      const created = await apiCreateReview({
        bookingId,
        rating,
        comment: text,
        proofImages: uploadedUrls,
      });
      const newReview = mapRecord({ ...created, vendorId, userId });
      set((state) => ({ reviews: dedupeById([newReview, ...state.reviews]) }));
      return true;
    } catch {
      return false;
    }
  },

  updateReview: async (reviewId, rating, text, photos) => {
    const previous = get().reviews;
    try {
      const uploadedUrls = await uploadLocalPhotosIfAny(photos);

      // Optimistic update
      set((state) => ({
        reviews: state.reviews.map((r) =>
          r.id === reviewId
            ? {
                ...r,
                rating,
                text,
                proofImages: photos ? uploadedUrls : r.proofImages,
                date: new Date().toISOString(),
              }
            : r,
        ),
      }));

      // ⚠️ NOTE: apiUpdateReview ka dto abhi sirf { rating?, comment? } accept karta hai
      // (review.api.ts mein check karo) — agar photos update karne hain to backend
      // team se bolna hoga is endpoint mein `proofImages` field bhi accept karwaye.
      await apiUpdateReview(reviewId, { rating, comment: text });
      return true;
    } catch {
      set({ reviews: previous });
      return false;
    }
  },

  deleteReview: async (reviewId) => {
    const previous = get().reviews;
    set((state) => ({ reviews: state.reviews.filter((r) => r.id !== reviewId) }));
    try {
      await apiDeleteReview(reviewId);
      return true;
    } catch {
      set({ reviews: previous });
      return false;
    }
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
      (star) => vendorReviews.filter((r) => r.rating === star).length,
    );

    return { average, total, breakdown };
  },
}));