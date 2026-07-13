import React, { useEffect, useState } from "react";
import { ActivityIndicator, View, Text, ScrollView, Image, TouchableOpacity, ImageBackground, Share, Alert } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useFavoritesStore } from "../../store/favoritesStore";
import { Vendor } from "../../constants/vendorData";
import { getVendorById } from "../../api/vendor.api";
import { AmenityItem } from "../../components/users/vendors/AmenityItem";
import { ReviewSummary } from "../../components/users/vendors/ReviewSummary";
import { styles } from "./styles/VendorDetailsScreen.styles";
import { WriteReviewModal } from "../../components/users/vendors/WriteReviewModal";
import { useReviewStore } from "../../store/reviewStore";
import { useMessagesStore } from "../../store/messagesStore";
import { useAuthStore } from "../../store/authStore";
import { BookVendorModal } from "../../components/users/vendors/BookVendorModal";
import { useBookingStore } from "../../store/bookingStore";
import { SafeAreaView } from "react-native-safe-area-context";
import { Booking } from "../../types/booking";
import { PaymentCheckoutModal } from "../../components/users/booking/PaymentCheckoutModal";

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

const EMPTY_VENDOR: Vendor = {
  id: "",
  name: "",
  category: "",
  rating: "0",
  reviews: "0",
  location: "",
  price: "₹0",
  priceValue: 0,
  image: "",
  packages: [],
};

export default function VendorDetailsScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const vendorId = route?.params?.vendorId;

  const { isFavorite, toggleFavorite } = useFavoritesStore();
  const { user } = useAuthStore();
  const [bookModalVisible, setBookModalVisible] = useState(false);
  const [newBookingForPayment, setNewBookingForPayment] = useState<Booking | null>(null);
const addBooking = useBookingStore((state) => state.addBooking);
 const [vendorData, setVendorData] = useState<Vendor | null>(null);
 const [vendorLoading, setVendorLoading] = useState(true);
 const [vendorError, setVendorError] = useState<string | null>(null);
 const vendor = vendorData ?? EMPTY_VENDOR;

 useEffect(() => {
   let active = true;
   setVendorLoading(true);
   setVendorError(null);
   getVendorById(String(vendorId))
     .then((data) => active && setVendorData(data))
     .catch(() => active && setVendorError("Vendor details load nahi ho sakin."))
     .finally(() => active && setVendorLoading(false));
   return () => { active = false; };
 }, [vendorId]);

// TODO: replace with vendor.packages once Package API is connected
const vendorPackages = vendor.packages ?? [];
  const currentUserId = user?.id ?? "guest";

  // TODO: replace with a real fetch:
  // const [vendor, setVendor] = useState(null);
  // useEffect(() => {
  //   const load = async () => {
  //     const res = await getVendorById(vendorId);
  //     setVendor(res.data);
  //   };
  //   load();
  // }, [vendorId]);


  const favorited = isFavorite(vendor.id);
  const [reviewModalVisible, setReviewModalVisible] = useState(false);

  const addReview = useReviewStore((state) => state.addReview);
  const updateReview = useReviewStore((state) => state.updateReview);
  const deleteReview = useReviewStore((state) => state.deleteReview);
  const getVendorAverage = useReviewStore((state) => state.getVendorAverage);
  const getUserReviewForVendor = useReviewStore((state) => state.getUserReviewForVendor);
  const { average, total, breakdown } = getVendorAverage(vendor.id);
  const userReview = getUserReviewForVendor(vendor.id, currentUserId);

  const startConversation = useMessagesStore((state) => state.startConversation);

 const handleMessageVendor = async () => {
  const conversationId = await startConversation(vendor.id, vendor.name, vendor.image);
  if (!conversationId) {
    Alert.alert("Error", "Couldn't start conversation. Please try again.");
    return;
  }
  navigation.getParent()?.navigate("Chat", { conversationId });
};

