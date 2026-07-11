import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { COLORS } from "../../../constants/theme";
import { PortfolioItemRecord } from "../../../types/vendorPortfolio";
import { styles } from "./PortfolioCard.styles";

type Props = {
  item: PortfolioItemRecord;
  onDelete: () => void;
  onEdit: () => void;
};

export function PortfolioCard({
  item,
  onDelete,
  onEdit,
}: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.imageWrapper}>
        {item.image ? (
          <Image
            source={{ uri: item.image }}
            style={styles.image}
          />
        ) : (
          <View style={styles.imagePlaceholder}>
            <MaterialCommunityIcons
              name="image-outline"
              size={24}
              color={COLORS.textLight}
            />
          </View>
        )}

        {/* Action Buttons */}
        <View style={styles.actionContainer}>
  <TouchableOpacity
    style={styles.editBtn}
    onPress={() => {
  console.log("Edit button pressed");
  onEdit();
}}
  >
    <MaterialCommunityIcons
      name="pencil"
      size={16}
      color="#fff"
    />
  </TouchableOpacity>

  <TouchableOpacity
    style={styles.deleteBtn}
    onPress={onDelete}
  >
    <MaterialCommunityIcons
      name="delete-outline"
      size={16}
      color="#fff"
    />
  </TouchableOpacity>
</View>
      </View>

      <Text
        style={styles.title}
        numberOfLines={1}
      >
        {item.title}
      </Text>

      <Text style={styles.category}>
        {item.category}
      </Text>
    </View>
  );
}