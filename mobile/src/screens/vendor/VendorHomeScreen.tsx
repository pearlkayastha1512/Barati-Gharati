import React, { useCallback, useState } from "react";
import { ScrollView, View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";

import { COLORS, SPACING } from "../../constants/theme";
import { styles } from "./vendorHomeStyles";
import { VendorSidebar } from "../../components/vendors/sidebar/VendorSidebar";
import { StatCard } from "../../components/vendors/dashboard/StatCard";
import { QuickActionCard } from "../../components/vendors/dashboard/QuickActionCard";
import { SectionCard } from "../../components/vendors/dashboard/SectionCard";
import { StarRating } from "../../components/vendors/dashboard/StarRating";
import { EmptyState } from "../../components/vendors/dashboard/EmptyState";
import { useVendorDashboardStore } from "../../store/vendorDashboardStore";

export default function VendorHomeScreen() {
  const navigation = useNavigation<any>();
  const [sidebarVisible, setSidebarVisible] = useState(false);

  const {
    isLoading,
    isApproved,
    approvalChecked,
    vendorName,
    bookingsThisMonth,
    revenueThisMonth,
    rating,
    totalCustomers,
    monthRevenue,
    monthBookings,
    monthUpcoming,
    totalBookings,
    pendingRequests,
    conversionRate,
    customerSatisfaction,
    revenueToday,
    revenueThisWeek,
    revenueThisMonthTotal,
    revenueThisYear,
    upcomingBookings,
    recentReviews,
    fetchDashboard,
  } = useVendorDashboardStore();

  useFocusEffect(
    useCallback(() => {
      void fetchDashboard();
    }, [fetchDashboard]),
  );

  // Loading state
  if (!approvalChecked || isLoading) {
    return (
      <SafeAreaView style={styles.safeArea} edges={["top"]}>
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      </SafeAreaView>
    );
  }

  // Vendor not yet approved by admin
  if (!isApproved) {
    return (
      <SafeAreaView style={styles.safeArea} edges={["top"]}>
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center", padding: 24 }}>
          <MaterialCommunityIcons name="clock-alert-outline" size={48} color={COLORS.primary} />
          <Text
            style={{
              fontSize: 18,
              fontWeight: "700",
              color: COLORS.text,
              marginTop: 16,
              textAlign: "center",
            }}
          >
            Your vendor account is awaiting admin approval.
          </Text>
          <Text
            style={{
              fontSize: 13,
              color: COLORS.textMuted,
              marginTop: 8,
              textAlign: "center",
            }}
          >
            You'll be able to access your dashboard once an admin approves your profile.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
  <TouchableOpacity
    onPress={() => setSidebarVisible(true)}
    style={styles.menuButton}
  >
    <MaterialCommunityIcons
      name="menu"
      size={22}
      color={COLORS.text}
    />
  </TouchableOpacity>

  <View style={styles.headerContent}>
    <Text style={styles.headerTitle}>
      Vendor Dashboard
    </Text>

    <Text style={styles.headerSubtitle}>
      Manage your wedding business.
    </Text>
  </View>

  <TouchableOpacity
    style={styles.bellButton}
    activeOpacity={0.8}
    onPress={() => navigation.navigate("VendorNotifications")}
  >
    <MaterialCommunityIcons
      name="bell-outline"
      size={24}
      color="#E91E63"
    />
  </TouchableOpacity>
</View>

        <LinearGradient
          colors={[COLORS.gradientStart, COLORS.gradientEnd]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.heroCard}
        >
          <View style={styles.heroPill}>
            <MaterialCommunityIcons name="briefcase-outline" size={13} color="#fff" />
            <Text style={styles.heroPillText}>Vendor Dashboard</Text>
          </View>
          <Text style={styles.heroTitle}>Welcome back,{"\n"}{vendorName || "Vendor"} 👋</Text>
          <Text style={styles.heroSubtitle}>
            Manage your bookings, earnings, services and grow your business.
          </Text>
          <View style={styles.heroButtonRow}>
            <TouchableOpacity
              style={styles.heroButtonPrimary}
              onPress={() => navigation.navigate("VendorTabs", { screen: "Services" })}
            >
              <Text style={styles.heroButtonPrimaryText}>Manage Services</Text>
              <MaterialCommunityIcons name="arrow-right" size={16} color={COLORS.primary} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.heroButtonSecondary}
              onPress={() => navigation.navigate("VendorCalendar")}
            >
              <Text style={styles.heroButtonSecondaryText}>Open Calendar</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>

        <View style={styles.monthCard}>
          <Text style={styles.monthCardTitle}>This Month</Text>
          <View style={styles.monthRow}>
            <Text style={styles.monthLabel}>Revenue</Text>
            <Text style={styles.monthValue}>₹{monthRevenue}</Text>
          </View>
          <View style={styles.monthRow}>
            <Text style={styles.monthLabel}>Bookings</Text>
            <Text style={styles.monthValue}>{monthBookings}</Text>
          </View>
          <View style={styles.monthRow}>
            <Text style={styles.monthLabel}>Upcoming</Text>
            <Text style={styles.monthValue}>{monthUpcoming}</Text>
          </View>
        </View>

        <View style={styles.grid}>
          <StatCard icon="calendar-check-outline" label="Bookings" value={`${bookingsThisMonth}`} sublabel="This Month" />
          <StatCard icon="cash-multiple" label="Revenue" value={`₹${revenueThisMonth}`} sublabel="Monthly Earnings" />
          <StatCard icon="star-outline" label="Rating" value={`${rating}`} sublabel="Customer Reviews" />
          <StatCard icon="account-group-outline" label="Customers" value={`${totalCustomers}`} sublabel="Total Clients" />
        </View>

        <Text style={styles.sectionHeading}>Quick Actions</Text>
        <Text style={styles.sectionSubheading}>Manage your business efficiently.</Text>
        <View style={styles.grid}>
          <QuickActionCard
            icon="briefcase-outline"
            title="Services"
            subtitle="Manage your wedding services."
            onPress={() => navigation.navigate("VendorTabs", { screen: "Services" })}
          />
          <QuickActionCard
            icon="image-multiple-outline"
            title="Portfolio"
            subtitle="Upload photos and videos."
            onPress={() => navigation.navigate("Portfolio")}
          />
          <QuickActionCard
            icon="calendar-month-outline"
            title="Calendar"
            subtitle="Check your availability."
            onPress={() => navigation.navigate("VendorCalendar")}
          />
          <QuickActionCard
            icon="chat-outline"
            title="Messages"
            subtitle="Talk with customers."
            onPress={() => navigation.navigate("VendorTabs", { screen: "Messages" })}
          />
        </View>

        <SectionCard title="Business Performance" subtitle="Live insights based on your bookings.">
          <View style={styles.performanceGrid}>
            <View style={styles.performanceItem}>
              <Text style={styles.performanceLabel}>Total Bookings</Text>
              <Text style={styles.performanceValue}>{totalBookings}</Text>
            </View>
            <View style={styles.performanceItem}>
              <Text style={styles.performanceLabel}>Pending Requests</Text>
              <Text style={styles.performanceValue}>{pendingRequests}</Text>
            </View>
            <View style={styles.performanceItem}>
              <Text style={styles.performanceLabel}>Conversion Rate</Text>
              <Text style={styles.performanceValue}>{conversionRate}%</Text>
            </View>
            <View style={styles.performanceItem}>
              <Text style={styles.performanceLabel}>Customer Satisfaction</Text>
              <Text style={styles.performanceValue}>{customerSatisfaction} ★</Text>
            </View>
          </View>
        </SectionCard>

        <SectionCard title="Upcoming Bookings" subtitle="Your next scheduled wedding events.">
          {upcomingBookings.length === 0 ? (
            <EmptyState icon="calendar-blank-outline" message="No upcoming bookings." />
          ) : (
            upcomingBookings.map((b) => (
              <View key={b.id} style={styles.upcomingRow}>
                <Text style={styles.upcomingName}>{b.customerName}</Text>
                <Text style={styles.upcomingDate}>{b.date}</Text>
              </View>
            ))
          )}
        </SectionCard>

        <SectionCard title="Revenue Overview">
          <View style={styles.revenueRow}>
            <Text style={styles.revenueLabel}>Today</Text>
            <Text style={styles.revenueValue}>₹{revenueToday}</Text>
          </View>
          <View style={styles.revenueRow}>
            <Text style={styles.revenueLabel}>This Week</Text>
            <Text style={styles.revenueValue}>₹{revenueThisWeek}</Text>
          </View>
          <View style={styles.revenueRow}>
            <Text style={styles.revenueLabel}>This Month</Text>
            <Text style={styles.revenueValue}>₹{revenueThisMonthTotal}</Text>
          </View>
          <View style={[styles.revenueRow, { borderBottomWidth: 0 }]}>
            <Text style={styles.revenueLabel}>This Year</Text>
            <Text style={styles.revenueValue}>₹{revenueThisYear}</Text>
          </View>
        </SectionCard>

        <SectionCard title="Recent Reviews">
          {recentReviews.length === 0 ? (
            <EmptyState icon="star-outline" message="No reviews yet." />
          ) : (
            recentReviews.map((r) => (
              <View key={r.id} style={styles.reviewRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.reviewName}>{r.customerName}</Text>
                  <Text style={styles.reviewComment}>{r.comment}</Text>
                </View>
                <StarRating rating={r.rating} />
              </View>
            ))
          )}
          <TouchableOpacity onPress={() => navigation.navigate("Reviews")} style={{ marginTop: SPACING.sm }}>
            <Text style={styles.seeAll}>See all reviews →</Text>
          </TouchableOpacity>
        </SectionCard>
      </ScrollView>

      <VendorSidebar visible={sidebarVisible} onClose={() => setSidebarVisible(false)} />
        <TouchableOpacity
  style={styles.chatbotButton}
  activeOpacity={0.8}
  onPress={() => navigation.navigate("VendorChatbot")}
>
  <MaterialCommunityIcons
    name="robot-happy-outline"
    size={30}
    color="#fff"
  />
</TouchableOpacity>
    </SafeAreaView>
  );
}
