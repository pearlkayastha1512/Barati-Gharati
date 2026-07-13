import React, { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, RefreshControl, View, Text, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useBookingStore } from "../../store/bookingStore";
import { BookingStatCard } from "../../components/users/booking/BookingStatCard";
import { BookingFilterTabs, FilterKey } from "../../components/users/booking/BookingFilterTabs";
import { BookingListItem } from "../../components/users/booking/BookingListItem";
import { PaymentCheckoutModal } from "../../components/users/booking/PaymentCheckoutModal";
import { Booking } from "../../types/booking";
import { styles } from "./styles/BookingScreen.styles";

// TODO: import API functions once backend is connected
// import { getBookings } from "../../api/booking.api";

export default function BookingScreen() {
  const navigation = useNavigation<any>();
  const { bookings, isLoading, error, loadBookings } = useBookingStore();
  const [activeFilter, setActiveFilter] = useState<FilterKey>("All");
  const [paymentBooking, setPaymentBooking] = useState<Booking | null>(null);
  const [paymentMode, setPaymentMode] = useState<"advance" | "remaining">("advance");

  useEffect(() => {
    loadBookings();
  }, [loadBookings]);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const totalCount = bookings.length;
  const upcomingCount = bookings.filter(
    (b) => b.bookingStatus !== "cancelled" && new Date(b.eventDate) >= today,
  ).length;
  const pendingCount = bookings.filter((b) => b.bookingStatus === "pending").length;
  const completedCount = bookings.filter((b) => b.bookingStatus === "completed").length;
  const cancelledCount = bookings.filter((b) => b.bookingStatus === "cancelled").length;

  const counts: Record<FilterKey, number> = {
    All: totalCount,
    Upcoming: upcomingCount,
    Pending: pendingCount,
    Completed: completedCount,
    Cancelled: cancelledCount,
  };

  const filteredBookings = useMemo(() => {
    if (activeFilter === "Upcoming") {
      return bookings.filter(
        (b) => b.bookingStatus !== "cancelled" && new Date(b.eventDate) >= today,
      );
    }
    if (activeFilter === "All") return bookings;
    return bookings.filter((b) => b.bookingStatus === activeFilter.toLowerCase());
  }, [activeFilter, bookings]);

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={loadBookings} tintColor="#FF4D6D" />}
      >
        {/* Hero */}
        <LinearGradient colors={["#6366F1", "#8B5CF6"]} style={styles.heroCard}>
          <View style={styles.heroBadge}>
            <MaterialIcons name="auto-awesome" size={14} color="#fff" />
            <Text style={styles.heroBadgeText}>Booking Management</Text>
          </View>

          <Text style={styles.heroTitle}>Manage all your{"\n"}wedding bookings.</Text>
          <Text style={styles.heroSubtitle}>
            Track every vendor booking, monitor payment status, view upcoming events and manage your wedding schedule from one place.
          </Text>

          <TouchableOpacity
            style={styles.bookMoreButton}
            onPress={() => navigation.navigate("Vendors", { screen: "VendorList" })}
          >
            <Text style={styles.bookMoreButtonText}>Book More Vendors</Text>
            <MaterialIcons name="arrow-forward" size={16} color="#6366F1" />
          </TouchableOpacity>
        </LinearGradient>

        {/* Stat cards */}
        <View style={styles.statsGrid}>
          <BookingStatCard
            icon="event"
            iconBg="#E3ECFF"
            iconColor="#6366F1"
            label="Total Bookings"
            value={totalCount}
            sublabel="All vendor bookings"
          />
          <BookingStatCard
            icon="schedule"
            iconBg="#FEF6E0"
            iconColor="#D9A404"
            label="Upcoming"
            value={upcomingCount}
            sublabel="Scheduled bookings"
          />
          <BookingStatCard
            icon="check-circle"
            iconBg="#E8F8F0"
            iconColor="#22B07D"
            label="Completed"
            value={completedCount}
            sublabel="Successfully completed"
          />
          <BookingStatCard
            icon="cancel"
            iconBg="#FDECEC"
            iconColor="#E53935"
            label="Cancelled"
            value={cancelledCount}
            sublabel="Cancelled bookings"
          />
        </View>

        {/* Filter tabs */}
        <BookingFilterTabs activeFilter={activeFilter} onSelect={setActiveFilter} counts={counts} />

        {/* Manage Bookings */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionTopRow}>
            <View>
              <Text style={styles.sectionTitle}>Manage Bookings</Text>
              <Text style={styles.sectionSubtitle}>Organize and track all your vendor bookings.</Text>
            </View>
            <TouchableOpacity style={styles.sortPill}>
              <MaterialIcons name="tune" size={14} color="#666" />
              <Text style={styles.sortPillText}>Sort: Latest</Text>
              <MaterialIcons name="arrow-drop-down" size={16} color="#666" />
            </TouchableOpacity>
          </View>
        </View>

        {error ? (
          <View style={styles.errorCard}>
            <MaterialIcons name="error-outline" size={26} color="#E63B5F" />
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={loadBookings}>
              <Text style={styles.retryText}>Try Again</Text>
            </TouchableOpacity>
          </View>
        ) : isLoading && bookings.length === 0 ? (
          <View style={styles.loadingCard}>
            <ActivityIndicator size="large" color="#FF4D6D" />
            <Text style={styles.loadingText}>Loading your bookings...</Text>
          </View>
        ) : filteredBookings.length === 0 ? (
          <View style={styles.sectionCard}>
            <View style={styles.emptyState}>
              <MaterialIcons name="event-busy" size={44} color="#ddd" />
              <Text style={styles.emptyStateText}>No Bookings Found</Text>
              <Text style={styles.emptyStateSubtext}>
                There are no bookings in the {activeFilter} category.
              </Text>
            </View>
          </View>
        ) : (
          <View style={{ paddingHorizontal: 20 }}>
            {filteredBookings.map((booking) => (
              <BookingListItem
                key={booking.id}
                booking={booking}
                onPress={() => navigation.navigate("BookingDetails", { bookingId: booking.id })}
                onPay={(mode) => {
                  setPaymentBooking(booking);
                  setPaymentMode(mode);
                }}
              />
            ))}
          </View>
        )}
      </ScrollView>
      <PaymentCheckoutModal
        booking={paymentBooking}
        mode={paymentMode}
        visible={paymentBooking !== null}
        onClose={() => setPaymentBooking(null)}
        onPaid={loadBookings}
      />
    </SafeAreaView>
  );
}
