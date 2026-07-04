import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Image,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";

type Vendor = {
  id: string;
  name: string;
  category: string;
  rating: string;
  reviews: string;
  location: string;
  price: string;
  image: string;
  featured?: boolean;
};

const CATEGORIES = [
  "Venue",
  "Photography",
  "Makeup",
  "Decorator",
  "DJ",
  "Caterer",
  "Mehendi",
  "Band",
];

const DUMMY_VENDORS: Vendor[] = [
  {
    id: "1",
    name: "Royal Palace Jaipur",
    category: "Venue",
    rating: "4.9",
    reviews: "250",
    location: "Jaipur",
    price: "₹2,50,000",
    image: "https://picsum.photos/400/300?1",
  },
  {
    id: "2",
    name: "Imperial Palace Delhi",
    category: "Venue",
    rating: "4.8",
    reviews: "210",
    location: "Delhi",
    price: "₹75,000",
    image: "https://picsum.photos/400/300?2",
  },
  {
    id: "3",
    name: "Bliss Photography",
    category: "Photography",
    rating: "4.8",
    reviews: "180",
    location: "Delhi",
    price: "₹75,000",
    image: "https://picsum.photos/400/300?3",
    featured: true,
  },
  {
    id: "4",
    name: "Dream Decor Studio",
    category: "Decorator",
    rating: "4.7",
    reviews: "145",
    location: "Mumbai",
    price: "₹1,20,000",
    image: "https://picsum.photos/400/300?4",
  },
  {
    id: "5",
    name: "Flavors Catering",
    category: "Caterer",
    rating: "4.9",
    reviews: "320",
    location: "Bengaluru",
    price: "₹1,80,000",
    image: "https://picsum.photos/400/300?5",
    featured: true,
  },
  {
    id: "6",
    name: "Melody Beats",
    category: "DJ",
    rating: "4.6",
    reviews: "130",
    location: "Pune",
    price: "₹40,000",
    image: "https://picsum.photos/400/300?6",
  },
];

