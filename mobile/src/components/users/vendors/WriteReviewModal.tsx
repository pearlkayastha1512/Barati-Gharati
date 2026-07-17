import React, { useState, useEffect } from "react";
import { Modal, View, Text, TextInput, TouchableOpacity, Image, ScrollView, Alert } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { styles } from "./WriteReviewModal.styles";

type Props = {
  visible: boolean;
  onClose: () => void;
  onSubmit: (rating: number, reviewText: string, photos: string[]) => void | Promise<void>;
  initialRating?: number;
  initialText?: string;
  initialPhotos?: string[];
  isEditing?: boolean;
};

const MAX_PHOTOS = 5;
const DEFAULT_PHOTOS: string[] = []; // 👈 ADD KIYA — stable reference

export function WriteReviewModal({
  visible,
  onClose,
  onSubmit,
  initialRating = 0,
  initialText = "",
  initialPhotos = DEFAULT_PHOTOS, // 👈 [] ki jagah ye
  isEditing = false,
}: Props) {
  const [rating, setRating] = useState(initialRating);
  const [reviewText, setReviewText] = useState(initialText);
  const [photos, setPhotos] = useState<string[]>(initialPhotos);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (visible) {
      setRating(initialRating);
      setReviewText(initialText);
      setPhotos(initialPhotos);
      setIsSubmitting(false);
    }
  }, [visible, initialRating, initialText, initialPhotos]);

  const handleAddPhoto = async () => {
    if (photos.length >= MAX_PHOTOS) {
      Alert.alert("Limit Reached", `You can attach up to ${MAX_PHOTOS} photos.`);
      return;
    }

    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission Needed", "Please allow photo library access to attach photos.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
      allowsMultipleSelection: true,
      selectionLimit: MAX_PHOTOS - photos.length,
    });

    if (!result.canceled) {
      const newUris = result.assets.map((asset) => asset.uri);
      setPhotos((prev) => [...prev, ...newUris].slice(0, MAX_PHOTOS));
    }
  };

  const handleRemovePhoto = (uri: string) => {
    setPhotos((prev) => prev.filter((p) => p !== uri));
  };

  const handleSubmit = async () => {
    if (rating === 0 || isSubmitting) return;
    setIsSubmitting(true);
    try {
      await onSubmit(rating, reviewText.trim(), photos);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.card}>
          <View style={styles.header}>
            <Text style={styles.title}>{isEditing ? "Edit Review" : "Write Review"}</Text>
            <TouchableOpacity onPress={onClose}>
              <MaterialIcons name="close" size={22} color="#3F1D2F" />
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>Rating</Text>
          <View style={styles.starsRow}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity key={star} onPress={() => setRating(star)}>
                <MaterialIcons
                  name={star <= rating ? "star" : "star-border"}
                  size={34}
                  color="#F5A623"
                  style={{ marginRight: 6 }}
                />
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>Review</Text>
          <TextInput
            style={styles.textArea}
            placeholder="Share your experience..."
            placeholderTextColor="#8D6171"
            value={reviewText}
            onChangeText={setReviewText}
            multiline
            numberOfLines={5}
          />

          <Text style={styles.label}>Photos ({photos.length}/{MAX_PHOTOS})</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.photoRow}>
            {photos.map((uri) => (
              <View key={uri} style={styles.photoThumbWrapper}>
                <Image source={{ uri }} style={styles.photoThumb} />
                <TouchableOpacity style={styles.photoRemoveBadge} onPress={() => handleRemovePhoto(uri)}>
                  <MaterialIcons name="close" size={14} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            ))}

            {photos.length < MAX_PHOTOS && (
              <TouchableOpacity style={styles.addPhotoButton} onPress={handleAddPhoto}>
                <MaterialIcons name="add-a-photo" size={22} color="#FF4D6D" />
                <Text style={styles.addPhotoText}>Add</Text>
              </TouchableOpacity>
            )}
          </ScrollView>

          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose} disabled={isSubmitting}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.submitButton, (rating === 0 || isSubmitting) && styles.submitButtonDisabled]}
              onPress={handleSubmit}
              disabled={rating === 0 || isSubmitting}
            >
              <Text style={styles.submitButtonText}>
                {isSubmitting ? "Saving..." : isEditing ? "Update Review" : "Submit Review"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}