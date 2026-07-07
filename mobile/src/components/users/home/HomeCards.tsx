import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useFavoritesStore } from "../../../store/favoritesStore";
import { styles } from "../../../screens/couple/styles/HomeScreen.styles";

type CategoryProps = {
  icon: any;
  label: string;
  onPress: () => void;
};

export function Category({ icon, label, onPress }: CategoryProps) {
  return (
    <TouchableOpacity style={styles.categoryItem} onPress={onPress}>
      <MaterialIcons name={icon} size={28} color="#C2185B" />
      <Text style={styles.categoryText}>{label}</Text>
    </TouchableOpacity>
  );
}

type VendorCardProps = {
  id: string; // NEW — needed to look up/toggle favorite state
  title: string;
  category: string;
  rating?: string;
  price?: string;
  imageUrl?: string;
};

export function VendorCard({
  id,
  title,
  category,
  rating = "4.8",
  price = "₹50,000 onwards",
  imageUrl = "https://picsum.photos/300/200",
}: VendorCardProps) {
  const { isFavorite, toggleFavorite } = useFavoritesStore();
  const favorited = isFavorite(id);

  return (
    <View style={styles.vendorCard}>
      <Image source={{ uri: imageUrl }} style={styles.vendorImage} />
      <TouchableOpacity style={styles.vendorHeart} onPress={() => toggleFavorite(id)}>
        <MaterialIcons
          name={favorited ? "favorite" : "favorite-border"}
          size={18}
          color="#C2185B"
        />
      </TouchableOpacity>
      <View style={{ paddingHorizontal: 15, paddingTop: 12, paddingBottom: 15 }}>
        <Text style={styles.vendorTitle}>{title}</Text>
        <View style={styles.vendorRatingRow}>
          <MaterialIcons name="star" size={14} color="#F5A623" />
          <Text style={styles.vendorRating}>{rating}</Text>
          <Text style={styles.vendorCategory}>· {category}</Text>
        </View>
        <Text style={styles.vendorPrice}>{price}</Text>
      </View>
    </View>
  );
}