import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { VendorCard } from "../../components/vendors/VendorCard";
import { CategoryChips } from "../../components/vendors/CategoryChips";
import { CityPicker } from "../../components/vendors/CityPicker";
import { DUMMY_VENDORS } from "../../constants/vendorData";
import { styles } from "../../components/vendors/VendorList.styles";

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

  // TODO: replace DUMMY_VENDORS with API-backed state:
  // const [vendors, setVendors] = useState([]);
  // useEffect(() => {
  //   const fetchVendors = async () => {
  //     const response = await searchVendors({
  //       category: activeCategory,
  //       city: selectedCity === "All Cities" ? undefined : selectedCity,
  //       search: searchText,
  //     });
  //     setVendors(response.data);
  //   };
  //   fetchVendors();
  // }, [activeCategory, selectedCity, searchText]);

  const filteredVendors = DUMMY_VENDORS.filter((vendor) => {
    const matchesCategory = !activeCategory || vendor.category === activeCategory;
    const matchesCity = selectedCity === "All Cities" || vendor.location === selectedCity;
    const matchesSearch =
      !searchText.trim() ||
      vendor.name.toLowerCase().includes(searchText.toLowerCase()) ||
      vendor.location.toLowerCase().includes(searchText.toLowerCase());
    return matchesCategory && matchesCity && matchesSearch;
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

      {/* FIX: now a real, working city picker instead of a static button */}
      <CityPicker selectedCity={selectedCity} onSelect={setSelectedCity} />

      {/* FIX: extracted + given explicit height so it isn't clipped */}
      <CategoryChips activeCategory={activeCategory} onSelect={setActiveCategory} />

      {/* Result count + sort */}
      <View style={styles.resultRow}>
        <Text style={styles.resultCount}>{filteredVendors.length} Vendors Found</Text>
        <TouchableOpacity style={styles.sortPill}>
          {/* TODO: wire up sort options — Popularity / Price Low-High / Rating */}
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
            onViewProfile={() =>
              navigation.navigate("VendorDetails", { vendorId: item.id })
            }
            // FIX: nested navigate into the Bookings tab, matching the pattern
            // already used successfully for category navigation on HomeScreen
            onBookNow={() =>
              navigation.navigate("Bookings", {
                screen: "BookingScreen", // TODO: confirm this matches your actual screen name inside the Bookings tab
                params: { vendorId: item.id },
              })
            }
          />
        )}
      />
    </View>
  );
}