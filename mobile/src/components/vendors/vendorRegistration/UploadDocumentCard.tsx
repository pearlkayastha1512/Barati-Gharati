import React from "react";
import { TouchableOpacity, View, Text } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { styles } from "../../../screens/vendor/VendorRegistration/styles";

type Props = { title: string; subtitle: string; onPress: () => void };

export function UploadDocumentCard({ title, subtitle, onPress }: Props) {
  return (
    <TouchableOpacity style={styles.documentCard} onPress={onPress}>
      <MaterialCommunityIcons name="file-document-outline" size={28} color="#3B5BFF" />
      <View style={styles.documentInfo}>
        <Text style={styles.documentTitle}>{title}</Text>
        <Text style={styles.documentSubtitle}>{subtitle}</Text>
      </View>
      <MaterialCommunityIcons name="upload" size={24} color="#999" />
    </TouchableOpacity>
  );
}