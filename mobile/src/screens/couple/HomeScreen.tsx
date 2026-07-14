import React, { useCallback, useState } from "react";
import { View, Text, ScrollView, TextInput, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons } from "@expo/vector-icons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { Category, VendorCard } from "../../components/users/home/HomeCards";
import { styles } from "./styles/HomeScreen.styles";
import { Sidebar } from "../../components/users/home/Sidebar";
import { StatCard } from "../../components/users/home/StatCard";
import { QuickActionCard } from "../../components/users/home/QuickActionCard";
import { WeddingProgressChecklist } from "../../components/users/home/WeddingProgressChecklist";
import { useFavoritesStore } from "../../store/favoritesStore";
import { ChatbotFAB } from "../../components/users/home/ChatbotFAB";
import { ChatbotModal } from "../../components/users/home/ChatbotModal";
import { useReviewStore } from "../../store/reviewStore";

import { useBudgetStore } from "../../store/budgetStore";
import { useAuthStore } from "../../store/authStore";
import { useBookingStore } from "../../store/bookingStore";
import { useNotificationsStore } from "../../store/notificationsStore";
import { getAllVendors } from "../../api/vendor.api";
import type { Vendor } from "../../constants/vendorData";

export default function HomeScreen() {
  const navigation = useNavigation<any>();
  const [searchQuery, setSearchQuery] = useState("");
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [chatbotVisible, setChatbotVisible] = useState(false);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const user = useAuthStore((state) => state.user);
  const reviewsCount = useReviewStore((state) => state.reviews.length);
  const reviews = useReviewStore((state) => state.reviews);
  const loadMyReviews = useReviewStore((state) => state.loadMyReviews);
  const favoriteIds = useFavoritesStore((state) => state.favoriteIds);
  const wishlistItems = useFavoritesStore((state) => state.items);
  const loadFavorites = useFavoritesStore((state) => state.loadFavorites);
  const totalBudget = useBudgetStore((state) => state.totalBudget);
  const expenses = useBudgetStore((state) => state.expenses);
  const loadBudget = useBudgetStore((state) => state.loadBudget);
  const bookings = useBookingStore((state) => state.bookings);
  const loadBookings = useBookingStore((state) => state.loadBookings);
  const notifications = useNotificationsStore((state) => state.notifications);
  const fetchNotifications = useNotificationsStore((state) => state.fetchNotifications);
  const budgetSpent = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const budgetRemaining = totalBudget - budgetSpent;
  const firstName = user?.name?.split(" ")[0] ?? "Guest";
  const currentHour = new Date().getHours();
  const greeting =
    currentHour < 12
      ? "Good Morning"
      : currentHour < 18
        ? "Good Afternoon"
        : "Good Evening";

  useFocusEffect(
    useCallback(() => {
      void Promise.all([
        loadBookings(),
        loadFavorites(),
        loadBudget(),
        loadMyReviews(),
        fetchNotifications(),
        getAllVendors().then(setVendors).catch(() => undefined),
      ]);
    }, [fetchNotifications, loadBookings, loadBudget, loadFavorites, loadMyReviews]),
  );

  const activeBookings = bookings.filter(
    (booking) => !["cancelled", "rejected"].includes(booking.bookingStatus),
  );
  const upcomingBooking = activeBookings
    .filter((booking) => new Date(booking.eventDate).getTime() >= new Date().setHours(0, 0, 0, 0))
    .sort((first, second) =>
      new Date(first.eventDate).getTime() - new Date(second.eventDate).getTime()
    )[0];
  const featuredVendors = [
    ...vendors.filter((vendor) => vendor.featured),
    ...vendors.filter((vendor) => !vendor.featured),
  ].slice(0, 4);
  const bookedCategories = activeBookings.map((booking) => booking.category);
  const unreadNotifications = notifications.filter((notification) => !notification.isRead).length;
  const recentActivity = [
    ...bookings.map((booking) => ({
      id: `booking-${booking.id}`,
      title: `${booking.vendorName} booking`,
      detail: booking.bookingStatus.replace(/_/g, " "),
      date: booking.updatedAt,
      icon: "event-note" as const,
    })),
    ...wishlistItems.map((item) => ({
      id: `wishlist-${item.id}`,
      title: `${item.vendorName} saved`,
      detail: "Added to wishlist",
      date: item.addedAt,
      icon: "favorite" as const,
    })),
    ...expenses.map((expense) => ({
      id: `expense-${expense.id}`,
      title: expense.title,
      detail: `₹${expense.amount.toLocaleString("en-IN")} expense added`,
      date: expense.date,
      icon: "account-balance-wallet" as const,
    })),
    ...reviews.map((review) => ({
      id: `review-${review.id}`,
      title: "Review submitted",
      detail: `${review.rating} star vendor review`,
      date: review.date,
      icon: "star" as const,
    })),
  ]
    .sort((first, second) => new Date(second.date).getTime() - new Date(first.date).getTime())
    .slice(0, 3);

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
              <MaterialIcons name="menu" size={26} color="#3f1d2f" />
            </TouchableOpacity>
            <View style={styles.headerCopy}>
              <Text style={styles.greeting} numberOfLines={1}>
                {`${firstName}'s Dashboard`}
              </Text>
              <Text style={styles.subGreeting}>{greeting}, <Text style={styles.headerName}>{firstName}</Text></Text>
            </View>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.bellButton} onPress={() => navigation.navigate("Notifications")}>
              <MaterialIcons name="notifications-none" size={24} color="#ff4d6d" />
              {unreadNotifications > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{unreadNotifications > 9 ? "9+" : unreadNotifications}</Text>
                </View>
              )}
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate("Profile")} style={styles.avatarPlaceholder}>
              <View style={styles.avatarCircle}>
                <Text style={styles.avatarInitial}>{firstName.charAt(0).toUpperCase()}</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Hero Card — Welcome + primary actions (matches website dashboard) */}
        <LinearGradient
          colors={["#fffef7", "#ffe6eb", "#ff8fa1", "#ff4d6d"]}
          locations={[0, 0.28, 0.68, 1]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.weddingCard}
        >
          <View style={styles.heroGreetingPill}>
            <MaterialIcons name="auto-awesome" size={15} color="#6c2d45" />
            <Text style={styles.heroGreetingText}>{greeting}</Text>
          </View>

          <Text style={styles.weddingDate}>Welcome back,{"\n"}{firstName}</Text>
          <Text style={styles.heroDescription}>
            Build your wedding plan one beautiful detail at a time: shortlist vendors,
            track bookings and keep every celebration moment organized.
          </Text>

          <View style={styles.heroTagRow}>
            {["Vendors", "Wishlist", "Budget", "Guest-ready"].map((item) => (
              <View key={item} style={styles.heroTag}>
                <Text style={styles.heroTagText}>{item}</Text>
              </View>
            ))}
          </View>

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

        {/* Stat cards — database-backed Bookings / Wishlist / Budget / Reviews grid */}
        <View style={styles.statsGrid}>
          <StatCard icon="event" title="Bookings" label="Total Bookings" value={bookings.length} onPress={() => navigation.navigate("Bookings")} />
          <StatCard icon="favorite" title="Wishlist" label="Saved Vendors" value={favoriteIds.size} onPress={() => navigation.navigate("Wishlist")} />
          <StatCard icon="account-balance-wallet" title="Budget" label="Budget Remaining" value={`₹${budgetRemaining.toLocaleString("en-IN")}`} onPress={() => navigation.navigate("Budget")} />
          <StatCard icon="star" title="Reviews" label="Reviews Given" value={reviewsCount} />
        </View>

        {/* Quick Actions */}
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            <Text style={styles.sectionSubtitle}>Plan faster with the next steps couples use most.</Text>
          </View>
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
            onPress={() => navigation.navigate("Wishlist")}
          />
          <QuickActionCard
            icon="storefront"
            title="Become a Vendor"
            subtitle="Start growing your business."
            onPress={() => navigation.navigate("BecomeVendor")}
          />
        </View>

        {/* Recent Activity */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
        </View>
        <View style={styles.activityCard}>
          <Text style={styles.cardSubtitle}>Your latest wedding planning updates.</Text>
          {recentActivity.length === 0 ? (
            <View style={styles.activityEmptyBox}>
              <Text style={styles.activityEmptyText}>No recent activity.</Text>
            </View>
          ) : (
            <View style={styles.activityList}>
              {recentActivity.map((activity) => (
                <View key={activity.id} style={styles.activityRow}>
                  <View style={styles.activityIcon}>
                    <MaterialIcons name={activity.icon} size={18} color="#ff4d6d" />
                  </View>
                  <View style={styles.activityCopy}>
                    <Text style={styles.activityTitle} numberOfLines={1}>{activity.title}</Text>
                    <Text style={styles.activityDetail} numberOfLines={1}>{activity.detail}</Text>
                  </View>
                  <Text style={styles.activityDate}>
                    {new Date(activity.date).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Wedding Progress — vendor-category checklist (distinct from task-based Checklist screen) */}
        <WeddingProgressChecklist bookedCategories={bookedCategories} />

        {/* Search */}
        <View style={styles.searchRow}>
          <View style={styles.searchInputWrapper}>
            <MaterialIcons name="search" size={20} color="#8d6171" />
            <TextInput
              placeholder="Search vendors, services..."
              placeholderTextColor="#8d6171"
              style={styles.searchInput}
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={handleSearchSubmit}
              returnKeyType="search"
            />
          </View>
          <TouchableOpacity style={styles.filterButton} onPress={handleOpenFilters}>
            <MaterialIcons name="tune" size={20} color="#ff4d6d" />
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
        {featuredVendors.length === 0 ? (
          <View style={styles.sectionEmptyBox}>
            <Text style={styles.activityEmptyText}>No featured vendors available.</Text>
          </View>
        ) : (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.featuredList}
          >
            {featuredVendors.map((vendor) => (
              <VendorCard
                key={vendor.id}
                id={vendor.id}
                title={vendor.name}
                category={vendor.category}
                rating={vendor.rating}
                price={`${vendor.price} onwards`}
                imageUrl={vendor.image}
              />
            ))}
          </ScrollView>
        )}

        {/* Upcoming Booking */}
        <View style={styles.bookingCard}>
          <View style={styles.bookingCopy}>
            <Text style={styles.bookingLabel}>Upcoming Booking</Text>
            {upcomingBooking ? (
              <>
                <Text style={styles.bookingTitle} numberOfLines={2}>
                  {upcomingBooking.packageName} · {upcomingBooking.vendorName}
                </Text>
                <Text style={styles.bookingTime} numberOfLines={2}>
                  📅 {new Date(upcomingBooking.eventDate).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}{upcomingBooking.eventTime ? ` · 🕐 ${upcomingBooking.eventTime}` : ""}
                </Text>
              </>
            ) : (
              <Text style={styles.bookingEmptyText}>No upcoming booking yet.</Text>
            )}
          </View>
          <View style={styles.bookingIconBox}>
            <MaterialIcons name="event-available" size={28} color="#ff4d6d" />
          </View>
        </View>
      </ScrollView>

      <Sidebar visible={sidebarVisible} onClose={() => setSidebarVisible(false)} />
      <ChatbotFAB onPress={() => setChatbotVisible(true)} />
      <ChatbotModal visible={chatbotVisible} onClose={() => setChatbotVisible(false)} />
    </SafeAreaView>
  );
}
