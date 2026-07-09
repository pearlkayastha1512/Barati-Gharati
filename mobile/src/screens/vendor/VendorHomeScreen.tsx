import React, { useState } from "react";
import { ScrollView, View, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

import { COLORS, SPACING } from "../../constants/theme";
import { styles } from "./vendorHomeStyles";
import { VendorSidebar } from "../../components/vendors/sidebar/VendorSidebar";
import { StatCard } from "../../components/vendors/dashboard/StatCard";
import { QuickActionCard } from "../../components/vendors/dashboard/QuickActionCard";
import { SectionCard } from "../../components/vendors/dashboard/SectionCard";
import { StarRating } from "../../components/vendors/dashboard/StarRating";
import { EmptyState } from "../../components/vendors/dashboard/EmptyState";

import {
  MOCK_STATS,
  MOCK_MONTH_SUMMARY,
  MOCK_PERFORMANCE,
  MOCK_REVENUE_OVERVIEW,
  MOCK_UPCOMING_BOOKINGS,
  MOCK_REVIEWS,
} from "../../constants/mockVendorData";

const VENDOR_NAME = "Preeti"; // TODO: pull from authStore once connected

export default function VendorHomeScreen() {
  const navigation = useNavigation<any>();
  const [sidebarVisible, setSidebarVisible] = useState(false);

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => setSidebarVisible(true)}
            style={styles.menuButton}
          >
            <MaterialCommunityIcons name="menu" size={22} color={COLORS.text} />
          </TouchableOpacity>

          <View style={{ flex: 1 }}>
            <Text style={styles.headerTitle}>Vendor Dashboard</Text>
            <Text style={styles.headerSubtitle}>Manage your wedding business.</Text>
          </View>

          <TouchableOpacity style={styles.bellButton}>
            <MaterialCommunityIcons name="bell-outline" size={20} color={COLORS.primary} />
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
          <Text style={styles.heroTitle}>Welcome back,{"\n"}{VENDOR_NAME} 👋</Text>
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
            <Text style={styles.monthValue}>₹{MOCK_MONTH_SUMMARY.revenue}</Text>
          </View>
          <View style={styles.monthRow}>
            <Text style={styles.monthLabel}>Bookings</Text>
            <Text style={styles.monthValue}>{MOCK_MONTH_SUMMARY.bookings}</Text>
          </View>
          <View style={styles.monthRow}>
            <Text style={styles.monthLabel}>Upcoming</Text>
            <Text style={styles.monthValue}>{MOCK_MONTH_SUMMARY.upcoming}</Text>
          </View>
        </View>

        <View style={styles.grid}>
          <StatCard icon="calendar-check-outline" label="Bookings" value={`${MOCK_STATS.bookingsThisMonth}`} sublabel="This Month" />
          <StatCard icon="cash-multiple" label="Revenue" value={`₹${MOCK_STATS.revenueThisMonth}`} sublabel="Monthly Earnings" />
          <StatCard icon="star-outline" label="Rating" value={`${MOCK_STATS.rating}`} sublabel="Customer Reviews" />
          <StatCard icon="account-group-outline" label="Customers" value={`${MOCK_STATS.totalCustomers}`} sublabel="Total Clients" />
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
              <Text style={styles.performanceValue}>{MOCK_PERFORMANCE.totalBookings}</Text>
            </View>
            <View style={styles.performanceItem}>
              <Text style={styles.performanceLabel}>Pending Requests</Text>
              <Text style={styles.performanceValue}>{MOCK_PERFORMANCE.pendingRequests}</Text>
            </View>
            <View style={styles.performanceItem}>
              <Text style={styles.performanceLabel}>Conversion Rate</Text>
              <Text style={styles.performanceValue}>{MOCK_PERFORMANCE.conversionRate}%</Text>
            </View>
            <View style={styles.performanceItem}>
              <Text style={styles.performanceLabel}>Customer Satisfaction</Text>
              <Text style={styles.performanceValue}>{MOCK_PERFORMANCE.customerSatisfaction} ★</Text>
            </View>
          </View>
        </SectionCard>

        <SectionCard title="Upcoming Bookings" subtitle="Your next scheduled wedding events.">
          {MOCK_UPCOMING_BOOKINGS.length === 0 ? (
            <EmptyState icon="calendar-blank-outline" message="No upcoming bookings." />
          ) : (
            MOCK_UPCOMING_BOOKINGS.map((b) => (
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
            <Text style={styles.revenueValue}>₹{MOCK_REVENUE_OVERVIEW.today}</Text>
          </View>
          <View style={styles.revenueRow}>
            <Text style={styles.revenueLabel}>This Week</Text>
            <Text style={styles.revenueValue}>₹{MOCK_REVENUE_OVERVIEW.thisWeek}</Text>
          </View>
          <View style={styles.revenueRow}>
            <Text style={styles.revenueLabel}>This Month</Text>
            <Text style={styles.revenueValue}>₹{MOCK_REVENUE_OVERVIEW.thisMonth}</Text>
          </View>
          <View style={[styles.revenueRow, { borderBottomWidth: 0 }]}>
            <Text style={styles.revenueLabel}>This Year</Text>
            <Text style={styles.revenueValue}>₹{MOCK_REVENUE_OVERVIEW.thisYear}</Text>
          </View>
        </SectionCard>

        <SectionCard title="Recent Reviews">
          {MOCK_REVIEWS.map((r) => (
            <View key={r.id} style={styles.reviewRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.reviewName}>{r.customerName}</Text>
                <Text style={styles.reviewComment}>{r.comment}</Text>
              </View>
              <StarRating rating={r.rating} />
            </View>
          ))}
          <TouchableOpacity onPress={() => navigation.navigate("Reviews")} style={{ marginTop: SPACING.sm }}>
            <Text style={styles.seeAll}>See all reviews →</Text>
          </TouchableOpacity>
        </SectionCard>
      </ScrollView>

      <VendorSidebar visible={sidebarVisible} onClose={() => setSidebarVisible(false)} />
    </SafeAreaView>
  );
}