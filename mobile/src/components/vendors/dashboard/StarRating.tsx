import React from "react";
import { View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { COLORS } from "../../../constants/theme";

export function StarRating({ rating, size = 14 }: { rating: number; size?: number }) {
  return (
    <View style={{ flexDirection: "row" }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <MaterialCommunityIcons
          key={i}
          name={i <= rating ? "star" : "star-outline"}
          size={size}
          color={COLORS.star}
        />
      ))}
    </View>
  );
}