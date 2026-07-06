import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";

const AMENITIES = [
  { icon: "local-parking", label: "Parking" },
  { icon: "hotel", label: "Luxury Rooms" },
  { icon: "event-seat", label: "AC Banquet" },
  { icon: "park", label: "Outdoor Lawn" },
];

const SERVICES: { id: string; name: string; price: string }[] = [];

const SIMILAR_VENDORS = [
  { id: "2", name: "Imperial Palace Delhi", category: "Wedding Venue", location: "Delhi", price: "₹75,000", rating: "4.8", reviews: "210", image: "https://picsum.photos/300/300?11" },
  { id: "3", name: "Bliss Photography", category: "Photographer", location: "Delhi", price: "₹75,000", rating: "4.8", reviews: "180", image: "https://picsum.photos/300/300?12", featured: true },
  { id: "4", name: "Dream Decor Studio", category: "Decorator", location: "Mumbai", price: "₹1,20,000", rating: "4.7", reviews: "145", image: "https://picsum.photos/300/300?13" },
];

export default function VendorDetailsScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();

  const vendor = {
    name: "Royal Palace Jaipur",
    category: "Wedding Venue",
    location: "Jaipur",
    price: "₹2,50,000",
    rating: "4.9",
    reviews: "250",
    description:
      "Royal Palace Jaipur is one of Rajasthan's most luxurious wedding venues, offering breathtaking architecture, royal hospitality, and world-class event management for unforgettable celebrations.",
    image: "https://picsum.photos/800/500?10",
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Hero image */}
        <View>
          <Image source={{ uri: vendor.image }} style={styles.heroImage} />

          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <MaterialIcons name="arrow-back" size={22} color="#333" />
          </TouchableOpacity>

          <View style={styles.heroOverlay}>
            <View style={styles.badgeRow}>
              <View style={styles.ratingBadge}>
                <MaterialIcons name="star" size={14} color="#F5A623" />
                <Text style={styles.ratingBadgeText}>{vendor.rating} ({vendor.reviews} Reviews)</Text>
              </View>
              <View style={styles.categoryBadge}>
                <Text style={styles.categoryBadgeText}>{vendor.category}</Text>
              </View>
            </View>

            <Text style={styles.heroTitle}>{vendor.name}</Text>

            <View style={styles.locationPriceRow}>
              <MaterialIcons name="location-on" size={16} color="#fff" />
              <Text style={styles.heroLocation}>{vendor.location}</Text>
              <Text style={styles.heroPrice}>{vendor.price}</Text>
            </View>

            <View style={styles.actionRow}>
              <TouchableOpacity style={styles.saveButton}>
                <MaterialIcons name="favorite-border" size={16} color="#333" />
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.shareButton}>
                <MaterialIcons name="share" size={16} color="#fff" />
                <Text style={styles.shareButtonText}>Share</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Services */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Services</Text>
          {SERVICES.length === 0 ? (
            <View style={styles.emptyBox}>
              <Text style={styles.emptyTitle}>No Services Available</Text>
              <Text style={styles.emptySubtitle}>This vendor hasn't added any services yet.</Text>
            </View>
          ) : (
            SERVICES.map((service) => (
              <TouchableOpacity
                key={service.id}
                style={styles.serviceRow}
                onPress={() => navigation.navigate("PackageDetails", { packageId: service.id })}
              >
                <Text style={styles.serviceName}>{service.name}</Text>
                <Text style={styles.servicePrice}>{service.price}</Text>
              </TouchableOpacity>
            ))
          )}
        </View>

        {/* About */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.aboutText}>{vendor.description}</Text>

          <Text style={[styles.sectionTitle, { marginTop: 16 }]}>Amenities</Text>
          <View style={styles.amenitiesGrid}>
            {AMENITIES.map((item) => (
              <View key={item.label} style={styles.amenityChip}>
                <MaterialIcons name={item.icon as any} size={18} color="#C2185B" />
                <Text style={styles.amenityText}>{item.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Reviews */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Customer Reviews</Text>
          <Text style={styles.reviewsSubtitle}>Hear what couples say about this vendor.</Text>

          <View style={styles.reviewSummaryBox}>
            <Text style={styles.reviewBigScore}>0.0</Text>
            <View style={{ flexDirection: "row" }}>
              {[1, 2, 3, 4, 5].map((i) => (
                <MaterialIcons key={i} name="star-border" size={18} color="#F5A623" />
              ))}
            </View>
            <Text style={styles.reviewBasedOn}>Based on 0 Reviews</Text>
          </View>

          <View style={styles.emptyBox}>
            <Text style={styles.emptySubtitle}>No reviews yet.</Text>
          </View>
        </View>

        {/* Similar Vendors */}
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>Similar Vendors</Text>
            <Text style={styles.reviewsSubtitle}>Explore more amazing wedding professionals.</Text>
          </View>
          <TouchableOpacity>
            <Text style={styles.viewAll}>View All</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingLeft: 20, paddingBottom: 20 }}
        >
          {SIMILAR_VENDORS.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.similarCard}
              onPress={() => navigation.push("VendorDetails", { vendorId: item.id })}
            >
              <Image source={{ uri: item.image }} style={styles.similarImage} />
              {item.featured && (
                <View style={styles.featuredBadge}>
                  <Text style={styles.featuredBadgeText}>Featured</Text>
                </View>
              )}
              <View style={styles.similarRating}>
                <MaterialIcons name="star" size={12} color="#F5A623" />
                <Text style={styles.similarRatingText}>{item.rating} ({item.reviews})</Text>
              </View>
              <View style={{ padding: 10 }}>
                <Text style={styles.similarCategory}>{item.category}</Text>
                <Text style={styles.similarName}>{item.name}</Text>
                <View style={styles.similarLocationRow}>
                  <MaterialIcons name="location-on" size={12} color="#999" />
                  <Text style={styles.similarLocation}>{item.location}</Text>
                </View>
                <Text style={styles.similarPrice}>{item.price}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </ScrollView>

      {/* Sticky Book Now bar */}
      <View style={styles.bottomBar}>
        <View>
          <Text style={styles.bottomBarLabel}>Starting From</Text>
          <Text style={styles.bottomBarPrice}>{vendor.price}</Text>
        </View>
        <TouchableOpacity
          style={styles.bookButton}
          onPress={() => navigation.navigate("Bookings", { vendorId: route?.params?.vendorId })}
        >
          <Text style={styles.bookButtonText}>Book Now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FAFAFA" },

  heroImage: { width: "100%", height: 340 },
  backButton: {
    position: "absolute", top: 50, left: 20,
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: "#fff", justifyContent: "center", alignItems: "center",
  },
  heroOverlay: {
    position: "absolute", bottom: 0, left: 0, right: 0,
    backgroundColor: "rgba(0,0,0,0.35)", padding: 16,
  },
  badgeRow: { flexDirection: "row", marginBottom: 10 },
  ratingBadge: {
    flexDirection: "row", alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.9)",
    borderRadius: 16, paddingHorizontal: 10, paddingVertical: 5, marginRight: 8,
  },
  ratingBadgeText: { fontSize: 11, fontWeight: "600", color: "#333", marginLeft: 4 },
  categoryBadge: { backgroundColor: "#C2185B", borderRadius: 16, paddingHorizontal: 10, paddingVertical: 5 },
  categoryBadgeText: { fontSize: 11, fontWeight: "600", color: "#fff" },
  heroTitle: { fontSize: 24, fontWeight: "700", color: "#fff", marginBottom: 8 },
  locationPriceRow: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  heroLocation: { fontSize: 13, color: "#fff", marginLeft: 4, marginRight: 16 },
  heroPrice: { fontSize: 15, fontWeight: "700", color: "#fff" },
  actionRow: { flexDirection: "row" },
  saveButton: {
    flexDirection: "row", alignItems: "center", backgroundColor: "#fff",
    borderRadius: 20, paddingHorizontal: 14, paddingVertical: 8, marginRight: 10,
  },
  saveButtonText: { fontSize: 12, fontWeight: "600", color: "#333", marginLeft: 6 },
  shareButton: {
    flexDirection: "row", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 20, paddingHorizontal: 14, paddingVertical: 8,
  },
  shareButtonText: { fontSize: 12, fontWeight: "600", color: "#fff", marginLeft: 6 },

  card: {
    backgroundColor: "#fff", marginHorizontal: 20, marginTop: 16,
    borderRadius: 18, padding: 16, elevation: 1,
  },
  sectionTitle: { fontSize: 17, fontWeight: "700", color: "#333" },
  emptyBox: {
    borderWidth: 1, borderStyle: "dashed", borderColor: "#ddd",
    borderRadius: 14, padding: 20, alignItems: "center", marginTop: 12,
  },
  emptyTitle: { fontSize: 14, fontWeight: "700", color: "#333", marginBottom: 4 },
  emptySubtitle: { fontSize: 12, color: "#999" },

  serviceRow: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: "#f0f0f0",
  },
  serviceName: { fontSize: 14, color: "#333", fontWeight: "500" },
  servicePrice: { fontSize: 14, color: "#C2185B", fontWeight: "700" },

  aboutText: { fontSize: 13, color: "#666", lineHeight: 20, marginTop: 8 },
  amenitiesGrid: { flexDirection: "row", flexWrap: "wrap", marginTop: 10, gap: 10 },
  amenityChip: {
    flexDirection: "row", alignItems: "center", backgroundColor: "#FDEEF3",
    borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10, width: "47%",
  },
  amenityText: { fontSize: 12, color: "#333", marginLeft: 8 },

  reviewsSubtitle: { fontSize: 12, color: "#999", marginTop: 2 },
  reviewSummaryBox: {
    backgroundColor: "#FDEEF3", borderRadius: 14, padding: 16,
    alignItems: "center", marginTop: 12, marginBottom: 12,
  },
  reviewBigScore: { fontSize: 32, fontWeight: "700", color: "#333" },
  reviewBasedOn: { fontSize: 12, color: "#999", marginTop: 4 },

  sectionHeader: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start",
    marginHorizontal: 20, marginTop: 20, marginBottom: 12,
  },
  viewAll: { fontSize: 13, color: "#C2185B", fontWeight: "600" },

  similarCard: {
    width: 180, backgroundColor: "#fff", borderRadius: 16,
    marginRight: 14, overflow: "hidden", elevation: 1,
  },
  similarImage: { width: "100%", height: 120 },
  featuredBadge: {
    position: "absolute", top: 8, left: 8,
    backgroundColor: "#22B07D", borderRadius: 10, paddingHorizontal: 8, paddingVertical: 3,
  },
  featuredBadgeText: { fontSize: 10, fontWeight: "700", color: "#fff" },
  similarRating: {
    position: "absolute", top: 8, right: 8, flexDirection: "row", alignItems: "center",
    backgroundColor: "#fff", borderRadius: 10, paddingHorizontal: 6, paddingVertical: 3,
  },
  similarRatingText: { fontSize: 10, fontWeight: "600", color: "#333", marginLeft: 2 },
  similarCategory: { fontSize: 10, fontWeight: "700", color: "#C2185B", textTransform: "uppercase" },
  similarName: { fontSize: 13, fontWeight: "700", color: "#333", marginTop: 2 },
  similarLocationRow: { flexDirection: "row", alignItems: "center", marginTop: 4 },
  similarLocation: { fontSize: 11, color: "#999", marginLeft: 3 },
  similarPrice: { fontSize: 13, fontWeight: "700", color: "#C2185B", marginTop: 6 },

  bottomBar: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    backgroundColor: "#fff", paddingHorizontal: 20, paddingVertical: 14,
    borderTopWidth: 1, borderTopColor: "#eee",
  },
  bottomBarLabel: { fontSize: 11, color: "#999" },
  bottomBarPrice: { fontSize: 18, fontWeight: "700", color: "#333" },
  bookButton: { backgroundColor: "#C2185B", borderRadius: 14, paddingHorizontal: 28, paddingVertical: 14 },
  bookButtonText: { fontSize: 14, fontWeight: "700", color: "#fff" },
});