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
