import React, { useState } from "react";
import { View, Text, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useVendorReviewsStore } from "../../store/vendorReviewsStore";
import { VendorReviewRecord } from "../../types/vendorReview";
import { ReviewOverviewHero } from "../../components/vendors/reviews/ReviewOverviewHero";
import { RatingSummaryCard } from "../../components/vendors/reviews/RatingSummaryCard";
import { ReviewListItem } from "../../components/vendors/reviews/ReviewListItem";
import { ReplyModal } from "../../components/vendors/reviews/ReplyModal";
import { StatCard } from "../../components/vendors/dashboard/StatCard";
import { EmptyState } from "../../components/vendors/dashboard/EmptyState";
import { styles } from "./reviewsStyles";

// TODO: import API functions once connected
// import { getReviewsByVendor, replyToReview } from "../../api/review.api";

export default function ReviewsScreen() {
  const reviews = useVendorReviewsStore((state) => state.reviews);
  const submitReply = useVendorReviewsStore((state) => state.submitReply);
  const [selectedReview, setSelectedReview] = useState<VendorReviewRecord | null>(null);

  // TODO: fetch on mount once vendorId is available (from vendor profile's frontendVendorId):
  // useEffect(() => {
  //   const load = async () => {
  //     const data = await getReviewsByVendor(vendorId);
  //     setReviews(data); // already sorted newest-first by backend
  //   };
  //   load();
  // }, []);

  const totalReviews = reviews.length;
  const averageRating = totalReviews > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews : 0;
  const recommendedCount = reviews.filter((r) => r.rating >= 4).length;
  const recommendationPercent = totalReviews > 0 ? Math.round((recommendedCount / totalReviews) * 100) : 0;
  const uniqueCustomers = new Set(reviews.map((r) => r.customerId)).size;

  const breakdown = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 } as Record<5 | 4 | 3 | 2 | 1, number>;
  reviews.forEach((r) => {
    const rounded = Math.round(r.rating) as 5 | 4 | 3 | 2 | 1;
    if (breakdown[rounded] !== undefined) breakdown[rounded] += 1;
  });

  const latestReview = reviews[0];

  const handleReplySubmit = (reply: string) => {
    if (!selectedReview) return;
    submitReply(selectedReview.id, reply);
    // TODO: await replyToReview(selectedReview.id, { reply }); — PATCH /reviews/:id/reply
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Vendor Dashboard</Text>
        <Text style={styles.headerSubtitle}>Manage your wedding business.</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <ReviewOverviewHero
          averageRating={averageRating}
          totalReviews={totalReviews}
          latestReviewName={latestReview?.customerName}
          onOpenFeedback={() => {}}
        />

        <View style={styles.statsGrid}>
          <StatCard icon="star-outline" label="Average Rating" value={averageRating.toFixed(1)} sublabel="Out of 5" />
          <StatCard icon="message-text-outline" label="Reviews" value={`${totalReviews}`} sublabel="Customer Reviews" />
          <StatCard icon="thumb-up-outline" label="Recommendation" value={`${recommendationPercent}%`} sublabel="Rated 4★ & Above" />
          <StatCard icon="account-group-outline" label="Customers" value={`${uniqueCustomers}`} sublabel="Reviewed Vendors" />
        </View>

        <View style={styles.twoColumnRow}>
          <View style={{ flex: 1 }}>
            {reviews.length === 0 ? (
              <EmptyState icon="star-outline" message="No Reviews Yet" />
            ) : (
              reviews.map((review) => (
                <ReviewListItem
                  key={review.id}
                  review={review}
                  onReply={() => setSelectedReview(review)}
                />
              ))
            )}
          </View>
        </View>

        <RatingSummaryCard averageRating={averageRating} totalReviews={totalReviews} breakdown={breakdown} />
      </ScrollView>

      <ReplyModal
        visible={!!selectedReview}
        onClose={() => setSelectedReview(null)}
        customerName={selectedReview?.customerName ?? ""}
        onSubmit={handleReplySubmit}
      />
    </SafeAreaView>
  );
}