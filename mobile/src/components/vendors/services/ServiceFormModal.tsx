import React, { useEffect, useState } from "react";
import {
  Modal, View, Text, TextInput, TouchableOpacity, ScrollView, Image, StyleSheet, Platform,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { COLORS, RADIUS, SPACING } from "../../../constants/theme";
import {
  VendorServiceRecord, ServiceCategory, SERVICE_CATEGORIES,
} from "../../../store/vendorServicesStore";

interface ServiceFormModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: {
    serviceName: string;
    category: ServiceCategory;
    description: string;
    duration: string;
    price: number;
    image: string | null;
  }) => void;
  initialService?: VendorServiceRecord | null;
}

export function ServiceFormModal({ visible, onClose, onSubmit, initialService }: ServiceFormModalProps) {
  const isEditing = !!initialService;

  const [serviceName, setServiceName] = useState("");
  const [category, setCategory] = useState<ServiceCategory>("Photographer");
  const [categoryPickerOpen, setCategoryPickerOpen] = useState(false);
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState<string | null>(null);

  useEffect(() => {
    if (visible) {
      setServiceName(initialService?.serviceName ?? "");
      setCategory(initialService?.category ?? "Photographer");
      setDescription(initialService?.description ?? "");
      setDuration(initialService?.duration ?? "");
      setPrice(initialService ? String(initialService.price) : "");
      setImage(initialService?.image ?? null);
      setCategoryPickerOpen(false);
    }
  }, [visible, initialService]);

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
      allowsEditing: true,
      aspect: [16, 9],
    });

    if (!result.canceled && result.assets?.[0]?.uri) {
      setImage(result.assets[0].uri);
    }
  };

  const handleSave = () => {
    if (!serviceName.trim() || !price.trim()) return;
    onSubmit({
      serviceName: serviceName.trim(),
      category,
      description: description.trim(),
      duration: duration.trim(),
      price: Number(price) || 0,
      image,
    });
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <View style={styles.headerRow}>
            <Text style={styles.headerTitle}>{isEditing ? "Edit Service" : "Create Service"}</Text>
            <TouchableOpacity onPress={onClose} hitSlop={10}>
              <MaterialCommunityIcons name="close" size={22} color={COLORS.textMuted} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.body}>
            <Text style={styles.label}>Service Name</Text>
            <TextInput
              style={styles.input}
              value={serviceName}
              onChangeText={setServiceName}
              placeholder="e.g. Premium Wedding Photography"
              placeholderTextColor={COLORS.textLight}
            />

            <Text style={styles.label}>Category</Text>
            <TouchableOpacity
              style={styles.input}
              onPress={() => setCategoryPickerOpen((v) => !v)}
              activeOpacity={0.7}
            >
              <View style={styles.dropdownRow}>
                <Text style={styles.dropdownText}>{category}</Text>
                <MaterialCommunityIcons
                  name={categoryPickerOpen ? "chevron-up" : "chevron-down"}
                  size={18}
                  color={COLORS.textMuted}
                />
              </View>
            </TouchableOpacity>

            {categoryPickerOpen && (
              <View style={styles.dropdownList}>
                {SERVICE_CATEGORIES.map((cat) => (
                  <TouchableOpacity
                    key={cat}
                    style={styles.dropdownItem}
                    onPress={() => {
                      setCategory(cat);
                      setCategoryPickerOpen(false);
                    }}
                  >
                    <Text
                      style={[
                        styles.dropdownItemText,
                        cat === category && { color: COLORS.primary, fontWeight: "700" },
                      ]}
                    >
                      {cat}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={description}
              onChangeText={setDescription}
              placeholder="Describe what this service includes..."
              placeholderTextColor={COLORS.textLight}
              multiline
              numberOfLines={4}
            />

            <View style={styles.rowFields}>
              <View style={{ flex: 1 }}>
                <Text style={styles.label}>Duration</Text>
                <TextInput
                  style={styles.input}
                  value={duration}
                  onChangeText={setDuration}
                  placeholder="Full Day"
                  placeholderTextColor={COLORS.textLight}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.label}>Price</Text>
                <TextInput
                  style={styles.input}
                  value={price}
                  onChangeText={setPrice}
                  placeholder="50000"
                  placeholderTextColor={COLORS.textLight}
                  keyboardType="numeric"
                />
              </View>
            </View>

            <Text style={styles.label}>Service Image</Text>
            <TouchableOpacity style={styles.imageBox} onPress={pickImage} activeOpacity={0.8}>
              {image ? (
                <Image source={{ uri: image }} style={styles.imagePreview} />
              ) : (
                <View style={styles.imagePlaceholder}>
                  <MaterialCommunityIcons name="image-plus" size={26} color={COLORS.textLight} />
                  <Text style={styles.imagePlaceholderText}>Tap to upload image</Text>
                </View>
              )}
            </TouchableOpacity>
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
              <Text style={styles.saveBtnText}>{isEditing ? "Save Changes" : "Create Service"}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.4)", justifyContent: "flex-end" },
  sheet: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: RADIUS.xl,
    borderTopRightRadius: RADIUS.xl,
    maxHeight: "90%",
    paddingTop: SPACING.lg,
  },
  headerRow: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    paddingHorizontal: SPACING.lg, paddingBottom: SPACING.md,
    borderBottomWidth: 1, borderBottomColor: COLORS.background,
  },
  headerTitle: { fontSize: 18, fontWeight: "800", color: COLORS.text },
  body: { paddingHorizontal: SPACING.lg, paddingVertical: SPACING.md },
  label: { fontSize: 12, fontWeight: "700", color: COLORS.textMuted, marginBottom: 6, marginTop: SPACING.md },
  input: {
    borderWidth: 1, borderColor: COLORS.background, backgroundColor: COLORS.background,
    borderRadius: RADIUS.md, paddingHorizontal: 12, paddingVertical: Platform.OS === "ios" ? 12 : 8,
    fontSize: 14, color: COLORS.text,
  },
  textArea: { minHeight: 90, textAlignVertical: "top" },
  rowFields: { flexDirection: "row", gap: SPACING.md },
  dropdownRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  dropdownText: { fontSize: 14, color: COLORS.text },
  dropdownList: {
    backgroundColor: COLORS.background, borderRadius: RADIUS.md, marginTop: 4, overflow: "hidden",
  },
  dropdownItem: { paddingHorizontal: 14, paddingVertical: 10 },
  dropdownItemText: { fontSize: 13, color: COLORS.text },
  imageBox: {
    borderWidth: 1, borderColor: COLORS.background, borderStyle: "dashed",
    borderRadius: RADIUS.md, height: 150, overflow: "hidden",
  },
  imagePreview: { width: "100%", height: "100%" },
  imagePlaceholder: { flex: 1, alignItems: "center", justifyContent: "center", gap: 6 },
  imagePlaceholderText: { fontSize: 12, color: COLORS.textLight },
  footer: {
    flexDirection: "row", gap: SPACING.sm, padding: SPACING.lg,
    borderTopWidth: 1, borderTopColor: COLORS.background,
  },
  cancelBtn: {
    flex: 1, alignItems: "center", justifyContent: "center",
    paddingVertical: 12, borderRadius: RADIUS.md, borderWidth: 1, borderColor: COLORS.background,
  },
  cancelBtnText: { fontSize: 14, fontWeight: "700", color: COLORS.textMuted },
  saveBtn: {
    flex: 1.4, alignItems: "center", justifyContent: "center",
    paddingVertical: 12, borderRadius: RADIUS.md, backgroundColor: COLORS.primary,
  },
  saveBtnText: { fontSize: 14, fontWeight: "700", color: "#fff" },
});