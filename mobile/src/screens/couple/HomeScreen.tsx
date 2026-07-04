import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Image,
  TouchableOpacity,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons } from "@expo/vector-icons";

type CategoryProps = {
  icon: any;
  label: string;
};

type StatCardProps = {
  icon: any;
  title: string;
  value: string;
  bgColor?: string;
  iconColor?: string;
};

type VendorCardProps = {
  title: string;
  category: string;
  rating?: string;
  price?: string;
};

function Category({ icon, label }: CategoryProps) {
  return (
    <View style={styles.categoryItem}>
      <MaterialIcons name={icon} size={28} color="#C2185B" />
      <Text style={styles.categoryText}>{label}</Text>
    </View>
  );
}

function StatCard({ icon, title, value, bgColor = "#F3E8FF", iconColor = "#C2185B" }: StatCardProps) {
  return (
    <View style={styles.statCard}>
      <View style={[styles.statIconCircle, { backgroundColor: bgColor }]}>
        <MaterialIcons name={icon} size={20} color={iconColor} />
      </View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statTitle}>{title}</Text>
    </View>
  );
}

function VendorCard({ title, category, rating = "4.8", price = "₹50,000 onwards" }: VendorCardProps) {
  return (
    <View style={styles.vendorCard}>
      <Image
        source={{ uri: "https://picsum.photos/300/200" }}
        style={styles.vendorImage}
      />
      <TouchableOpacity style={styles.vendorHeart}>
        <MaterialIcons name="favorite-border" size={18} color="#C2185B" />
      </TouchableOpacity>
      <View style={{ paddingHorizontal: 15, paddingTop: 12, paddingBottom: 15 }}>
        <Text style={styles.vendorTitle}>{title}</Text>
        <View style={styles.vendorRatingRow}>
          <MaterialIcons name="star" size={14} color="#F5A623" />
          <Text style={styles.vendorRating}>{rating}</Text>
          <Text style={styles.vendorCategory}>· {category}</Text>
        </View>
        <Text style={styles.vendorPrice}>{price}</Text>
      </View>
    </View>
  );
}

