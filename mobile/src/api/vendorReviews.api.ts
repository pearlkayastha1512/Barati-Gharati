import api from "./axios";
import { VendorReviewRecord } from "../types/vendorReview";

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
): Promise<{ reply: string; repliedAt: string }> => {
  const response = await api.patch(
    `/reviews/${reviewId}/reply`,
    { reply },
  );

  // Backend returns the raw updated Review row here, not the
  // mapped VendorReviewRecord shape the list endpoint returns.
  // Its reply field is called `vendorReply`, not `reply` — so we
  // translate it here, once, at the API boundary.
  return {
    reply: response.data.vendorReply,
    repliedAt: response.data.updatedAt,
  };
};

export const getAverageRating = async (
  vendorId: string,
) => {
  const response = await api.get(
    `/reviews/vendor/${vendorId}/average`,
  );

  return response.data;
};