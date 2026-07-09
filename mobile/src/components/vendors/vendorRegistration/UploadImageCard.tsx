import React from "react";
import { View, Text, Image } from "react-native";
import { styles } from "../../../screens/vendor/VendorRegistration/styles";

export function UploadImageCard({ label, imageUri }: { label: string; imageUri: string | null }) {
  return (
    <View style={styles.imagePickerWrapper}>
      <Text style={styles.imagePickerLabel}>{label}</Text>
      <View style={styles.reviewImageBox}>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.imagePickerPreview} />
        ) : (
          <Text style={styles.emptyReviewImageText}>No image selected</Text>
        )}
      </View>
    </View>
  );
}