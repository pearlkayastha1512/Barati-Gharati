import React, { useState } from "react";
import { View, Text, ScrollView, TextInput, Image, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Category, VendorCard } from "../../components/users/home/HomeCards";
import { styles } from "./styles/HomeScreen.styles";
import { Sidebar } from "../../components/users/home/Sidebar";
import { useChecklistStore } from "../../store/checklistStore";
import { StatCard } from "../../components/users/home/StatCard";
import { QuickActionCard } from "../../components/users/home/QuickActionCard";
import { WeddingProgressChecklist } from "../../components/users/home/WeddingProgressChecklist";
import { useFavoritesStore } from "../../store/favoritesStore";
import { ChatbotFAB } from "../../components/users/home/ChatbotFAB";
import { ChatbotModal } from "../../components/users/home/ChatbotModal";
import { useReviewStore } from "../../store/reviewStore";

import { useBudgetStore } from "../../store/budgetStore";
import { useAuthStore } from "../../store/authStore";

// TODO: import API functions once backend is connected, e.g.
// import { getUserProfile } from "../../api/user.api";
// import { getWeddingDetails } from "../../api/wedding.api";
// import { getBudgetSummary } from "../../api/budget.api";
// import { getFeaturedVendors } from "../../api/vendor.api";
// import { getUpcomingBooking } from "../../api/booking.api";
// import { getRecentNotifications } from "../../api/notification.api";
// import { getUserDashboardStats } from "../../api/dashboard.api";

export default function HomeScreen() {
  const navigation = useNavigation<any>();
  const [searchQuery, setSearchQuery] = useState("");
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [chatbotVisible, setChatbotVisible] = useState(false);
  const user = useAuthStore((state) => state.user);
  const checklistItems = useChecklistStore((state) => state.items);
  const reviewsCount = useReviewStore((state) => state.reviews.length);
  const favoriteIds = useFavoritesStore((state) => state.favoriteIds); 
   const totalBudget = useBudgetStore((state) => state.totalBudget);        // ← add this line
  const expenses = useBudgetStore((state) => state.expenses);              // ← add this line
  const budgetSpent = expenses.reduce((sum, e) => sum + e.amount, 0);       // ← add this line
  const budgetRemaining = totalBudget - budgetSpent;     
  const checklistDoneCount = checklistItems.filter((item) => item.isDone).length;
  const checklistTotal = checklistItems.length;
  const checklistPercent = checklistTotal > 0 ? Math.round((checklistDoneCount / checklistTotal) * 100) : 0;

  // TODO: replace with real state from API responses
  // const [user, setUser] = useState(null);
  // const [dashboardStats, setDashboardStats] = useState(null);
  // const [featuredVendors, setFeaturedVendors] = useState([]);
  // const [upcomingBooking, setUpcomingBooking] = useState(null);
  // const [recentActivity, setRecentActivity] = useState([]);

  // TODO: fetch all home screen data on mount
  // useEffect(() => {
  //   const loadHomeData = async () => {
  //     try {
  //       const [userRes, statsRes, vendorsRes, bookingRes, activityRes] = await Promise.all([
  //         getUserProfile(),
  //         getUserDashboardStats(),
  //         getFeaturedVendors(),
  //         getUpcomingBooking(),
  //         getRecentActivity(),
  //       ]);
  //       setUser(userRes.data);
  //       setDashboardStats(statsRes.data);
  //       setFeaturedVendors(vendorsRes.data);
  //       setUpcomingBooking(bookingRes.data);
  //       setRecentActivity(activityRes.data);
  //     } catch (error) {
  //       console.log("Failed to load home data:", error);
  //     }
  //   };
  //   loadHomeData();
  // }, []);

  const handleSearchSubmit = () => {
    if (!searchQuery.trim()) return;
    navigation.navigate("Vendors", {
      screen: "VendorList",
      params: { search: searchQuery.trim() },
    });
  };

  const handleOpenFilters = () => {
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
            <TouchableOpacity onPress={() => setSidebarVisible(true)}>
              <MaterialIcons name="menu" size={26} color="#333" />
            </TouchableOpacity>
            <View style={{ marginLeft: 12 }}>
              {/* TODO: replace "Pearl" with user.name */}
              <Text style={styles.greeting}>Hello, <Text style={{ fontWeight: "700" }}>{user?.name ?? "Guest"}</Text> 💐</Text>
              <Text style={styles.subGreeting}>Let's plan your dream wedding</Text>
            </View>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.bellButton} onPress={() => navigation.navigate("Notifications")}>
              <MaterialIcons name="notifications-none" size={24} color="#333" />
              <View style={styles.badge} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate("Profile")} style={styles.avatarPlaceholder}>
  <MaterialIcons name="account-circle" size={36} color="#C2185B" />
