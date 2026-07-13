import React, { useEffect, useState } from "react";
import { ActivityIndicator, View, Text, TextInput, TouchableOpacity, FlatList } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { VendorCard } from "../../components/users/vendors/VendorCard";
import { CategoryChips } from "../../components/users/vendors/CategoryChips";
import { CityPicker } from "../../components/users/vendors/CityPicker";
import { SortPicker, SortOption } from "../../components/users/vendors/SortPicker";
import { Vendor } from "../../constants/vendorData";
import { getAllVendors } from "../../api/vendor.api";
import { styles } from "../../components/users/vendors/VendorList.styles";

// TODO: import API functions once backend is connected
// import { searchVendors, getAllVendors } from "../../api/vendor.api";

export default function VendorListScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const initialCategory = route?.params?.category;

  const [activeCategory, setActiveCategory] = useState<string | null>(
    initialCategory && initialCategory !== "All" ? initialCategory : null
  );
  const [selectedCity, setSelectedCity] = useState("All Cities");
  const [searchText, setSearchText] = useState(route?.params?.search ?? "");
  const [sortBy, setSortBy] = useState<SortOption>("Popularity");
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const loadVendors = async () => {
    setLoading(true);
    setLoadError(null);
    try {
      setVendors(await getAllVendors());
    } catch {
      setLoadError("Vendors load nahi ho sake.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVendors();
  }, []);

  // TODO: replace DUMMY_VENDORS with API-backed state:
  // const [vendors, setVendors] = useState([]);
  // useEffect(() => {
  //   const fetchVendors = async () => {
  //     const response = await searchVendors({
  //       category: activeCategory,
  //       city: selectedCity === "All Cities" ? undefined : selectedCity,
  //       search: searchText,
  //       sort: sortBy,
  //     });
  //     setVendors(response.data);
  //   };
  //   fetchVendors();
  // }, [activeCategory, selectedCity, searchText, sortBy]);

  const filteredVendors = vendors.filter((vendor) => {
    const matchesCategory = !activeCategory || vendor.category === activeCategory;
    const matchesCity = selectedCity === "All Cities" || vendor.location === selectedCity;
    const matchesSearch =
      !searchText.trim() ||
      vendor.name.toLowerCase().includes(searchText.toLowerCase()) ||
      vendor.location.toLowerCase().includes(searchText.toLowerCase());
    return matchesCategory && matchesCity && matchesSearch;
  }).sort((a, b) => {
    switch (sortBy) {
      case "Highest Rated":
        return parseFloat(b.rating) - parseFloat(a.rating);
      case "Price: Low to High":
        return a.priceValue - b.priceValue;
      case "Price: High to Low":
        return b.priceValue - a.priceValue;
      case "Newest":
        // TODO: once backend-connected, sort by vendor.createdAt descending instead
        return 0;
      case "Popularity":
      default:
        // TODO: "Popularity" ideally sorts by a backend-computed score; using review count as a proxy for now
        return parseInt(b.reviews) - parseInt(a.reviews);
    }
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

      <CityPicker selectedCity={selectedCity} onSelect={setSelectedCity} />

      <CategoryChips activeCategory={activeCategory} onSelect={setActiveCategory} />

      {/* Result count + sort */}
      <View style={styles.resultRow}>
        <Text style={styles.resultCount}>{filteredVendors.length} Vendors Found</Text>
        <SortPicker selectedSort={sortBy} onSelect={setSortBy} />
      </View>

      {/* Vendor cards */}
      <FlatList
        data={filteredVendors}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 30 }}
        refreshing={loading}
        onRefresh={loadVendors}
        ListEmptyComponent={loading ? (
          <ActivityIndicator size="large" color="#C2185B" />
        ) : loadError ? (
          <View style={styles.emptyState}>
            <MaterialIcons name="error-outline" size={40} color="#C2185B" />
            <Text style={styles.emptyStateText}>{loadError}</Text>
            <TouchableOpacity onPress={loadVendors}><Text style={styles.emptyStateSubtext}>Try Again</Text></TouchableOpacity>
          </View>
        ) : (
          <View style={styles.emptyState}>
            <MaterialIcons name="search-off" size={40} color="#ccc" />
            <Text style={styles.emptyStateText}>No vendors found</Text>
            <Text style={styles.emptyStateSubtext}>Try a different category or search term</Text>
          </View>
        )}
        renderItem={({ item }) => (
          <VendorCard
            vendor={item}
            onViewProfile={() =>
              navigation.navigate("VendorDetails", { vendorId: item.id })
            }
            onBookNow={() =>
              navigation.navigate("VendorDetails", { vendorId: item.id })
            }
          />
        )}
      />
    </View>
  );
}
