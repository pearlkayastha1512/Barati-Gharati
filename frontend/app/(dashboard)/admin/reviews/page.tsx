"use client";

import { useMemo, useState } from "react";

import ReviewHero from "@/components/admin/reviews/ReviewHero";
import ReviewStats from "@/components/admin/reviews/ReviewStats";
import ReviewFilters from "@/components/admin/reviews/ReviewFilters";
import ReviewTable from "@/components/admin/reviews/ReviewTable";
import ReviewDetailsModal from "@/components/admin/reviews/ReviewDetailsModal";

import { getReviews } from "@/services/review.service";
import { Review } from "@/types/review";

export default function ReviewsManagementPage() {
  const reviews = useMemo(
    () => getReviews(),
    []
  );

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
        review.comment
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

  return (
    <div className="space-y-8">
      <ReviewHero />

      <ReviewStats />

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
        onClose={() => {
          setSelectedReview(null);

          setIsModalOpen(false);
        }}
      />
    </div>
  );
}