</TouchableOpacity>
          </View>
        </View>

        {/* Hero Card — Welcome + primary actions (matches website dashboard) */}
        <LinearGradient colors={["#EC407A", "#C2185B"]} style={styles.weddingCard}>
          {/* <Text style={styles.weddingLabel}>Good Morning 🌸</Text> */}
          
          <Text style={[styles.weddingDate, { color: "#fff", fontSize: 22 }]}>Welcome back, {user?.name ?? "Guest"} 👋</Text>
          <Text style={{ color: "rgba(255,255,255,0.85)", fontSize: 12, marginTop: 8 }}>
            Continue planning your dream wedding with trusted vendors.
          </Text>

          <View style={styles.heroButtonRow}>
            <TouchableOpacity
              style={styles.heroButtonPrimary}
              onPress={() => navigation.navigate("Vendors", { screen: "VendorList" })}
            >
              <Text style={styles.heroButtonPrimaryText}>Explore Vendors</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.heroButtonSecondary} onPress={() => navigation.navigate("Checklist")}>
              <Text style={styles.heroButtonSecondaryText}>Wedding Planner</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.heroButtonSecondary} onPress={() => navigation.navigate("Bookings")}>
              <Text style={styles.heroButtonSecondaryText}>My Bookings</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>

        {/* Stat cards — matches website's Bookings / Wishlist / Budget / Reviews grid */}
        {/* TODO: replace all values with real data from getUserDashboardStats() */}
        <View style={styles.statsGrid}>
          <StatCard icon="event" label="Total Bookings" value={0} onPress={() => navigation.navigate("Bookings")} />
          <StatCard icon="favorite" label="Saved Vendors" value={favoriteIds.size} onPress={() => navigation.navigate("Wishlist")} />
           
         <StatCard icon="account-balance-wallet" label="Budget Remaining" value={`₹${budgetRemaining.toLocaleString("en-IN")}`} onPress={() => navigation.navigate("Budget")} /> 
          <StatCard icon="star" label="Reviews Given" value={reviewsCount} />
        </View>

        {/* Quick Actions */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
        </View>
        <View style={styles.quickActionsGrid}>
          <QuickActionCard
            icon="search"
            title="Browse Vendors"
            subtitle="Explore trusted wedding vendors."
            onPress={() => navigation.navigate("Vendors", { screen: "VendorList" })}
          />
          <QuickActionCard
            icon="event-note"
            title="My Bookings"
            subtitle="Track all your bookings."
            onPress={() => navigation.navigate("Bookings")}
          />
          <QuickActionCard
            icon="favorite-border"
            title="Wishlist"
            subtitle="View your saved vendors."
            // TODO: build a WishlistScreen backed by useFavoritesStore and register it in the navigator
            onPress={() => navigation.navigate("Wishlist")}
          />
          <QuickActionCard
            icon="storefront"
            title="Become a Vendor"
            subtitle="Start growing your business."
            // TODO: navigate to your vendor-registration screen/flow once built
           onPress={() => navigation.navigate("BecomeVendor")}
          />
        </View>

        {/* Recent Activity */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
        </View>
        <View style={styles.activityCard}>
          <Text style={{ fontSize: 12, color: "#999" }}>Your latest wedding planning updates.</Text>
          {/* TODO: replace with recentActivity.map(...) once an activity-feed endpoint exists */}
          <View style={styles.activityEmptyBox}>
            <Text style={styles.activityEmptyText}>No recent activity.</Text>
          </View>
        </View>

        {/* Wedding Progress — vendor-category checklist (distinct from task-based Checklist screen) */}
        <WeddingProgressChecklist />

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

        {/* Categories */}
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
          <VendorCard id="1" title="Royal Palace" category="Venue" rating="4.9" price="₹50,000 onwards" />
          <VendorCard id="2" title="Dream Clicks" category="Photography" rating="4.9" price="₹25,000 onwards" />
          <VendorCard id="3" title="Bridal Glow" category="Makeup" rating="4.7" price="₹15,000 onwards" />
          <VendorCard id="4" title="Floral Decors" category="Decorator" rating="4.6" price="₹35,000 onwards" />
        </ScrollView>

        {/* Upcoming Booking */}
        <View style={styles.bookingCard}>
          <View style={{ flex: 1 }}>
            <Text style={styles.bookingLabel}>Upcoming Booking</Text>
            <Text style={styles.bookingTitle}>Venue Visit - Royal Palace</Text>
            <Text style={styles.bookingTime}>📅 12 July 2026 · 🕐 11:00 AM</Text>
          </View>
          <Image source={{ uri: "https://picsum.photos/100/80" }} style={styles.bookingImage} />
        </View>
      </ScrollView>

      <Sidebar visible={sidebarVisible} onClose={() => setSidebarVisible(false)} />
        <ChatbotFAB onPress={() => setChatbotVisible(true)} />
      <ChatbotModal visible={chatbotVisible} onClose={() => setChatbotVisible(false)} />
    </SafeAreaView>
  );
}