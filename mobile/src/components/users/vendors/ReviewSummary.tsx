import React from "react";
import { View, Text } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { styles } from "../../../screens/couple/styles/VendorDetailsScreen.styles";

type Props = {
  averageRating: number;
  totalReviews: number;
  // Count of reviews per star, index 0 = 5-star, index 4 = 1-star
  breakdown: number[];
};

export function ReviewSummary({ averageRating, totalReviews, breakdown }: Props) {
  const maxCount = Math.max(1, ...breakdown);

  return (
    <View style={styles.reviewSummaryBox}>
      <View>
        <Text style={styles.reviewScoreBig}>{averageRating.toFixed(1)}</Text>
        <View style={styles.starsRow}>
          {[1, 2, 3, 4, 5].map((i) => (
            <MaterialIcons
              key={i}
              name={i <= Math.round(averageRating) ? "star" : "star-border"}
              size={16}
              color="#F5A623"
            />
          ))}
        </View>
        <Text style={styles.reviewCountText}>Based on {totalReviews} Reviews</Text>
      </View>

      <View style={styles.ratingBarsColumn}>
        {[5, 4, 3, 2, 1].map((star, index) => (
          <View key={star} style={styles.ratingBarRow}>
            <Text style={styles.ratingBarLabel}>{star}★</Text>
            <View style={styles.ratingBarTrack}>
              <View
                style={[
                  styles.ratingBarFill,
                  { width: `${(breakdown[index] / maxCount) * 100}%` },
                ]}
              />
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}