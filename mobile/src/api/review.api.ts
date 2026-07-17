import api from "./axios";
import { VendorReviewRecord } from "../types/vendorReview";

export type CustomerReviewRecord = VendorReviewRecord & {
  customerId: string;
  vendorId: number;
};

export const getMyReviews = async (): Promise<CustomerReviewRecord[]> => {
  const response = await api.get<CustomerReviewRecord[]>("/reviews/mine");
  return response.data;
};

export const getReviewsByVendor = async (
  vendorId: string,
): Promise<VendorReviewRecord[]> => {
  const response = await api.get(
    `/reviews/vendor/${vendorId}`,
  );

  return response.data;
};

export const replyToReview = async (
  reviewId: string,
  reply: string,
) => {
  const response = await api.patch(
    `/reviews/${reviewId}/reply`,
    {
      reply,
    },
  );

  return response.data;
};

export const getAverageRating = async (
  vendorId: string,
) => {
  const response = await api.get(
    `/reviews/vendor/${vendorId}/average`,
  );

  return response.data;
};
export const createReview = async (dto: {
  bookingId: string;
  rating: number;
  comment?: string;
  complaint?: string;
  proofImages?: string[];
}): Promise<CustomerReviewRecord> => {
  const response = await api.post<CustomerReviewRecord>("/reviews", dto);
  return response.data;
};

export const updateReview = async (
  reviewId: string,
  dto: { rating?: number; comment?: string },
): Promise<CustomerReviewRecord> => {
  const response = await api.patch<CustomerReviewRecord>(`/reviews/${reviewId}`, dto);
  return response.data;
};

export const deleteReview = async (reviewId: string): Promise<void> => {
  await api.delete(`/reviews/${reviewId}`);
};
export const uploadReviewPhotos = async (
  localUris: string[],
): Promise<string[]> => {
  const formData = new FormData();
  localUris.forEach((uri, index) => {
    formData.append("images", {
      uri,
      name: `review-photo-${index}.jpg`,
      type: "image/jpeg",
    } as any);
  });

  const response = await api.post("/reviews/upload-images", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  // matches ReviewsService.uploadProofImages() → { success: true, images: string[] }
  return response.data.images;
};
