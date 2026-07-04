
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
} from "react-native";
import {
  MaterialIcons,
  FontAwesome5,
  Ionicons,
} from "@expo/vector-icons";

export default function CoupleHomeScreen() {
  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
    >
      {/* Greeting */}
      <Text style={styles.greeting}>👋 Hello, Pearl</Text>

      {/* Wedding Card */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>📅 Wedding Date</Text>
        <Text style={styles.date}>25 Dec 2026</Text>
        <Text style={styles.days}>174 Days Left</Text>
      </View>

      {/* Search */}
      <TextInput
        placeholder="Search Vendors..."
        style={styles.search}
      />

      {/* Categories */}
      <Text style={styles.sectionTitle}>Categories</Text>

      <View style={styles.categories}>
        <Category icon="location-city" label="Venue" />
        <Category icon="camera-alt" label="Photographer" />
        <Category icon="face" label="Makeup" />
        <Category icon="celebration" label="Decorator" />
        <Category icon="music-note" label="DJ" />
        <Category icon="restaurant" label="Caterer" />
        <Category icon="spa" label="Mehendi" />
        <Category icon="festival" label="Band" />
      </View>

      {/* Featured Vendors */}
      <Text style={styles.sectionTitle}>⭐ Featured Vendors</Text>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <VendorCard
          title="Royal Palace"
          category="Venue"
        />

        <VendorCard
          title="Dream Clicks"
          category="Photographer"
        />

        <VendorCard
          title="Bridal Glow"
          category="Makeup Artist"
        />
      </ScrollView>

      {/* Budget */}
      <Text style={styles.sectionTitle}>💰 Budget Overview</Text>

      <View style={styles.budgetContainer}>
        <BudgetCard title="Total" amount="₹10L" />
        <BudgetCard title="Spent" amount="₹3L" />
        <BudgetCard title="Remaining" amount="₹7L" />
      </View>

      {/* Checklist */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>
          📋 Checklist Progress
        </Text>

        <Text style={styles.progress}>
          18 / 50 Tasks Completed
        </Text>
      </View>

      {/* Upcoming Booking */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>
          📅 Upcoming Booking
        </Text>

        <Text>Venue Visit - 12 July</Text>
      </View>

      <View style={{ height: 30 }} />
    </ScrollView>
  );
}

function Category({
  icon,
  label,
}: {
  icon: string;
  label: string;
}) {
  return (
    <View style={styles.categoryItem}>
      <MaterialIcons
        name={icon as any}
        size={28}
        color="#C2185B"
      />
      <Text style={styles.categoryText}>{label}</Text>
    </View>
  );
}

function VendorCard({
  title,
  category,
}: {
  title: string;
  category: string;
}) {
  return (
    <View style={styles.vendorCard}>
      <FontAwesome5
        name="store"
        size={28}
        color="#C2185B"
      />

      <Text style={styles.vendorTitle}>
        {title}
      </Text>

      <Text>{category}</Text>
    </View>
  );
}

function BudgetCard({
  title,
  amount,
}: {
  title: string;
  amount: string;
}) {
  return (
    <View style={styles.budgetCard}>
      <Text style={styles.budgetTitle}>
        {title}
      </Text>

      <Text style={styles.budgetAmount}>
        {amount}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF8F5",
    padding: 16,
  },

  greeting: {
    fontSize: 28,
    fontWeight: "700",
    marginTop: 20,
    marginBottom: 20,
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
    elevation: 2,
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 10,
  },

  date: {
    fontSize: 24,
    fontWeight: "700",
    color: "#C2185B",
  },

  days: {
    marginTop: 5,
    fontSize: 16,
    color: "#666",
  },

  search: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 12,
    marginBottom: 20,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 12,
    marginTop: 10,
  },

  categories: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  categoryItem: {
    width: "23%",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
  },

  categoryText: {
    marginTop: 8,
    textAlign: "center",
    fontSize: 12,
  },

  vendorCard: {
    width: 180,
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 14,
    marginRight: 12,
    alignItems: "center",
  },

  vendorTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginTop: 10,
  },

  budgetContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },

  budgetCard: {
    width: "31%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 14,
    alignItems: "center",
  },

  budgetTitle: {
    color: "#666",
  },

  budgetAmount: {
    fontSize: 18,
    fontWeight: "700",
    color: "#C2185B",
    marginTop: 6,
  },

  progress: {
    fontSize: 18,
    color: "#C2185B",
    fontWeight: "600",
  },
});