export default function HomeScreen() {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <MaterialIcons name="menu" size={26} color="#333" />
          <View style={{ marginLeft: 12 }}>
            <Text style={styles.greeting}>Hello, <Text style={{ fontWeight: "700" }}>Pearl</Text> 💐</Text>
            <Text style={styles.subGreeting}>Let's plan your dream wedding</Text>
          </View>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.bellButton}>
            <MaterialIcons name="notifications-none" size={24} color="#333" />
            <View style={styles.badge} />
          </TouchableOpacity>
          <Image
            source={{ uri: "https://i.pravatar.cc/100" }}
            style={styles.avatar}
          />
        </View>
      </View>

      {/* Wedding Countdown Card */}
      <LinearGradient
        colors={["#FDEEF3", "#FDE0E9"]}
        style={styles.weddingCard}
      >
        <View style={styles.weddingIconCircle}>
          <MaterialIcons name="favorite" size={22} color="#C2185B" />
        </View>
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={styles.weddingLabel}>Wedding Date</Text>
          <Text style={styles.weddingDate}>25 Dec 2026</Text>
          <Text style={styles.daysLeft}>174 Days Left</Text>
        </View>
        <Image
          source={{ uri: "https://picsum.photos/100/100" }}
          style={styles.weddingImage}
        />
      </LinearGradient>

      {/* Budget Pill */}
      <View style={styles.budgetPill}>
        <View style={styles.budgetPillLeft}>
          <MaterialIcons name="account-balance-wallet" size={18} color="#C2185B" />
          <Text style={styles.budgetPillLabel}>Wedding Budget</Text>
        </View>
        <View style={styles.budgetPillRight}>
          <Text style={styles.budgetPillValue}>₹10,00,000</Text>
          <MaterialIcons name="chevron-right" size={20} color="#999" />
        </View>
      </View>

      {/* Search */}
      <View style={styles.searchRow}>
        <View style={styles.searchInputWrapper}>
          <MaterialIcons name="search" size={20} color="#999" />
          <TextInput
            placeholder="Search vendors, services..."
            placeholderTextColor="#999"
            style={styles.searchInput}
          />
        </View>
        <TouchableOpacity style={styles.filterButton}>
          <MaterialIcons name="tune" size={20} color="#C2185B" />
        </TouchableOpacity>
      </View>

      {/* Categories */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Categories</Text>
        <TouchableOpacity>
          <Text style={styles.viewAll}>View All</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.categoriesGrid}>
        <Category icon="location-city" label="Venue" />
        <Category icon="photo-camera" label="Photography" />
        <Category icon="brush" label="Makeup" />
        <Category icon="celebration" label="Decorator" />
        <Category icon="headset" label="DJ" />
        <Category icon="restaurant" label="Caterer" />
        <Category icon="spa" label="Mehendi" />
        <Category icon="music-note" label="Band" />
      </View>

      {/* Featured Vendors */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Featured Vendors</Text>
        <TouchableOpacity>
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

      {/* Budget + Checklist */}
      <View style={styles.rowCards}>
        <View style={styles.progressCard}>
          <View style={styles.progressHeader}>
            <MaterialIcons name="pie-chart" size={18} color="#22B07D" />
            <Text style={styles.progressTitle}>Budget Overview</Text>
          </View>
          <Text style={styles.progressBig}>₹3,00,000 <Text style={styles.progressSmall}>spent</Text></Text>
          <Text style={styles.progressSmall}>₹7,00,000 remaining</Text>
          <View style={styles.progressBarTrack}>
            <View style={[styles.progressBarFill, { width: "30%", backgroundColor: "#22B07D" }]} />
          </View>
          <Text style={styles.progressPercent}>30% of Total Budget</Text>
        </View>

        <View style={styles.progressCard}>
          <View style={styles.progressHeader}>
            <MaterialIcons name="check-circle-outline" size={18} color="#7C4DFF" />
            <Text style={styles.progressTitle}>Checklist Progress</Text>
          </View>
          <Text style={styles.progressBig}>18<Text style={styles.progressSmall}> / 50 Tasks</Text></Text>
          <View style={styles.progressBarTrack}>
            <View style={[styles.progressBarFill, { width: "36%", backgroundColor: "#7C4DFF" }]} />
          </View>
          <Text style={styles.progressPercent}>36% Completed</Text>
        </View>
      </View>

      {/* Upcoming Booking */}
      <View style={styles.bookingCard}>
        <View style={{ flex: 1 }}>
          <Text style={styles.bookingLabel}>Upcoming Booking</Text>
          <Text style={styles.bookingTitle}>Venue Visit - Royal Palace</Text>
          <Text style={styles.bookingTime}>📅 12 July 2026 · 🕐 11:00 AM</Text>
        </View>
        <Image
          source={{ uri: "https://picsum.photos/100/80" }}
          style={styles.bookingImage}
        />
      </View>

      {/* Notifications */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Recent Notifications</Text>
        <TouchableOpacity>
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

      <View style={{ height: 30 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFAFA",
    paddingTop: 50,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  greeting: {
    fontSize: 16,
    color: "#333",
  },
  subGreeting: {
    fontSize: 12,
    color: "#999",
    marginTop: 2,
  },
  bellButton: {
    marginRight: 12,
    position: "relative",
  },
  badge: {
    position: "absolute",
    top: -2,
    right: -2,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#C2185B",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },

  weddingCard: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
  },
  weddingIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  weddingLabel: {
    fontSize: 12,
    color: "#C2185B",
    fontWeight: "600",
  },
  weddingDate: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
    marginTop: 2,
  },
  daysLeft: {
    fontSize: 12,
    color: "#C2185B",
    fontWeight: "600",
    marginTop: 2,
  },
  weddingImage: {
    width: 50,
    height: 50,
    borderRadius: 12,
  },

  budgetPill: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 14,
    marginBottom: 16,
    elevation: 1,
  },
  budgetPillLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  budgetPillLabel: {
    marginLeft: 8,
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
  },
  budgetPillRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  budgetPillValue: {
    fontSize: 14,
    fontWeight: "700",
    color: "#333",
    marginRight: 4,
  },

  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 20,
    marginBottom: 20,
  },
  searchInputWrapper: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 46,
    elevation: 1,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    color: "#333",
  },
  filterButton: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
    elevation: 1,
  },

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 20,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
  },
  viewAll: {
    fontSize: 13,
    color: "#C2185B",
    fontWeight: "600",
  },

  categoriesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginHorizontal: 20,
    marginBottom: 20,
  },
  categoryItem: {
    width: "23%",
    aspectRatio: 1,
    backgroundColor: "#fff",
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
    elevation: 1,
  },
  categoryText: {
    marginTop: 8,
    fontSize: 11,
    fontWeight: "600",
    color: "#333",
  },

  vendorCard: {
    width: 220,
    backgroundColor: "#fff",
    borderRadius: 20,
    overflow: "hidden",
    marginRight: 15,
    elevation: 1,
  },
  vendorImage: {
    width: "100%",
    height: 130,
  },
  vendorHeart: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "#fff",
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  vendorTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#333",
  },
  vendorRatingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  vendorRating: {
    fontSize: 12,
    marginLeft: 4,
    color: "#333",
    fontWeight: "600",
  },
  vendorCategory: {
    fontSize: 12,
    color: "#999",
    marginLeft: 4,
  },
  vendorPrice: {
    fontSize: 12,
    color: "#C2185B",
    fontWeight: "600",
    marginTop: 6,
  },

  statCard: {
    width: "31%",
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 15,
    alignItems: "center",
  },
  statIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  statValue: {
    fontWeight: "700",
    fontSize: 18,
    marginTop: 8,
  },
  statTitle: {
    color: "#666",
    marginTop: 4,
    fontSize: 12,
  },

  rowCards: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 20,
    marginBottom: 20,
  },
  progressCard: {
    width: "48%",
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 14,
    elevation: 1,
  },
  progressHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  progressTitle: {
    fontSize: 12,
    fontWeight: "600",
    color: "#333",
    marginLeft: 6,
  },
  progressBig: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
  },
  progressSmall: {
    fontSize: 11,
    color: "#999",
    fontWeight: "400",
  },
  progressBarTrack: {
    height: 6,
    backgroundColor: "#EEE",
    borderRadius: 3,
    marginTop: 10,
    marginBottom: 6,
  },
  progressBarFill: {
    height: 6,
    borderRadius: 3,
  },
  progressPercent: {
    fontSize: 11,
    color: "#999",
  },

  bookingCard: {
    flexDirection: "row",
    backgroundColor: "#FFF8E1",
    marginHorizontal: 20,
    borderRadius: 18,
    padding: 14,
    marginBottom: 20,
    alignItems: "center",
  },
  bookingLabel: {
    fontSize: 11,
    color: "#B8860B",
    fontWeight: "600",
  },
  bookingTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#333",
    marginTop: 4,
  },
  bookingTime: {
    fontSize: 12,
    color: "#777",
    marginTop: 4,
  },
  bookingImage: {
    width: 60,
    height: 50,
    borderRadius: 10,
    marginLeft: 10,
  },

  notificationItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#fff",
    marginHorizontal: 20,
    borderRadius: 14,
    padding: 14,
    elevation: 1,
  },
  notifText: {
    fontSize: 13,
    color: "#333",
    flexShrink: 1,
  },
  notifTime: {
    fontSize: 11,
    color: "#999",
    marginTop: 4,
  },
});