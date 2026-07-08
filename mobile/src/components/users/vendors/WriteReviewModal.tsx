import React, { useState, useEffect } from "react";
import { Modal, View, Text, TextInput, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { styles } from "./WriteReviewModal.styles";

type Props = {
  visible: boolean;
  onClose: () => void;
  onSubmit: (rating: number, reviewText: string) => void;
  initialRating?: number;
  initialText?: string;
  isEditing?: boolean;
};

export function WriteReviewModal({ visible, onClose, onSubmit, initialRating = 0, initialText = "", isEditing = false }: Props) {
  const [rating, setRating] = useState(initialRating);
  const [reviewText, setReviewText] = useState(initialText);

  useEffect(() => {
    if (visible) {
      setRating(initialRating);
      setReviewText(initialText);
    }
  }, [visible, initialRating, initialText]);

  const handleSubmit = () => {
    if (rating === 0) return;
    onSubmit(rating, reviewText.trim());
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.card}>
          <View style={styles.header}>
            <Text style={styles.title}>{isEditing ? "Edit Review" : "Write Review"}</Text>
            <TouchableOpacity onPress={onClose}>
              <MaterialIcons name="close" size={22} color="#666" />
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
            placeholderTextColor="#999"
            value={reviewText}
            onChangeText={setReviewText}
            multiline
            numberOfLines={5}
          />

          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.submitButton, rating === 0 && styles.submitButtonDisabled]}
              onPress={handleSubmit}
              disabled={rating === 0}
            >
              <Text style={styles.submitButtonText}>{isEditing ? "Update Review" : "Submit Review"}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}