const handleSendInquiry = async () => {
  const conversationId = await startConversation(vendor.id, vendor.name, vendor.image);
  if (!conversationId) {
    Alert.alert("Error", "Couldn't start conversation. Please try again.");
    return;
  }
  navigation.getParent()?.navigate("Chat", { conversationId });
};

  const handleDeleteReview = () => {
    if (!userReview) return;
    Alert.alert("Delete Review", "Are you sure you want to delete your review?", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: () => deleteReview(userReview.id) },
    ]);
  };

  // TODO: replace with vendor.description once available from backend
  const aboutText = vendor.description || `${vendor.name} is one of the region's most trusted ${vendor.category.toLowerCase()} providers.`;

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out ${vendor.name} on WedPlan! Starting from ${vendor.price}.`,
      });
    } catch (error) {
      console.log("Share failed:", error);
    }
  };
  

  if (vendorLoading) {
    return <SafeAreaView style={styles.safeArea}><View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}><ActivityIndicator size="large" color="#C2185B" /></View></SafeAreaView>;
  }

  if (vendorError || !vendorData) {
    return <SafeAreaView style={styles.safeArea}><View style={{ flex: 1, alignItems: "center", justifyContent: "center", padding: 24 }}><Text style={{ color: "#C2185B", textAlign: "center" }}>{vendorError ?? "Vendor not found."}</Text><TouchableOpacity onPress={() => navigation.goBack()}><Text style={{ marginTop: 16, fontWeight: "700" }}>Go Back</Text></TouchableOpacity></View></SafeAreaView>;
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
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
            <TouchableOpacity style={styles.shareButton} onPress={handleMessageVendor}>
              <MaterialIcons name="chat-bubble-outline" size={16} color="#fff" />
              <Text style={styles.shareButtonText}>Message</Text>
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

      {/* Services */}
      {/* TODO: replace with vendor.services.map(...) once Package/Service data is available from backend */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Services</Text>
        <Text style={styles.emptyText}>Services will appear here once added by the vendor.</Text>
      </View>

      {/* Customer Reviews */}
      <View style={styles.card}>
        <View style={styles.reviewsHeaderRow}>
          <View>
            <Text style={styles.cardTitle}>Customer Reviews</Text>
            <Text style={styles.cardSubtitle}>Hear what couples say about this vendor.</Text>
          </View>
          {!userReview && (
            <TouchableOpacity style={styles.writeReviewButton} onPress={() => setReviewModalVisible(true)}>
              <Text style={styles.writeReviewButtonText}>Write Review</Text>
            </TouchableOpacity>
          )}
        </View>

        <ReviewSummary averageRating={average} totalReviews={total} breakdown={breakdown} />

        {userReview && (
          <View style={styles.myReviewCard}>
            <View style={styles.myReviewHeader}>
              <Text style={styles.myReviewLabel}>Your Review</Text>
              <View style={styles.myReviewActions}>
                <TouchableOpacity onPress={() => setReviewModalVisible(true)} style={styles.myReviewIconButton}>
                  <MaterialIcons name="edit" size={16} color="#666" />
                </TouchableOpacity>
                <TouchableOpacity onPress={handleDeleteReview} style={styles.myReviewIconButton}>
                  <MaterialIcons name="delete-outline" size={16} color="#E53935" />
                </TouchableOpacity>
              </View>
            </View>
            <View style={{ flexDirection: "row", marginBottom: 6 }}>
              {[1, 2, 3, 4, 5].map((i) => (
                <MaterialIcons
                  key={i}
                  name={i <= userReview.rating ? "star" : "star-border"}
                  size={16}
                  color="#F5A623"
                />
              ))}
            </View>
            {userReview.text ? <Text style={styles.myReviewText}>{userReview.text}</Text> : null}
          </View>
        )}

        {/* TODO: list other users' reviews below via getReviewsForVendor(vendor.id).map(...) once available */}
      </View>

      {/* Send Inquiry — quick contact CTA above Book Now */}
      <TouchableOpacity style={styles.sendInquiryButton} onPress={handleSendInquiry}>
        <MaterialIcons name="chat-bubble-outline" size={18} color="#C2185B" />
        <Text style={styles.sendInquiryButtonText}>Send Inquiry</Text>
      </TouchableOpacity>

      {/* Book Now — fixed action at bottom of scroll content */}
      <TouchableOpacity style={styles.bookNowFixed} onPress={() => setBookModalVisible(true)}>
        <Text style={styles.bookNowFixedText}>Book Now</Text>
      </TouchableOpacity>
      <BookVendorModal
        visible={bookModalVisible}
        onClose={() => setBookModalVisible(false)}
        vendorName={vendor.name}
        packages={vendorPackages}
        onSubmit={async (data) => {
          if (!user) {
            Alert.alert("Login Required", "Please login before creating a booking.");
            return false;
          }

          const [day, month, year] = data.weddingDate.split("-").map(Number);
          const eventDate = new Date(Date.UTC(year, month - 1, day)).toISOString();
          const booking = await addBooking({
            bookingNumber: `WD${new Date().getFullYear()}${Math.random().toString(16).slice(2, 10).toUpperCase()}`,
            customerId: user.id,
            vendorId: Number(vendor.id),
            customerName: user.name,
            customerEmail: data.email,
            customerPhone: data.phone,
            partnerName: data.groomName || data.brideName,
            partnerEmail: data.partnerEmail,
            partnerPhone: data.partnerPhone,
            partnerOccupation: data.partnerOccupation,
            vendorName: vendor.name,
            category: vendor.category,
            packageName: data.packageName,
            eventType: data.eventType,
            eventDate,
            eventTime: "",
            venue: vendor.name,
            city: vendor.city ?? vendor.location,
            contactAddress: data.address,
            contactState: data.state,
            contactCountry: data.country,
            weddingTheme: data.weddingTheme,
            guests: data.guests,
            brideName: data.brideName,
            groomName: data.groomName,
            eventTitle: data.eventTitle,
            primaryPersonName: data.primaryPersonName,
            primaryPersonAge: data.primaryPersonAge,
            eventTheme: data.weddingTheme,
            specialRequirements: data.specialRequirements,
            amount: data.estimatedPrice,
            advancePaid: 0,
            remainingAmount: data.estimatedPrice,
            paymentStatus: "pending",
            bookingStatus: "pending",
          });

          if (!booking) {
            Alert.alert("Booking Failed", useBookingStore.getState().error ?? "Please try again.");
            return false;
          }

          setNewBookingForPayment(booking);
          return true;
        }}
      />
      <PaymentCheckoutModal
        booking={newBookingForPayment}
        mode="advance"
        visible={newBookingForPayment !== null}
        onClose={() => setNewBookingForPayment(null)}
        onPaid={async () => {
          await useBookingStore.getState().loadBookings();
          setNewBookingForPayment(null);
          navigation.getParent()?.navigate("CoupleTabs", { screen: "Bookings" });
        }}
      />
      <WriteReviewModal
        visible={reviewModalVisible}
        onClose={() => setReviewModalVisible(false)}
        initialRating={userReview?.rating ?? 0}
        initialText={userReview?.text ?? ""}
        isEditing={!!userReview}
        onSubmit={(rating, text) => {
          if (userReview) {
            updateReview(userReview.id, rating, text);
          } else {
            addReview(vendor.id, currentUserId, rating, text);
          }
        }}
      />
    
      </ScrollView>
    </SafeAreaView>
  );
}
 
