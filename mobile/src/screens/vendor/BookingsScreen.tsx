import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, TextInput, TouchableOpacity, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { COLORS } from "../../constants/theme";
import { useVendorBookingsStore } from "../../store/vendorBookingsStore";
import { StatCard } from "../../components/vendors/dashboard/StatCard";
import { StatusFilterDropdown, StatusFilter } from "../../components/vendors/bookings/StatusFilterDropdown";
import { BookingRow } from "../../components/vendors/bookings/BookingRow";
import { BookingDetailsModal } from "../../components/vendors/bookings/BookingDetailsModal";
import { EmptyState } from "../../components/vendors/dashboard/EmptyState";
import { styles } from "./bookingsStyles";

export default function BookingsScreen() {
  const bookings = useVendorBookingsStore((state) => state.bookings);
  const fetchBookings = useVendorBookingsStore((state) => state.fetchBookings);

  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("All Status");
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);
  const [detailsVisible, setDetailsVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Always derived live from the store — never a stale snapshot.
  const selectedBooking = selectedBookingId
    ? bookings.find((b) => b.id === selectedBookingId) ?? null
    : null;

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchBookings();
    setRefreshing(false);
  };

  const totalCount = bookings.length;
  const pendingCount = bookings.filter(
    (b) => b.status === "Pending" || b.status === "Accepted"
  ).length;
  const completedCount = bookings.filter((b) => b.status === "Completed").length;
  const totalRevenue = bookings
  .filter((b) => b.payoutStatus === "released" || b.payoutStatus === "settled")
  .reduce((sum, b) => sum + b.vendorNetAmount, 0);

  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch =
      booking.customerName.toLowerCase().includes(searchText.toLowerCase()) ||
      booking.eventType.toLowerCase().includes(searchText.toLowerCase());

    const matchesStatus =
      statusFilter === "All Status" || booking.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Vendor Dashboard</Text>
        <Text style={styles.headerSubtitle}>Manage your wedding business.</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} colors={[COLORS.primary]} tintColor={COLORS.primary} />
        }
      >
        <LinearGradient colors={[COLORS.gradientStart, COLORS.gradientEnd]} style={styles.heroCard}>
          <View style={styles.heroPill}>
            <MaterialCommunityIcons name="calendar-month-outline" size={13} color="#fff" />
            <Text style={styles.heroPillText}>Bookings</Text>
          </View>
          <Text style={styles.heroTitle}>Manage all{"\n"}customer bookings.</Text>
          <Text style={styles.heroSubtitle}>
            Accept bookings, track payments, schedule events and communicate with customers.
          </Text>
        </LinearGradient>

        <View style={styles.statsGrid}>
          <StatCard icon="calendar-outline" label="Total" value={`${totalCount}`} sublabel="" />
          <StatCard icon="clock-outline" label="Pending" value={`${pendingCount}`} sublabel="" />
          <StatCard icon="check-circle-outline" label="Completed" value={`${completedCount}`} sublabel="" />
          <StatCard icon="wallet-outline" label="Revenue" value={`₹${totalRevenue}`} sublabel="" />
        </View>

        <View style={styles.searchFilterRow}>
          <View style={styles.searchWrapper}>
            <MaterialCommunityIcons name="magnify" size={18} color={COLORS.textMuted} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search customer, event or category..."
              placeholderTextColor={COLORS.textLight}
              value={searchText}
              onChangeText={setSearchText}
            />
          </View>
          <StatusFilterDropdown value={statusFilter} onSelect={setStatusFilter} />
        </View>

        <View style={styles.tableCard}>
          <View style={styles.tableHeaderRow}>
            <Text style={[styles.tableHeaderText, { flex: 1.3 }]}>Customer</Text>
            <Text style={[styles.tableHeaderText, { flex: 1 }]}>Event</Text>
            <Text style={[styles.tableHeaderText, { flex: 1 }]}>Date</Text>
            <Text style={[styles.tableHeaderText, { flex: 1 }]}>Amount</Text>
            <Text style={[styles.tableHeaderText, { flex: 1 }]}>Status</Text>
            <Text style={[styles.tableHeaderText, { flex: 0.8, textAlign: "right" }]}>Action</Text>
          </View>

          {filteredBookings.length === 0 ? (
            <EmptyState icon="calendar-blank-outline" message="No bookings found." />
          ) : (
            filteredBookings.map((booking) => (
              <BookingRow
                key={booking.id}
                booking={booking}
                onPress={() => {
                  setSelectedBookingId(booking.id);
                  setDetailsVisible(true);
                }}
              />
            ))
          )}
        </View>
      </ScrollView>

      <BookingDetailsModal
        visible={detailsVisible}
        booking={selectedBooking}
        onClose={() => setDetailsVisible(false)}
      />
    </SafeAreaView>
  );
}
