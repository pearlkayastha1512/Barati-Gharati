import api from "@/lib/axios";
import { AxiosError } from "axios";
import { Review } from "@/types/review";

type ApiErrorResponse = {
  message?: string;
};

function getErrorMessage(
  error: unknown,
  fallback: string
) {
  if (error instanceof AxiosError) {
    const data = error.response
      ?.data as ApiErrorResponse | undefined;

    return data?.message ?? fallback;
  }

  return fallback;
}

/**
 * Load all reviews
 */
export async function getReviewsApi() {
  try {
    const { data } = await api.get("/reviews");

    return {
      ok: true,
      data,
    };
  } catch (error) {
    return {
      ok: false,
      error: getErrorMessage(
        error,
        "Unable to load reviews."
      ),
    };
  }
}

/**
 * Reviews of a vendor
 */
export async function getVendorReviewsApi(
  vendorId: number
) {
  try {
    const { data } = await api.get(
      `/reviews/vendor/${vendorId}`
    );

    return {
      ok: true,
      data,
    };
  } catch (error) {
    return {
      ok: false,
      error: getErrorMessage(
        error,
        "Unable to load vendor reviews."
      ),
    };
  }
}

/**
 * Customer reviews
 *
 * (We'll add this backend endpoint later if it doesn't exist.)
 */
export async function getCustomerReviewsApi(
  customerId: string
) {
  try {
    const { data } = await api.get(
      `/reviews/customer/${customerId}`
    );

    return {
      ok: true,
      data,
    };
  } catch (error) {
    return {
      ok: false,
      error: getErrorMessage(
        error,
        "Unable to load customer reviews."
      ),
    };
  }
}

/**
 * Create review
 */
export async function createReviewApi(
  review: Review
) {
  try {
    const { data } = await api.post(
      "/reviews",
      {
        bookingId: review.bookingId,
        rating: review.rating,
        comment: review.comment,
        complaint: review.complaint,
        proofImages: review.proofImages,
      }
    );

    return {
      ok: true,
      data,
    };
  } catch (error) {
    return {
      ok: false,
      error: getErrorMessage(
        error,
        "Unable to create review."
      ),
    };
  }
}

/**
 * Update review
 */
export async function updateReviewApi(
  review: Review
) {
  try {
    const { data } = await api.patch(
      `/reviews/${review.id}`,
      {
        rating: review.rating,
        comment: review.comment,
      }
    );

    return {
      ok: true,
      data,
    };
  } catch (error) {
    return {
      ok: false,
      error: getErrorMessage(
        error,
        "Unable to update review."
      ),
    };
  }
}

/**
 * Vendor reply
 */
export async function replyReviewApi(
  reviewId: string,
  reply: string
) {
  try {
    const { data } = await api.patch(
      `/reviews/${reviewId}/reply`,
      {
        reply,
      }
    );

    return {
      ok: true,
      data,
    };
  } catch (error) {
    return {
      ok: false,
      error: getErrorMessage(
        error,
        "Unable to reply to review."
      ),
    };
  }
}

/**
 * Delete review
 */
export async function deleteReviewApi(
  id: string
) {
  try {
    await api.delete(`/reviews/${id}`);

    return {
      ok: true,
    };
  } catch (error) {
    return {
      ok: false,
      error: getErrorMessage(
        error,
        "Unable to delete review."
      ),
    };
  }
}
