import React, { useState } from "react";
import { View, Text, ScrollView, TextInput, Image, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Category, VendorCard } from "../../components/home/HomeCards";
import { styles } from "./HomeScreen.styles";

// TODO: import API functions once backend is connected, e.g.
// import { getUserProfile } from "../../api/user.api";
// import { getWeddingDetails } from "../../api/wedding.api";
// import { getBudgetSummary } from "../../api/budget.api";
// import { getChecklistSummary } from "../../api/checklist.api";
// import { getFeaturedVendors } from "../../api/vendor.api";
// import { getUpcomingBooking } from "../../api/booking.api";
// import { getRecentNotifications } from "../../api/notification.api";

export default function HomeScreen() {
  const navigation = useNavigation<any>();
  const [searchQuery, setSearchQuery] = useState("");

  // TODO: replace with real state from API responses, e.g.
  // const [user, setUser] = useState(null);
  // const [weddingDetails, setWeddingDetails] = useState(null);
  // const [budgetSummary, setBudgetSummary] = useState(null);
  // const [checklistSummary, setChecklistSummary] = useState(null);
  // const [featuredVendors, setFeaturedVendors] = useState([]);
  // const [upcomingBooking, setUpcomingBooking] = useState(null);
  // const [notifications, setNotifications] = useState([]);

  // TODO: fetch all home screen data on mount
  // useEffect(() => {
  //   const loadHomeData = async () => {
  //     try {
  //       const [userRes, weddingRes, budgetRes, checklistRes, vendorsRes, bookingRes, notifRes] =
  //         await Promise.all([
  //           getUserProfile(),
  //           getWeddingDetails(),
  //           getBudgetSummary(),
  //           getChecklistSummary(),
  //           getFeaturedVendors(),
  //           getUpcomingBooking(),
  //           getRecentNotifications(),
  //         ]);
  //       setUser(userRes.data);
  //       setWeddingDetails(weddingRes.data);
  //       setBudgetSummary(budgetRes.data);
  //       setChecklistSummary(checklistRes.data);
  //       setFeaturedVendors(vendorsRes.data);
  //       setUpcomingBooking(bookingRes.data);
  //       setNotifications(notifRes.data);
  //     } catch (error) {
  //       console.log("Failed to load home data:", error);
  //     }
  //   };
  //   loadHomeData();
  // }, []);

  const handleSearchSubmit = () => {
    if (!searchQuery.trim()) return;
    // TODO: could also call a search API directly here and show inline suggestions
    // before navigating, e.g. searchVendors({ query: searchQuery })
    navigation.navigate("Vendors", {
      screen: "VendorList",
      params: { search: searchQuery.trim() },
    });
  };

  const handleOpenFilters = () => {
    // TODO: adjust to match how VendorListScreen actually opens its filter UI
    navigation.navigate("Vendors", {
      screen: "VendorList",
      params: { openFilters: true },
    });
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <MaterialIcons name="menu" size={26} color="#333" />
            <View style={{ marginLeft: 12 }}>
              {/* TODO: replace "Pearl" with user.name from getUserProfile() */}
              <Text style={styles.greeting}>Hello, <Text style={{ fontWeight: "700" }}>Pearl</Text> 💐</Text>
              <Text style={styles.subGreeting}>Let's plan your dream wedding</Text>
            </View>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity
              style={styles.bellButton}
              onPress={() => navigation.navigate("Notifications")}
              // TODO: badge visibility should reflect notifications.some(n => !n.isRead)
            >
              <MaterialIcons name="notifications-none" size={24} color="#333" />
              <View style={styles.badge} />
            </TouchableOpacity>
            <Image
              // TODO: replace with user.avatarUrl from getUserProfile()
              source={{ uri: "https://i.pravatar.cc/100" }}
              style={styles.avatar}
            />
          </View>
        </View>

        {/* Wedding Countdown Card */}
        <LinearGradient colors={["#FDEEF3", "#FDE0E9"]} style={styles.weddingCard}>
          <View style={styles.weddingIconCircle}>
            <MaterialIcons name="favorite" size={22} color="#C2185B" />
          </View>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={styles.weddingLabel}>Wedding Date</Text>
            {/* TODO: replace with weddingDetails.date, format with a date lib (e.g. dayjs) */}
            <Text style={styles.weddingDate}>25 Dec 2026</Text>
            {/* TODO: replace with a calculated days-left value from weddingDetails.date */}
            <Text style={styles.daysLeft}>174 Days Left</Text>
          </View>
          <Image source={{ uri: "https://picsum.photos/100/100" }} style={styles.weddingImage} />
        </LinearGradient>

        {/* Budget Pill */}
        <TouchableOpacity
          style={styles.budgetPill}
          onPress={() => navigation.navigate("Budget")}
        >
          <View style={styles.budgetPillLeft}>
            <MaterialIcons name="account-balance-wallet" size={18} color="#C2185B" />
            <Text style={styles.budgetPillLabel}>Wedding Budget</Text>
          </View>
          <View style={styles.budgetPillRight}>
            {/* TODO: replace with budgetSummary.totalBudget, formatted as currency */}
            <Text style={styles.budgetPillValue}>₹10,00,000</Text>
            <MaterialIcons name="chevron-right" size={20} color="#999" />
          </View>
        </TouchableOpacity>

        {/* Search */}
        <View style={styles.searchRow}>
          <View style={styles.searchInputWrapper}>
            <MaterialIcons name="search" size={20} color="#999" />
            <TextInput
              placeholder="Search vendors, services..."
              placeholderTextColor="#999"
              style={styles.searchInput}
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={handleSearchSubmit}
              returnKeyType="search"
            />
          </View>
          <TouchableOpacity style={styles.filterButton} onPress={handleOpenFilters}>
            <MaterialIcons name="tune" size={20} color="#C2185B" />
          </TouchableOpacity>
        </View>

        {/* Categories — static list, unlikely to need an API unless categories are admin-managed */}
        {/* TODO: if Category model is dynamic, fetch via getCategories() and .map() here instead */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Categories</Text>
          <TouchableOpacity onPress={() => navigation.navigate("Vendors", { screen: "VendorList" })}>
            <Text style={styles.viewAll}>View All</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.categoriesGrid}>
          <Category icon="location-city" label="Venue" onPress={() => navigation.navigate("Vendors", { screen: "VendorList", params: { category: "Venue" } })} />
          <Category icon="photo-camera" label="Photography" onPress={() => navigation.navigate("Vendors", { screen: "VendorList", params: { category: "Photography" } })} />
          <Category icon="brush" label="Makeup" onPress={() => navigation.navigate("Vendors", { screen: "VendorList", params: { category: "Makeup" } })} />
          <Category icon="celebration" label="Decorator" onPress={() => navigation.navigate("Vendors", { screen: "VendorList", params: { category: "Decorator" } })} />
          <Category icon="headset" label="DJ" onPress={() => navigation.navigate("Vendors", { screen: "VendorList", params: { category: "DJ" } })} />
          <Category icon="restaurant" label="Caterer" onPress={() => navigation.navigate("Vendors", { screen: "VendorList", params: { category: "Caterer" } })} />
          <Category icon="spa" label="Mehendi" onPress={() => navigation.navigate("Vendors", { screen: "VendorList", params: { category: "Mehendi" } })} />
          <Category icon="music-note" label="Band" onPress={() => navigation.navigate("Vendors", { screen: "VendorList", params: { category: "Band" } })} />
        </View>

        {/* Featured Vendors */}
        {/* TODO: replace hardcoded VendorCard list below with featuredVendors.map(...) */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Featured Vendors</Text>
          <TouchableOpacity onPress={() => navigation.navigate("Vendors", { screen: "VendorList", params: { featured: true } })}>
            <Text style={styles.viewAll}>View All</Text>
          </TouchableOpacity>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingLeft: 20, paddingBottom: 10 }}
        >
          <VendorCard title="Royal Palace" category="Venue" rating="4.9" price="₹50,000 onwards" />
          <VendorCard title="Dream Clicks" category="Photography" rating="4.9" price="₹25,000 onwards" />
          <VendorCard title="Bridal Glow" category="Makeup" rating="4.7" price="₹15,000 onwards" />
          <VendorCard title="Floral Decors" category="Decorator" rating="4.6" price="₹35,000 onwards" />
        </ScrollView>

        {/* Budget + Checklist progress cards */}
        <View style={styles.rowCards}>
          <TouchableOpacity style={styles.progressCard} onPress={() => navigation.navigate("Budget")}>
            <View style={styles.progressHeader}>
              <MaterialIcons name="pie-chart" size={18} color="#22B07D" />
              <Text style={styles.progressTitle}>Budget Overview</Text>
            </View>
            {/* TODO: replace with budgetSummary.spentAmount / remainingBudget from getBudgetSummary() */}
            <Text style={styles.progressBig}>₹3,00,000 <Text style={styles.progressSmall}>spent</Text></Text>
            <Text style={styles.progressSmall}>₹7,00,000 remaining</Text>
            <View style={styles.progressBarTrack}>
              {/* TODO: width should be `${(spentAmount / totalBudget) * 100}%` */}
              <View style={[styles.progressBarFill, { width: "30%", backgroundColor: "#22B07D" }]} />
            </View>
            <Text style={styles.progressPercent}>30% of Total Budget</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.progressCard} onPress={() => navigation.navigate("Checklist")}>
            <View style={styles.progressHeader}>
              <MaterialIcons name="check-circle-outline" size={18} color="#7C4DFF" />
              <Text style={styles.progressTitle}>Checklist Progress</Text>
            </View>
            {/* TODO: replace with checklistSummary.doneCount / totalCount from getChecklistSummary() */}
            <Text style={styles.progressBig}>18<Text style={styles.progressSmall}> / 50 Tasks</Text></Text>
            <View style={styles.progressBarTrack}>
              <View style={[styles.progressBarFill, { width: "36%", backgroundColor: "#7C4DFF" }]} />
            </View>
            <Text style={styles.progressPercent}>36% Completed</Text>
          </TouchableOpacity>
        </View>

        {/* Upcoming Booking */}
        {/* TODO: conditionally render this whole card only if upcomingBooking exists; hide otherwise */}
        <View style={styles.bookingCard}>
          <View style={{ flex: 1 }}>
            <Text style={styles.bookingLabel}>Upcoming Booking</Text>
            {/* TODO: replace with upcomingBooking.vendor.businessName + booking type */}
            <Text style={styles.bookingTitle}>Venue Visit - Royal Palace</Text>
            {/* TODO: replace with formatted upcomingBooking.eventDate */}
            <Text style={styles.bookingTime}>📅 12 July 2026 · 🕐 11:00 AM</Text>
          </View>
          <Image source={{ uri: "https://picsum.photos/100/80" }} style={styles.bookingImage} />
        </View>

        {/* Notifications */}
        {/* TODO: replace single hardcoded item with notifications.slice(0, 3).map(...) */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Notifications</Text>
          <TouchableOpacity onPress={() => navigation.navigate("Notifications")}>
            <Text style={styles.viewAll}>View All</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.notificationItem}>
          <MaterialIcons name="favorite" size={20} color="#C2185B" />
          <View style={{ marginLeft: 12 }}>
            <Text style={styles.notifText}>Your booking at Royal Palace is confirmed.</Text>
            <Text style={styles.notifTime}>2 hours ago</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}