import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  ImageBackground,
  Share,
  Alert,
  Modal,
  Dimensions,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useFavoritesStore } from "../../store/favoritesStore";
import { Vendor } from "../../constants/vendorData";
import { getVendorById } from "../../api/vendor.api";
import { getVendorPortfolio } from "../../api/portfolio.api";
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

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

interface PortfolioItem {
  id: string;
  vendorId: number;
  title: string;
  category: string;
  categories: string[];
  description: string;
  image: string;
  createdAt: string;
  updatedAt: string;
}

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

  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [portfolioLoading, setPortfolioLoading] = useState(true);
  const [viewerVisible, setViewerVisible] = useState(false);
  const [viewerIndex, setViewerIndex] = useState(0);

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

  useEffect(() => {
    let active = true;
    setPortfolioLoading(true);
    getVendorPortfolio(Number(vendorId))
      .then((data: PortfolioItem[]) => active && setPortfolioItems(data))
      .catch(() => active && setPortfolioItems([]))
      .finally(() => active && setPortfolioLoading(false));
    return () => { active = false; };
  }, [vendorId]);

  const vendorPackages = vendor.packages ?? [];
  const currentUserId = user?.id ?? "guest";

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
    try {
      const conversationId = await startConversation(
        vendor.backendId ?? vendor.id,
        vendor.name,
        vendor.image,
      );
      navigation.getParent()?.navigate("Chat", { conversationId });
    } catch (error: any) {
      const responseMessage = error?.response?.data?.message;
      const message = Array.isArray(responseMessage)
        ? responseMessage.join(" ")
        : responseMessage;

      Alert.alert(
        "Chat unavailable",
        typeof message === "string" && message.trim()
          ? message
          : "Conversation start nahi ho saki. Advance payment aur admin approval check karein.",
      );
    }
  };

  const handleSendInquiry = async () => {
    try {
      const conversationId = await startConversation(
        vendor.backendId ?? vendor.id,
        vendor.name,
        vendor.image,
      );
      navigation.getParent()?.navigate("Chat", { conversationId });
    } catch (error: any) {
      const responseMessage = error?.response?.data?.message;
      const message = Array.isArray(responseMessage)
        ? responseMessage.join(" ")
        : responseMessage;

      Alert.alert(
        "Chat unavailable",
        typeof message === "string" && message.trim()
          ? message
          : "Conversation start nahi ho saki. Advance payment aur admin approval check karein.",
      );
    }
  };

  const handleDeleteReview = () => {
    if (!userReview) return;
    Alert.alert("Delete Review", "Are you sure you want to delete your review?", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: () => deleteReview(userReview.id) },
    ]);
  };

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

  const openViewer = (index: number) => {
    setViewerIndex(index);
    setViewerVisible(true);
  };

  const activePortfolioItem = portfolioItems[viewerIndex];

  if (vendorLoading) {
    return <SafeAreaView style={styles.safeArea}><View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}><ActivityIndicator size="large" color="#FF4D6D" /></View></SafeAreaView>;
  }

  if (vendorError || !vendorData) {
    return <SafeAreaView style={styles.safeArea}><View style={{ flex: 1, alignItems: "center", justifyContent: "center", padding: 24 }}><Text style={{ color: "#E63B5F", textAlign: "center" }}>{vendorError ?? "Vendor not found."}</Text><TouchableOpacity onPress={() => navigation.goBack()}><Text style={{ marginTop: 16, fontWeight: "700", color: "#FF4D6D" }}>Go Back</Text></TouchableOpacity></View></SafeAreaView>;
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
        <ImageBackground source={{ uri: vendor.image }} style={styles.heroImage}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={22} color="#3F1D2F" />
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
                color={favorited ? "#FF4D6D" : "#3F1D2F"}
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

      {/* Gallery — real portfolio items uploaded by the vendor */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Gallery</Text>
        {portfolioLoading ? (
          <ActivityIndicator size="small" color="#FF4D6D" style={{ marginTop: 12 }} />
        ) : portfolioItems.length > 0 ? (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 8 }}>
            {portfolioItems.map((item, index) => (
              <TouchableOpacity
                key={item.id}
                activeOpacity={0.85}
                onPress={() => openViewer(index)}
              >
                <Image
                  source={{ uri: item.image }}
                  style={{ width: 140, height: 100, borderRadius: 12, marginRight: 10 }}
                />
              </TouchableOpacity>
            ))}
          </ScrollView>
        ) : (
          <Text style={styles.emptyText}>This vendor hasn't uploaded any portfolio yet.</Text>
        )}
      </View>

      {/* About — vendor's own description, no dummy amenities */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>About</Text>
        <Text style={styles.aboutText}>{aboutText}</Text>
      </View>

      {/* Services — real packages from vendor.packages */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Services</Text>
        {vendorPackages.length > 0 ? (
          vendorPackages.map((pkg) => (
            <View
              key={pkg.id}
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                paddingVertical: 10,
                borderBottomWidth: 1,
                borderBottomColor: "#FFCAD3",
              }}
            >
              <Text style={{ fontSize: 14, color: "#3F1D2F", fontWeight: "600" }}>{pkg.name}</Text>
              <Text style={{ fontSize: 14, color: "#FF4D6D", fontWeight: "700" }}>
                ₹{pkg.price.toLocaleString("en-IN")}
              </Text>
            </View>
          ))
        ) : (
          <Text style={styles.emptyText}>Services will appear here once added by the vendor.</Text>
        )}
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
                  <MaterialIcons name="edit" size={16} color="#8D6171" />
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
      </View>

      {/* Send Inquiry — quick contact CTA above Book Now */}
      <TouchableOpacity style={styles.sendInquiryButton} onPress={handleSendInquiry}>
        <MaterialIcons name="chat-bubble-outline" size={18} color="#FF4D6D" />
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

      {/* Full-screen portfolio image viewer */}
      <Modal
        visible={viewerVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setViewerVisible(false)}
      >
        <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.95)" }}>
          <SafeAreaView style={{ flex: 1 }}>
            <TouchableOpacity
              style={{ alignSelf: "flex-end", padding: 16 }}
              onPress={() => setViewerVisible(false)}
            >
              <MaterialIcons name="close" size={28} color="#fff" />
            </TouchableOpacity>

            <ScrollView
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              contentOffset={{ x: viewerIndex * SCREEN_WIDTH, y: 0 }}
              onMomentumScrollEnd={(e) => {
                const newIndex = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH);
                setViewerIndex(newIndex);
              }}
            >
              {portfolioItems.map((item) => (
                <View
                  key={item.id}
                  style={{
                    width: SCREEN_WIDTH,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Image
                    source={{ uri: item.image }}
                    style={{ width: SCREEN_WIDTH, height: SCREEN_HEIGHT * 0.65 }}
                    resizeMode="contain"
                  />
                </View>
              ))}
            </ScrollView>

            {activePortfolioItem && (
              <View style={{ padding: 20 }}>
                {activePortfolioItem.title ? (
                  <Text style={{ color: "#fff", fontSize: 16, fontWeight: "700" }}>
                    {activePortfolioItem.title}
                  </Text>
                ) : null}
                {activePortfolioItem.description ? (
                  <Text style={{ color: "#ddd", fontSize: 13, marginTop: 6 }}>
                    {activePortfolioItem.description}
                  </Text>
                ) : null}
              </View>
            )}
          </SafeAreaView>
        </View>
      </Modal>
    </SafeAreaView>
  );
}