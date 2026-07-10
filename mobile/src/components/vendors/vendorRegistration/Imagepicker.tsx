import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { styles } from "../../../screens/vendor/VendorRegistration/styles";
type Props = { label: string; imageUri: string | null; onPress: () => void };

export function ImagePickerBox({ label, imageUri, onPress }: Props) {
  return (
    <View style={styles.imagePickerWrapper}>
      <Text style={styles.imagePickerLabel}>{label}</Text>
      <TouchableOpacity style={styles.imagePickerBox} onPress={onPress}>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.imagePickerPreview} />
        ) : (
          <>
            <MaterialIcons name="add-photo-alternate" size={30} color="#999" />
            <Text style={styles.imagePickerText}>Select {label}</Text>
          </>
        )}
      </TouchableOpacity>
    </View>
  );
}