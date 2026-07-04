import React from "react";
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
};

const DUMMY_VENDORS: Vendor[] = [
  {
    id: "1",
    name: "Royal Palace",
    category: "Venue",
    rating: "4.9",
    reviews: "120",
    location: "Lucknow",
    price: "₹50,000 onwards",
    image: "https://picsum.photos/300/200?1",
  },
  {
    id: "2",
    name: "Grand Celebration Hall",
    category: "Venue",
    rating: "4.7",
    reviews: "89",
    location: "Lucknow",
    price: "₹35,000 onwards",
    image: "https://picsum.photos/300/200?2",
  },
  {
    id: "3",
    name: "Heritage Gardens",
    category: "Venue",
    rating: "4.8",
    reviews: "64",
    location: "Kanpur",
    price: "₹42,000 onwards",
    image: "https://picsum.photos/300/200?3",
  },
];

const FILTERS = ["Popular", "Price: Low to High", "Top Rated", "Nearby"];

function VendorRow({ vendor, onPress }: { vendor: Vendor; onPress: () => void }) {
  return (
    <TouchableOpacity style={styles.vendorRow} onPress={onPress} activeOpacity={0.8}>
      <Image source={{ uri: vendor.image }} style={styles.vendorImage} />
      <TouchableOpacity style={styles.heartButton}>
        <MaterialIcons name="favorite-border" size={16} color="#C2185B" />
      </TouchableOpacity>
      <View style={styles.vendorInfo}>
        <Text style={styles.vendorName}>{vendor.name}</Text>
        <View style={styles.vendorMetaRow}>
          <MaterialIcons name="star" size={14} color="#F5A623" />
          <Text style={styles.vendorRating}>{vendor.rating}</Text>
          <Text style={styles.vendorReviews}>({vendor.reviews})</Text>
          <MaterialIcons name="location-on" size={14} color="#999" style={{ marginLeft: 8 }} />
          <Text style={styles.vendorLocation}>{vendor.location}</Text>
        </View>
        <Text style={styles.vendorPrice}>{vendor.price}</Text>
      </View>
    </TouchableOpacity>
  );
}

export default function VendorListScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const categoryTitle = route?.params?.category || "Venues";

  const [activeFilter, setActiveFilter] = React.useState(FILTERS[0]);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{categoryTitle}</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Search */}
      <View style={styles.searchRow}>
        <View style={styles.searchInputWrapper}>
          <MaterialIcons name="search" size={20} color="#999" />
          <TextInput
            placeholder={`Search ${categoryTitle.toLowerCase()}...`}
            placeholderTextColor="#999"
            style={styles.searchInput}
          />
        </View>
        <TouchableOpacity style={styles.filterIconButton}>
          <MaterialIcons name="tune" size={20} color="#C2185B" />
        </TouchableOpacity>
      </View>

      {/* Filter chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.chipsRow}
        contentContainerStyle={{ paddingHorizontal: 20 }}
      >
        {FILTERS.map((filter) => {
          const isActive = filter === activeFilter;
          return (
            <TouchableOpacity
              key={filter}
              style={[styles.chip, isActive && styles.chipActive]}
              onPress={() => setActiveFilter(filter)}
            >
              <Text style={[styles.chipText, isActive && styles.chipTextActive]}>
                {filter}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <Text style={styles.resultCount}>{DUMMY_VENDORS.length} results found</Text>

      {/* Vendor list */}
      <FlatList
        data={DUMMY_VENDORS}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 30 }}
        renderItem={({ item }) => (
          <VendorRow
            vendor={item}
            onPress={() => navigation.navigate("VendorDetails", { vendorId: item.id })}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFAFA",
    paddingTop: 50,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    elevation: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
  },

  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 20,
    marginBottom: 14,
  },
  searchInputWrapper: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 46,
    elevation: 1,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    color: "#333",
  },
  filterIconButton: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
    elevation: 1,
  },

  chipsRow: {
    marginBottom: 12,
    flexGrow: 0,
  },
  chip: {
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    elevation: 1,
  },
  chipActive: {
    backgroundColor: "#C2185B",
  },
  chipText: {
    fontSize: 13,
    color: "#555",
    fontWeight: "500",
  },
  chipTextActive: {
    color: "#fff",
  },

  resultCount: {
    fontSize: 12,
    color: "#999",
    marginHorizontal: 20,
    marginBottom: 12,
  },

  vendorRow: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 18,
    marginBottom: 14,
    overflow: "hidden",
    elevation: 1,
  },
  vendorImage: {
    width: 110,
    height: 110,
  },
  heartButton: {
    position: "absolute",
    top: 8,
    left: 78,
    backgroundColor: "#fff",
    width: 26,
    height: 26,
    borderRadius: 13,
    justifyContent: "center",
    alignItems: "center",
  },
  vendorInfo: {
    flex: 1,
    padding: 12,
    justifyContent: "center",
  },
  vendorName: {
    fontSize: 15,
    fontWeight: "700",
    color: "#333",
  },
  vendorMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  vendorRating: {
    fontSize: 12,
    fontWeight: "600",
    color: "#333",
    marginLeft: 4,
  },
  vendorReviews: {
    fontSize: 12,
    color: "#999",
    marginLeft: 2,
  },
  vendorLocation: {
    fontSize: 12,
    color: "#999",
    marginLeft: 2,
  },
  vendorPrice: {
    fontSize: 13,
    color: "#C2185B",
    fontWeight: "700",
    marginTop: 6,
  },
});