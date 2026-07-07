import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { VendorCard } from "../../components/users/vendors/VendorCard";
import { WishlistStatCard } from "../../components/users/wishlist/WishlistStatCard";
import { useFavoritesStore } from "../../store/favoritesStore";
import { DUMMY_VENDORS } from "../../constants/vendorData";
import { styles } from "./styles/WishlistScreen.styles";

// TODO: import API functions once backend is connected
// import { getFavorites, clearFavorites } from "../../api/favorites.api";

export default function WishlistScreen() {
  const navigation = useNavigation<any>();
  const favoriteIds = useFavoritesStore((state) => state.favoriteIds);
  const clearAllFavorites = useFavoritesStore((state) => state.clearAllFavorites);
  const [sortBy, setSortBy] = useState<"Latest Saved" | "Highest Rated" | "Price">("Latest Saved");

  // TODO: replace this local filter with a real fetch once favorites live on the backend:
  // const [savedVendors, setSavedVendors] = useState([]);
  // useEffect(() => {
  //   const load = async () => {
  //     const res = await getFavorites();
  //     setSavedVendors(res.data);
  //   };
  //   load();
  // }, []);
  const savedVendors = DUMMY_VENDORS.filter((vendor) => favoriteIds.has(vendor.id));

  // TODO: "Ready to Book" should reflect vendors saved but with no active/past booking —
  // needs a real join against the Booking table once connected. Hardcoded to 0 for now.
  const readyToBookCount = 0;
  const highRatedCount = savedVendors.filter((v) => parseFloat(v.rating) >= 4.5).length;

  const handleClearWishlist = () => {
    if (savedVendors.length === 0) return;
    Alert.alert("Clear Wishlist", "Remove all saved vendors from your wishlist?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Clear",
        style: "destructive",
        // TODO: call clearFavorites() API once connected
        onPress: () => clearAllFavorites(),
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={22} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Wishlist</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Hero */}
        <View style={styles.heroCard}>
          <View style={styles.heroBadge}>
            <MaterialIcons name="auto-awesome" size={14} color="#fff" />
            <Text style={styles.heroBadgeText}>Your Wishlist</Text>
          </View>

          <Text style={styles.heroTitle}>Vendors you've{"\n"}fallen in love with.</Text>
          <Text style={styles.heroSubtitle}>
            Save your favorite vendors, compare them and book when you're ready.
          </Text>

          <View style={styles.heroSummaryBox}>
            <View style={styles.heroSummaryHeader}>
              <MaterialIcons name="bookmark" size={16} color="#fff" />
              <Text style={styles.heroSummaryTitle}>Wishlist Summary</Text>
            </View>
            <View style={styles.heroSummaryRow}>
              <Text style={styles.heroSummaryLabel}>Saved Vendors</Text>
              <Text style={styles.heroSummaryValue}>{savedVendors.length}</Text>
            </View>
            <View style={styles.heroSummaryRow}>
              {/* TODO: "Recently Added" — count of favorites added in the last 7 days, needs a timestamp on the favorite record from the backend */}
              <Text style={styles.heroSummaryLabel}>Recently Added</Text>
              <Text style={styles.heroSummaryValue}>0</Text>
            </View>
            <View style={styles.heroSummaryRow}>
              <Text style={styles.heroSummaryLabel}>Ready to Book</Text>
              <Text style={styles.heroSummaryValue}>{readyToBookCount}</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.exploreButton}
            onPress={() =>
  navigation.navigate("CoupleTabs", {
    screen: "Vendors",
    params: { screen: "VendorList" },
  })
}
          >
            <Text style={styles.exploreButtonText}>Explore More Vendors</Text>
            <MaterialIcons name="arrow-forward" size={16} color="#C2185B" />
          </TouchableOpacity>
        </View>

        {/* Stat cards */}
        <View style={styles.statsGrid}>
          <WishlistStatCard
            icon="favorite"
            iconColor="#C2185B"
            iconBg="#FDEEF3"
            label="Saved Vendors"
            value={savedVendors.length}
            sublabel="Currently saved"
          />
          <WishlistStatCard
            icon="event-available"
            iconColor="#22B07D"
            iconBg="#E8F8F0"
            label="Ready to Book"
            value={readyToBookCount}
            sublabel="Not booked yet"
          />
          <WishlistStatCard
            icon="star"
            iconColor="#D9A404"
            iconBg="#FEF6E0"
            label="Favorites"
            value={highRatedCount}
            sublabel="Rated 4.5★ & above"
          />
        </View>

        {/* Saved Vendors */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionTopRow}>
            <View>
              <Text style={styles.sectionTitle}>Saved Vendors</Text>
              <Text style={styles.sectionSubtitle}>Compare and book your favourites.</Text>
            </View>
          </View>

          <View style={styles.sectionActionsRow}>
            <TouchableOpacity
              style={styles.sortPill}
              onPress={() => {
                // TODO: open a real sort picker (reuse the SortPicker pattern from VendorListScreen)
              }}
            >
              <Text style={styles.sortPillText}>{sortBy}</Text>
              <MaterialIcons name="arrow-drop-down" size={16} color="#666" />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.clearButton, savedVendors.length > 0 && styles.clearButtonActive]}
              onPress={handleClearWishlist}
              disabled={savedVendors.length === 0}
            >
              <MaterialIcons
                name="delete-outline"
                size={14}
                color={savedVendors.length > 0 ? "#E53935" : "#ccc"}
              />
              <Text
                style={[
                  styles.clearButtonText,
                  savedVendors.length > 0 && styles.clearButtonTextActive,
                ]}
              >
                Clear Wishlist
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {savedVendors.length === 0 ? (
          <View style={styles.sectionCard}>
            <View style={styles.emptyState}>
              <MaterialIcons name="favorite-border" size={44} color="#ddd" />
              <Text style={styles.emptyStateText}>Your wishlist is empty</Text>
              <Text style={styles.emptyStateSubtext}>
                Start exploring vendors and save your favourites.
              </Text>
            </View>
          </View>
        ) : (
          <View style={{ paddingHorizontal: 20 }}>
            {savedVendors.map((vendor) => (
              <VendorCard
                key={vendor.id}
                vendor={vendor}
                onViewProfile={() => navigation.navigate("VendorDetails", { vendorId: vendor.id })}
                onBookNow={() =>
                  navigation.navigate("Bookings", {
                    screen: "BookingScreen",
                    params: { vendorId: vendor.id },
                  })
                }
              />
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}