// import { Review } from "@/types/review";

// const STORAGE_KEY = "reviews";

// export function getReviews(): Review[] {
//   if (typeof window === "undefined") {
//     return [];
//   }

//   const data = localStorage.getItem(STORAGE_KEY);

//   if (!data) {
//     return [];
//   }

//   return JSON.parse(data);
// }

// export function saveReviews(
//   reviews: Review[]
// ): void {
//   localStorage.setItem(
//     STORAGE_KEY,
//     JSON.stringify(reviews)
//   );
// }

// export function createReview(
//   review: Review
// ): void {
//   const reviews = getReviews();

//   reviews.push(review);

//   saveReviews(reviews);
// }

// export function updateReview(
//   updatedReview: Review
// ): void {
//   const reviews = getReviews();

//   saveReviews(
//     reviews.map((review) =>
//       review.id === updatedReview.id
//         ? updatedReview
//         : review
//     )
//   );
// }

// export function deleteReview(
//   id: string
// ): void {
//   saveReviews(
//     getReviews().filter(
//       (review) => review.id !== id
//     )
//   );
// }

// export function getVendorReviews(
//   vendorId: number
// ): Review[] {
//   return getReviews().filter(
//     (review) => review.vendorId === vendorId
//   );
// }

// export function getCustomerReviews(
//   customerId: string
// ): Review[] {
//   return getReviews().filter(
//     (review) =>
//       review.customerId === customerId
//   );
// }

// export function getReviewByBooking(
//   bookingId: string
// ): Review | undefined {
//   return getReviews().find(
//     (review) =>
//       review.bookingId === bookingId
//   );
// }

import { Review } from "@/types/review";

import {
  getReviewsApi,
  getVendorReviewsApi,
  getCustomerReviewsApi,
  createReviewApi,
  updateReviewApi,
  deleteReviewApi,
  replyReviewApi,
} from "@/services/api/review.api";

/**
 * Load all reviews
 */
export async function getReviews(): Promise<Review[]> {
  const result = await getReviewsApi();

  if (!result.ok || !result.data) {
    return [];
  }

  return result.data as Review[];
}

/**
 * Vendor Details Page
 */
export async function getVendorReviews(
  vendorId: number
): Promise<Review[]> {
  const result =
    await getVendorReviewsApi(vendorId);

  if (!result.ok || !result.data) {
    return [];
  }

  return result.data as Review[];
}

/**
 * Customer Reviews
 */
export async function getCustomerReviews(
  customerId: string
): Promise<Review[]> {
  const result =
    await getCustomerReviewsApi(customerId);

  if (!result.ok || !result.data) {
    return [];
  }

  return result.data as Review[];
}

/**
 * Create Review
 */
export async function createReview(
  review: Review
): Promise<boolean> {
  const result =
    await createReviewApi(review);

  return result.ok;
}

/**
 * Update Review
 */
export async function updateReview(
  review: Review
): Promise<boolean> {
  const result =
    await updateReviewApi(review);

  return result.ok;
}

/**
 * Vendor Reply
 */
export async function replyReview(
  reviewId: string,
  reply: string
): Promise<boolean> {
  const result =
    await replyReviewApi(
      reviewId,
      reply
    );

  return result.ok;
}

/**
 * Delete Review
 */
export async function deleteReview(
  id: string
): Promise<boolean> {
  const result =
    await deleteReviewApi(id);

  return result.ok;
}