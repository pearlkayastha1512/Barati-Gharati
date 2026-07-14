import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { COLORS, RADIUS, SPACING } from "../../../constants/theme";
import { VendorServiceRecord } from "../../../store/vendorServicesStore";

export function ServiceCard({
  service,
  onEdit,
  onDelete,
}: {
  service: VendorServiceRecord;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <View style={styles.card}>
      {service.image ? (
        <Image source={{ uri: service.image }} style={styles.image} />
      ) : (
        <View style={[styles.image, styles.imagePlaceholder]}>
          <MaterialCommunityIcons name="image-outline" size={28} color={COLORS.textLight} />
        </View>
      )}

      <View style={styles.content}>
        <View style={styles.titleRow}>
  <Text style={styles.title} numberOfLines={1}>{service.serviceName}</Text>
  {service.reviewsCount > 0 ? (
    <View style={styles.ratingRow}>
      <MaterialCommunityIcons name="star" size={13} color="#F5A623" />
      <Text style={styles.ratingText}>{service.rating.toFixed(1)}</Text>
    </View>
  ) : (
    <View style={styles.ratingRow}>
      <MaterialCommunityIcons name="star-outline" size={13} color={COLORS.textLight} />
      <Text style={[styles.ratingText, { color: COLORS.textLight }]}>New</Text>
    </View>
  )}
</View>

        <Text style={styles.category}>{service.category}</Text>

        <View style={styles.metaRow}>
          <MaterialCommunityIcons name="clock-outline" size={12} color={COLORS.textMuted} />
          <Text style={styles.metaText}>{service.duration}</Text>
        </View>

        <Text style={styles.price}>₹{service.price.toLocaleString("en-IN")}</Text>

        <View style={styles.actionsRow}>
          <TouchableOpacity style={styles.editBtn} onPress={onEdit}>
            <MaterialCommunityIcons name="pencil-outline" size={14} color="#fff" />
            <Text style={styles.editBtnText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.deleteBtn} onPress={onDelete}>
            <MaterialCommunityIcons name="trash-can-outline" size={16} color={COLORS.danger} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    marginBottom: SPACING.md,
    overflow: "hidden",
    elevation: 1,
  },
  image: { width: "100%", height: 160 },
  imagePlaceholder: { alignItems: "center", justifyContent: "center", backgroundColor: COLORS.background },
  content: { padding: SPACING.md },
  titleRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  title: { fontSize: 15, fontWeight: "700", color: COLORS.text, flex: 1, marginRight: 8 },
  ratingRow: { flexDirection: "row", alignItems: "center", gap: 2 },
  ratingText: { fontSize: 12, fontWeight: "700", color: COLORS.text },
  category: { fontSize: 12, color: COLORS.textMuted, marginTop: 2 },
  metaRow: { flexDirection: "row", alignItems: "center", marginTop: 6, gap: 4 },
  metaText: { fontSize: 11, color: COLORS.textLight },
  price: { fontSize: 16, fontWeight: "800", color: COLORS.text, marginTop: 8 },
  actionsRow: { flexDirection: "row", gap: 8, marginTop: SPACING.md },
  editBtn: {
    flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center",
    backgroundColor: COLORS.primary, borderRadius: RADIUS.md, paddingVertical: 10, gap: 6,
  },
  editBtnText: { color: "#fff", fontSize: 13, fontWeight: "700" },
  deleteBtn: {
    width: 42, alignItems: "center", justifyContent: "center",
    backgroundColor: "#FDECEC", borderRadius: RADIUS.md,
  },
});