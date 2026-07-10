import React from "react";
import { ScrollView, View, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

import { COLORS } from "../../constants/theme";
import { useVendorAnalyticsStore } from "../../store/vendorAnalyticsStore";
import { StatCard } from "../../components/vendors/dashboard/StatCard";
import { EmptyState } from "../../components/vendors/dashboard/EmptyState";
import { RevenueBarChart } from "../../components/vendors/earnings/RevenueBarChart";
import { styles } from "./vendorAnalyticsStyles";

export default function VendorAnalyticsScreen() {
  const navigation = useNavigation<any>();
  const {
    profileViews,
    customers,
    growthPercent,
    rating,
    monthlyBookings,
    totalBookingsThisYear,
    bestRevenueMonth,
    topServices,
    insights,
  } = useVendorAnalyticsStore();

  const bookingChartData = monthlyBookings.map((m) => ({ month: m.month, amount: m.count }));

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Hero header */}
        <LinearGradient
          colors={[COLORS.gradientStart, COLORS.gradientEnd]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.heroCard}
        >
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <MaterialCommunityIcons name="arrow-left" size={20} color="#fff" />
          </TouchableOpacity>

          <View style={styles.heroPill}>
            <MaterialCommunityIcons name="chart-line" size={13} color="#fff" />
            <Text style={styles.heroPillText}>Analytics Dashboard</Text>
          </View>
          <Text style={styles.heroTitle}>Measure your{"\n"}business growth.</Text>
          <Text style={styles.heroSubtitle}>
            Understand your bookings, customers and revenue trends.
          </Text>
        </LinearGradient>

        {/* Stat Cards */}
        <View style={styles.grid}>
          <StatCard icon="eye-outline" label="Profile Views" value={String(profileViews)} sublabel="All time" />
          <StatCard icon="account-group-outline" label="Customers" value={String(customers)} sublabel="Total customers" />
          <StatCard icon="trending-up" label="Growth" value={`+${growthPercent}%`} sublabel="This period" />
          <StatCard icon="star-outline" label="Rating" value={rating.toFixed(1)} sublabel="Average rating" />
        </View>

        {/* Booking Trend */}
        <View style={styles.chartCard}>
          <View style={styles.chartCardHeader}>
            <Text style={styles.chartCardTitle}>Booking Trend</Text>
            <View style={styles.chartPill}>
              <Text style={styles.chartPillText}>{totalBookingsThisYear} Total</Text>
            </View>
          </View>
          <Text style={styles.chartCardSubtitle}>Monthly bookings for {new Date().getFullYear()}</Text>
          <RevenueBarChart data={bookingChartData} />
        </View>

        {/* Revenue Growth */}
        <View style={styles.chartCard}>
          <View style={styles.chartCardHeader}>
            <Text style={styles.chartCardTitle}>Revenue Growth</Text>
            <View style={styles.greenPill}>
              <Text style={styles.greenPillText}>Best Month • {bestRevenueMonth}</Text>
            </View>
          </View>
          <Text style={styles.chartCardSubtitle}>Monthly earnings overview</Text>
          <View style={styles.emptyChartBox}>
            <Text style={styles.emptyChartText}>No revenue available yet.</Text>
          </View>
        </View>

        {/* Top Performing Services */}
        <View style={styles.serviceCard}>
          <View style={styles.serviceCardHeader}>
            <Text style={styles.serviceCardTitle}>Top Performing Services</Text>
            <View style={styles.chartPill}>
              <Text style={styles.chartPillText}>{topServices.length} Services</Text>
            </View>
          </View>
          <Text style={styles.serviceCardSubtitle}>Ranked by generated revenue</Text>

          {topServices.length === 0 ? (
            <EmptyState icon="briefcase-outline" message="No service data available yet." />
          ) : (
            topServices.map((service) => (
              <View key={service.id} style={styles.serviceRow}>
                <View style={styles.serviceIconBox}>
                  <MaterialCommunityIcons name="briefcase-outline" size={18} color={COLORS.primary} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.serviceName}>{service.name}</Text>
                  <Text style={styles.serviceBookings}>{service.bookings} Bookings</Text>
                </View>
                <View style={{ alignItems: "flex-end" }}>
                  <Text style={styles.serviceRevenue}>₹{service.revenue.toLocaleString("en-IN")}</Text>
                  <Text style={styles.serviceRank}>#{service.rank}</Text>
                </View>
              </View>
            ))
          )}
        </View>

        {/* Insights */}
        <View style={styles.insightsCard}>
          <Text style={styles.insightsTitle}>Insights</Text>

          {insights.length === 0 ? (
            <EmptyState icon="lightbulb-outline" message="No insights available yet." />
          ) : (
            insights.map((insight) => (
              <View key={insight.id} style={styles.insightRow}>
                <MaterialCommunityIcons name={insight.icon as any} size={16} color={COLORS.primary} />
                <Text style={styles.insightText}>{insight.text}</Text>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}