function VendorCard({ vendor, onViewProfile, onBookNow }: { vendor: Vendor; onViewProfile: () => void; onBookNow: () => void }) {
  return (
    <View style={styles.card}>
      <View>
        <Image source={{ uri: vendor.image }} style={styles.cardImage} />
        <TouchableOpacity style={styles.heartButton}>
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

export default function VendorListScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const initialCategory = route?.params?.category;

  const [activeCategory, setActiveCategory] = useState<string | null>(
    initialCategory && initialCategory !== "All" ? initialCategory : null
  );
  const [searchText, setSearchText] = useState("");

  const filteredVendors = DUMMY_VENDORS.filter((vendor) => {
    const matchesCategory = !activeCategory || vendor.category === activeCategory;
    const matchesSearch =
      !searchText.trim() ||
      vendor.name.toLowerCase().includes(searchText.toLowerCase()) ||
      vendor.location.toLowerCase().includes(searchText.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={22} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Wedding Vendors</Text>
        <View style={{ width: 40 }} />
      </View>
      <Text style={styles.headerSubtitle}>Discover India's best wedding professionals</Text>

      {/* Search */}
      <View style={styles.searchRow}>
        <View style={styles.searchInputWrapper}>
          <MaterialIcons name="search" size={20} color="#999" />
          <TextInput
            placeholder="Search vendors, venues, photographers..."
            placeholderTextColor="#999"
            style={styles.searchInput}
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>
      </View>

      <TouchableOpacity style={styles.cityPill}>
        <MaterialIcons name="location-on" size={16} color="#333" />
        <Text style={styles.cityPillText}>All Cities</Text>
        <MaterialIcons name="arrow-drop-down" size={20} color="#333" />
      </TouchableOpacity>

      {/* Category chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.chipsRow}
        contentContainerStyle={{ paddingHorizontal: 20 }}
      >
        {CATEGORIES.map((cat) => {
          const isActive = cat === activeCategory;
          return (
            <TouchableOpacity
              key={cat}
              style={[styles.chip, isActive && styles.chipActive]}
              onPress={() => setActiveCategory(isActive ? null : cat)}
            >
              <Text style={[styles.chipText, isActive && styles.chipTextActive]}>{cat}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Result count + sort */}
      <View style={styles.resultRow}>
        <Text style={styles.resultCount}>{filteredVendors.length} Vendors Found</Text>
        <TouchableOpacity style={styles.sortPill}>
          <MaterialIcons name="swap-vert" size={16} color="#333" />
          <Text style={styles.sortPillText}>Popularity</Text>
          <MaterialIcons name="arrow-drop-down" size={18} color="#333" />
        </TouchableOpacity>
      </View>

      {/* Vendor cards */}
      <FlatList
        data={filteredVendors}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 30 }}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <MaterialIcons name="search-off" size={40} color="#ccc" />
            <Text style={styles.emptyStateText}>No vendors found</Text>
            <Text style={styles.emptyStateSubtext}>Try a different category or search term</Text>
          </View>
        }
        renderItem={({ item }) => (
          <VendorCard
            vendor={item}
            onViewProfile={() => navigation.navigate("VendorDetails", { vendorId: item.id })}
            onBookNow={() => navigation.navigate("Bookings", { vendorId: item.id })}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FAFAFA", paddingTop: 50 },

  header: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    paddingHorizontal: 20, marginBottom: 4,
  },
  backButton: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: "#fff",
    justifyContent: "center", alignItems: "center", elevation: 1,
  },
  headerTitle: { fontSize: 20, fontWeight: "700", color: "#333" },
  headerSubtitle: { fontSize: 12, color: "#999", marginHorizontal: 20, marginBottom: 14 },

  searchRow: { flexDirection: "row", alignItems: "center", marginHorizontal: 20, marginBottom: 10 },
  searchInputWrapper: {
    flex: 1, flexDirection: "row", alignItems: "center", backgroundColor: "#fff",
    borderRadius: 14, paddingHorizontal: 14, height: 46, elevation: 1,
  },
  searchInput: { flex: 1, marginLeft: 8, fontSize: 14, color: "#333" },

  cityPill: {
    flexDirection: "row", alignItems: "center", alignSelf: "flex-start",
    backgroundColor: "#fff", borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6,
    marginHorizontal: 20, marginBottom: 14, elevation: 1,
  },
  cityPillText: { fontSize: 12, color: "#333", fontWeight: "500", marginHorizontal: 4 },

  chipsRow: { marginBottom: 12, flexGrow: 0 },
  chip: {
    backgroundColor: "#fff", paddingHorizontal: 16, paddingVertical: 8,
    borderRadius: 20, marginRight: 10, elevation: 1,
  },
  chipActive: { backgroundColor: "#C2185B" },
  chipText: { fontSize: 13, color: "#555", fontWeight: "500" },
  chipTextActive: { color: "#fff" },

  resultRow: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    marginHorizontal: 20, marginBottom: 12,
  },
  resultCount: { fontSize: 13, fontWeight: "600", color: "#333" },
  sortPill: {
    flexDirection: "row", alignItems: "center", backgroundColor: "#fff",
    borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6, elevation: 1,
  },
  sortPillText: { fontSize: 12, color: "#333", fontWeight: "500", marginHorizontal: 4 },

  card: {
    backgroundColor: "#fff", borderRadius: 18, marginBottom: 18,
    overflow: "hidden", elevation: 1,
  },
  cardImage: { width: "100%", height: 170 },
  heartButton: {
    position: "absolute", top: 10, right: 10, backgroundColor: "#fff",
    width: 32, height: 32, borderRadius: 16, justifyContent: "center", alignItems: "center",
  },
  featuredBadge: {
    position: "absolute", top: 10, left: 10, backgroundColor: "#22B07D",
    borderRadius: 10, paddingHorizontal: 10, paddingVertical: 4,
  },
  featuredBadgeText: { fontSize: 11, fontWeight: "700", color: "#fff" },
  ratingBadge: {
    position: "absolute", bottom: 10, right: 10, flexDirection: "row", alignItems: "center",
    backgroundColor: "#fff", borderRadius: 12, paddingHorizontal: 8, paddingVertical: 4,
  },
  ratingBadgeText: { fontSize: 11, fontWeight: "600", color: "#333", marginLeft: 3 },

  cardBody: { padding: 14 },
  cardCategory: { fontSize: 11, fontWeight: "700", color: "#C2185B", letterSpacing: 0.5 },
  cardName: { fontSize: 17, fontWeight: "700", color: "#333", marginTop: 4 },
  cardLocationRow: { flexDirection: "row", alignItems: "center", marginTop: 4 },
  cardLocation: { fontSize: 12, color: "#999", marginLeft: 3 },
  cardPriceLabel: { fontSize: 11, color: "#999", marginTop: 10 },
  cardPrice: { fontSize: 18, fontWeight: "700", color: "#C2185B", marginTop: 2 },

  cardButtonRow: { flexDirection: "row", marginTop: 14 },
  viewProfileButton: {
    flex: 1, borderWidth: 1, borderColor: "#333", borderRadius: 12,
    paddingVertical: 11, alignItems: "center", marginRight: 10,
  },
  viewProfileText: { fontSize: 13, fontWeight: "600", color: "#333" },
  bookNowButton: {
    flex: 1, backgroundColor: "#C2185B", borderRadius: 12,
    paddingVertical: 11, alignItems: "center",
  },
  bookNowText: { fontSize: 13, fontWeight: "600", color: "#fff" },

  emptyState: { alignItems: "center", paddingVertical: 60 },
  emptyStateText: { fontSize: 15, fontWeight: "600", color: "#666", marginTop: 12 },
  emptyStateSubtext: { fontSize: 12, color: "#999", marginTop: 4 },
});