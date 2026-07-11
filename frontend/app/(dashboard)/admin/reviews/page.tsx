"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import ReviewHero from "@/components/admin/reviews/ReviewHero";
import ReviewStats from "@/components/admin/reviews/ReviewStats";
import ReviewFilters from "@/components/admin/reviews/ReviewFilters";
import ReviewTable from "@/components/admin/reviews/ReviewTable";
import ReviewDetailsModal from "@/components/admin/reviews/ReviewDetailsModal";

import { getReviews } from "@/services/review.service";
import { Review } from "@/types/review";
import {
  approveBookingPaymentApi,
  holdBookingPaymentApi,
} from "@/services/api/admin.api";
import { toast } from "sonner";

export default function ReviewsManagementPage() {
  const [reviews, setReviews] =
    useState<Review[]>([]);

  useEffect(() => {
    async function loadReviews() {
      const data = await getReviews();

      setReviews(
        Array.isArray(data) ? data : []
      );
    }

    void loadReviews();
  }, []);

  const loadReviews = async () => {
    const data = await getReviews();

    setReviews(
      Array.isArray(data) ? data : []
    );
  };

  const [search, setSearch] = useState("");

  const [rating, setRating] =
    useState("all");

  const [selectedReview, setSelectedReview] =
    useState<Review | null>(null);

  const [isModalOpen, setIsModalOpen] =
    useState(false);

  const filteredReviews = useMemo(() => {
    return reviews.filter((review) => {
      const matchesSearch =
        review.customerName
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        review.vendorName
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        (review.comment ?? "")
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchesRating =
        rating === "all" ||
        review.rating === Number(rating);

      return (
        matchesSearch &&
        matchesRating
      );
    });
  }, [
    reviews,
    search,
    rating,
  ]);

  const handleViewReview = (
    review: Review
  ) => {
    setSelectedReview(review);

    setIsModalOpen(true);
  };

  const handleApprovePayment = async (
    review: Review
  ) => {
    const result =
      await approveBookingPaymentApi(
        review.bookingId
      );

    if (!result.ok) {
      toast.error(
        result.error ??
          "Unable to approve payment."
      );
      return;
    }

    toast.success(
      "Payment approved. Customer can now pay the remaining balance."
    );
    setIsModalOpen(false);
    setSelectedReview(null);
    await loadReviews();
  };

  const handleHoldPayment = async (
    review: Review
  ) => {
    const result =
      await holdBookingPaymentApi(
        review.bookingId
      );

    if (!result.ok) {
      toast.error(
        result.error ??
          "Unable to hold payment."
      );
      return;
    }

    toast.success("Payment held.");
    setIsModalOpen(false);
    setSelectedReview(null);
    await loadReviews();
  };

  return (
    <div className="space-y-8">
      <ReviewHero />

      <ReviewStats reviews={reviews} />

      <ReviewFilters
        search={search}
        setSearch={setSearch}
        rating={rating}
        setRating={setRating}
      />

      <ReviewTable
        reviews={filteredReviews}
        onView={handleViewReview}
      />

      <ReviewDetailsModal
        review={selectedReview}
        open={isModalOpen}
        onApprovePayment={
          handleApprovePayment
        }
        onHoldPayment={handleHoldPayment}
        onClose={() => {
          setSelectedReview(null);

          setIsModalOpen(false);
        }}
      />
    </div>
  );
}
