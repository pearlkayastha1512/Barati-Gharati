import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Vendor } from "../../constants/vendorData";
import { styles } from "./VendorList.styles";

type Props = {
  vendor: Vendor;
  onViewProfile: () => void;
  onBookNow: () => void;
};

export function VendorCard({ vendor, onViewProfile, onBookNow }: Props) {
  return (
    <View style={styles.card}>
      <View>
        <Image source={{ uri: vendor.image }} style={styles.cardImage} />
        <TouchableOpacity style={styles.heartButton}>
          {/* TODO: wire up favorite toggle — POST/DELETE /favorites */}
          <MaterialIcons name="favorite-border" size={16} color="#C2185B" />
        </TouchableOpacity>
        {vendor.featured && (
          <View style={styles.featuredBadge}>
            <Text style={styles.featuredBadgeText}>Featured</Text>
          </View>
        )}
        <View style={styles.ratingBadge}>
          <MaterialIcons name="star" size={12} color="#F5A623" />
          <Text style={styles.ratingBadgeText}>{vendor.rating} ({vendor.reviews})</Text>
        </View>
      </View>

      <View style={styles.cardBody}>
        <Text style={styles.cardCategory}>{vendor.category.toUpperCase()}</Text>
        <Text style={styles.cardName}>{vendor.name}</Text>

        <View style={styles.cardLocationRow}>
          <MaterialIcons name="location-on" size={13} color="#999" />
          <Text style={styles.cardLocation}>{vendor.location}</Text>
        </View>

        <Text style={styles.cardPriceLabel}>Starting From</Text>
        <Text style={styles.cardPrice}>{vendor.price}</Text>

        <View style={styles.cardButtonRow}>
          <TouchableOpacity style={styles.viewProfileButton} onPress={onViewProfile}>
            <Text style={styles.viewProfileText}>View Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.bookNowButton} onPress={onBookNow}>
            <Text style={styles.bookNowText}>Book Now</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}