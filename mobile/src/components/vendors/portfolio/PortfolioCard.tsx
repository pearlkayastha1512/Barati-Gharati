import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { COLORS } from "../../../constants/theme";
import { PortfolioItemRecord } from "../../../types/vendorPortfolio";
import { styles } from "./PortfolioCard.styles";

type Props = {
  item: PortfolioItemRecord;
  onDelete: () => void;
};

export function PortfolioCard({ item, onDelete }: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.imageWrapper}>
        {item.imageUri ? (
          <Image source={{ uri: item.imageUri }} style={styles.image} />
        ) : (
          <View style={styles.imagePlaceholder}>
            <MaterialCommunityIcons name="image-outline" size={24} color={COLORS.textLight} />
          </View>
        )}
        <TouchableOpacity style={styles.deleteBtn} onPress={onDelete}>
          <MaterialCommunityIcons name="delete-outline" size={16} color="#fff" />
        </TouchableOpacity>
      </View>
      <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
      <Text style={styles.category}>{item.category}</Text>
    </View>
  );
}