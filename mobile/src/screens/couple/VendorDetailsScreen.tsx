import React from "react";
import { View, Text, ScrollView, Image, TouchableOpacity, ImageBackground, Share } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useFavoritesStore } from "../../store/favoritesStore";
import { DUMMY_VENDORS } from "../../constants/vendorData";
import { AmenityItem } from "../../components/users/vendors/AmenityItem";
import { ReviewSummary } from "../../components/users/vendors/ReviewSummary";
import { styles } from "./styles/VendorDetailsScreen.styles";

// TODO: import API functions once backend is connected
// import { getVendorById } from "../../api/vendor.api";

// TODO: replace with real amenities data once the Vendor model/API supports it
const DUMMY_AMENITIES: { icon: keyof typeof MaterialIcons.glyphMap; label: string }[] = [
  { icon: "local-parking", label: "Parking" },
  { icon: "hotel", label: "Luxury Rooms" },
  { icon: "event-seat", label: "AC Banquet" },
  { icon: "park", label: "Outdoor Lawn" },
  { icon: "restaurant", label: "Catering" },
  { icon: "auto-awesome", label: "Decoration" },
  { icon: "wifi", label: "Wi-Fi" },
];

export default function VendorDetailsScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const vendorId = route?.params?.vendorId;

  const { isFavorite, toggleFavorite } = useFavoritesStore();

  // TODO: replace with a real fetch:
  // const [vendor, setVendor] = useState(null);
  // useEffect(() => {
  //   const load = async () => {
  //     const res = await getVendorById(vendorId);
  //     setVendor(res.data);
  //   };
  //   load();
  // }, [vendorId]);
  const vendor = DUMMY_VENDORS.find((v) => v.id === vendorId) ?? DUMMY_VENDORS[0];

  const favorited = isFavorite(vendor.id);

  // TODO: replace with real review aggregate data from getVendorReviews(vendorId)
  const reviewData = { averageRating: 0, totalReviews: 0, breakdown: [0, 0, 0, 0, 0] };

  // TODO: replace with vendor.description once available from backend
  const aboutText = `${vendor.name} is one of the region's most trusted wedding ${vendor.category.toLowerCase()} providers, offering exceptional service and unforgettable experiences for your special day.`;

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out ${vendor.name} on WedPlan! Starting from ${vendor.price}.`,
      });
    } catch (error) {
      console.log("Share failed:", error);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <ImageBackground source={{ uri: vendor.image }} style={styles.heroImage}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={22} color="#333" />
        </TouchableOpacity>

        <View style={styles.heroOverlay}>
          <View style={styles.badgeRow}>
            <View style={styles.ratingBadge}>
              <MaterialIcons name="star" size={14} color="#F5A623" />
              <Text style={styles.ratingBadgeText}>
                {vendor.rating} ({vendor.reviews} Reviews)
              </Text>
            </View>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryBadgeText}>{vendor.category}</Text>
            </View>
          </View>

          <Text style={styles.vendorName}>{vendor.name}</Text>

          <View style={styles.locationPriceRow}>
            <MaterialIcons name="location-on" size={16} color="#fff" />
            <Text style={styles.locationText}>{vendor.location}</Text>
            <Text style={styles.priceText}>{vendor.price}</Text>
          </View>

          <View style={styles.actionRow}>
            <TouchableOpacity style={styles.saveButton} onPress={() => toggleFavorite(vendor.id)}>
              <MaterialIcons
                name={favorited ? "favorite" : "favorite-border"}
                size={16}
                color={favorited ? "#C2185B" : "#333"}
              />
              <Text style={[styles.saveButtonText, favorited && styles.saveButtonTextActive]}>
                {favorited ? "Saved" : "Save"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
              <MaterialIcons name="share" size={16} color="#fff" />
              <Text style={styles.shareButtonText}>Share</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>

      {/* Gallery */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Gallery</Text>
        {/* TODO: replace with vendor.gallery.map(...) once VendorGallery data is available */}
        <Text style={styles.emptyText}>This vendor hasn't uploaded any portfolio yet.</Text>
      </View>

      {/* About */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>About</Text>
        <Text style={styles.aboutText}>{aboutText}</Text>

        <Text style={[styles.cardTitle, { marginTop: 20 }]}>Amenities</Text>
        <View style={styles.amenitiesGrid}>
          {DUMMY_AMENITIES.map((amenity) => (
            <AmenityItem key={amenity.label} icon={amenity.icon} label={amenity.label} />
          ))}
        </View>
      </View>

      {/* Customer Reviews */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Customer Reviews</Text>
        <Text style={styles.cardSubtitle}>Hear what couples say about this vendor.</Text>
        <ReviewSummary
          averageRating={reviewData.averageRating}
          totalReviews={reviewData.totalReviews}
          breakdown={reviewData.breakdown}
        />
        {/* TODO: list individual reviews below via reviewData.reviews.map(...) once available */}
      </View>

      {/* Book Now — fixed action at bottom of scroll content */}
      <TouchableOpacity
        style={styles.bookNowFixed}
        onPress={() =>
          navigation.navigate("Bookings", {
            screen: "BookingScreen",
            params: { vendorId: vendor.id },
          })
        }
      >
        <Text style={styles.bookNowFixedText}>Book Now</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}