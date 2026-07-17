import React, { useCallback, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Image, Modal, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useReviewStore } from "../../store/reviewStore";
import { useBookingStore } from "../../store/bookingStore";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

export default function MyReviewsScreen() {
  const navigation = useNavigation<any>();

  const reviews = useReviewStore((state) => state.reviews);
  const loadMyReviews = useReviewStore((state) => state.loadMyReviews);

  const bookings = useBookingStore((state) => state.bookings);
  const loadBookings = useBookingStore((state) => state.loadBookings);

  const [viewerVisible, setViewerVisible] = useState(false);
  const [viewerPhotos, setViewerPhotos] = useState<string[]>([]);
  const [viewerIndex, setViewerIndex] = useState(0);

  useFocusEffect(
    useCallback(() => {
      void Promise.all([loadMyReviews(), loadBookings()]);
    }, [loadMyReviews, loadBookings]),
  );

  // Sort newest first
  const sortedReviews = [...reviews].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  const getVendorInfo = (bookingId: string) => {
    const booking = bookings.find((b) => b.id === bookingId);
    return {
      vendorName: booking?.vendorName ?? "Vendor",
      category: booking?.category ?? "",
    };
  };

  const openViewer = (photos: string[], index: number) => {
    setViewerPhotos(photos);
    setViewerIndex(index);
    setViewerVisible(true);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFF8F5" }} edges={["top"]}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 16,
          paddingVertical: 14,
        }}
      >
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginRight: 12 }}>
          <MaterialIcons name="arrow-back" size={24} color="#3F1D2F" />
        </TouchableOpacity>
        <Text style={{ fontSize: 18, fontWeight: "700", color: "#3F1D2F" }}>My Reviews</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 32 }}>
        {sortedReviews.length === 0 ? (
          <View style={{ alignItems: "center", marginTop: 80 }}>
            <MaterialIcons name="rate-review" size={48} color="#D9A5B0" />
            <Text style={{ marginTop: 12, color: "#8D6171", fontSize: 14 }}>
              You haven't written any reviews yet.
            </Text>
          </View>
        ) : (
          sortedReviews.map((review) => {
            const { vendorName, category } = getVendorInfo(review.bookingId);
            return (
              <View
                key={review.id}
                style={{
                  backgroundColor: "#fff",
                  borderRadius: 14,
                  padding: 16,
                  marginBottom: 12,
                  borderWidth: 1,
                  borderColor: "#FFE1E7",
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                  }}
                >
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 15, fontWeight: "700", color: "#3F1D2F" }}>
                      {vendorName}
                    </Text>
                    {category ? (
                      <Text style={{ fontSize: 12, color: "#8D6171", marginTop: 2 }}>
                        {category}
                      </Text>
                    ) : null}
                  </View>
                  <Text style={{ fontSize: 12, color: "#8D6171" }}>
                    {new Date(review.date).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </Text>
                </View>

                <View style={{ flexDirection: "row", marginTop: 8, marginBottom: 6 }}>
                  {[1, 2, 3, 4, 5].map((i) => (
                    <MaterialIcons
                      key={i}
                      name={i <= review.rating ? "star" : "star-border"}
                      size={16}
                      color="#F5A623"
                    />
                  ))}
                </View>

                {review.text ? (
                  <Text style={{ fontSize: 13, color: "#3F1D2F", lineHeight: 19 }}>
                    {review.text}
                  </Text>
                ) : null}

                {review.proofImages.length > 0 && (
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={{ marginTop: 10 }}
                  >
                    {review.proofImages.map((uri, index) => (
                      <TouchableOpacity
                        key={`${review.id}-${index}`}
                        activeOpacity={0.85}
                        onPress={() => openViewer(review.proofImages, index)}
                      >
                        <Image
                          source={{ uri }}
                          style={{
                            width: 72,
                            height: 72,
                            borderRadius: 10,
                            marginRight: 8,
                          }}
                        />
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                )}

                {review.reply ? (
                  <View
                    style={{
                      marginTop: 10,
                      paddingTop: 10,
                      borderTopWidth: 1,
                      borderTopColor: "#FFE1E7",
                    }}
                  >
                    <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 4 }}>
                      <MaterialIcons name="storefront" size={14} color="#FF4D6D" />
                      <Text style={{ fontSize: 12, fontWeight: "700", color: "#FF4D6D", marginLeft: 4 }}>
                        Vendor's Reply
                      </Text>
                      {review.repliedAt ? (
                        <Text style={{ fontSize: 11, color: "#8D6171", marginLeft: "auto" }}>
                          {new Date(review.repliedAt).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </Text>
                      ) : null}
                    </View>
                    <Text style={{ fontSize: 13, color: "#3F1D2F", lineHeight: 19 }}>
                      {review.reply}
                    </Text>
                  </View>
                ) : null}
              </View>
            );
          })
        )}
      </ScrollView>

      {/* Full-screen photo viewer */}
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
              {viewerPhotos.map((uri, index) => (
                <View
                  key={`${uri}-${index}`}
                  style={{
                    width: SCREEN_WIDTH,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Image
                    source={{ uri }}
                    style={{ width: SCREEN_WIDTH, height: SCREEN_HEIGHT * 0.65 }}
                    resizeMode="contain"
                  />
                </View>
              ))}
            </ScrollView>

            {viewerPhotos.length > 1 && (
              <View style={{ alignItems: "center", padding: 16 }}>
                <Text style={{ color: "#fff", fontSize: 13 }}>
                  {viewerIndex + 1} / {viewerPhotos.length}
                </Text>
              </View>
            )}
          </SafeAreaView>
        </View>
      </Modal>
    </SafeAreaView>
  );
}