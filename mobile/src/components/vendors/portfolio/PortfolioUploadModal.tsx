import React, { useState, useEffect } from "react";
import {
  Modal, View, Text, TextInput, TouchableOpacity, Image, ScrollView, Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { COLORS } from "../../../constants/theme";
import { PortfolioCategory, PORTFOLIO_CATEGORIES } from "../../../types/vendorPortfolio";
import { styles } from "./PortfolioUploadModal.styles";

type Props = {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: {
    title: string;
    category: PortfolioCategory;
    description: string;
    imageUri: string | null;
  }) => void;
};

export function PortfolioUploadModal({ visible, onClose, onSubmit }: Props) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<PortfolioCategory | null>(null);
  const [description, setDescription] = useState("");
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [categoryPickerOpen, setCategoryPickerOpen] = useState(false);

  useEffect(() => {
    if (visible) {
      setTitle("");
      setCategory(null);
      setDescription("");
      setImageUri(null);
      setCategoryPickerOpen(false);
    }
  }, [visible]);

  const handlePickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permission needed", "Please allow photo library access to select an image.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
      allowsEditing: true,
    });
    if (!result.canceled && result.assets?.[0]?.uri) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleSubmit = () => {
    if (!title.trim() || !category) {
      Alert.alert("Missing details", "Please add a title and select a category.");
      return;
    }
    onSubmit({ title: title.trim(), category, description: description.trim(), imageUri });
    onClose();
    // TODO: once connected, the parent's onSubmit (PortfolioScreen) will need to turn
    // `imageUri` (a local file:// uri from ImagePicker) into a { uri, name, type } object
    // before passing it to createPortfolioItem(dto, file) — see portfolio.api.ts.
    // This modal itself needs no changes — title/category/description/imageUri
    // already match what CreatePortfolioDto needs.
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Upload Portfolio</Text>
            <TouchableOpacity onPress={onClose}>
              <MaterialCommunityIcons name="close" size={22} color={COLORS.textMuted} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={styles.label}>Title</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Rina & Karan's Wedding"
              placeholderTextColor={COLORS.textLight}
              value={title}
              onChangeText={setTitle}
            />

            <Text style={styles.label}>Category</Text>
            <TouchableOpacity
              style={styles.dropdownField}
              onPress={() => setCategoryPickerOpen((v) => !v)}
            >
              <Text style={[styles.dropdownText, !category && styles.dropdownPlaceholder]}>
                {category || "Select Category"}
              </Text>
              <MaterialCommunityIcons
                name={categoryPickerOpen ? "chevron-up" : "chevron-down"}
                size={18}
                color={COLORS.textMuted}
              />
            </TouchableOpacity>
            {categoryPickerOpen && (
              <View style={styles.dropdownList}>
                {PORTFOLIO_CATEGORIES.map((c) => (
                  <TouchableOpacity
                    key={c}
                    style={styles.dropdownOption}
                    onPress={() => {
                      setCategory(c);
                      setCategoryPickerOpen(false);
                    }}
                  >
                    <Text style={styles.dropdownOptionText}>{c}</Text>
                    {c === category && (
                      <MaterialCommunityIcons name="check" size={16} color={COLORS.primary} />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            )}

            <Text style={styles.label}>Description</Text>
            <TextInput
              style={styles.textArea}
              placeholder="Describe this work..."
              placeholderTextColor={COLORS.textLight}
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={4}
            />

            <Text style={styles.label}>Portfolio Image</Text>
            <TouchableOpacity style={styles.imageBox} onPress={handlePickImage}>
              {imageUri ? (
                <Image source={{ uri: imageUri }} style={styles.imagePreview} />
              ) : (
                <>
                  <MaterialCommunityIcons name="image-outline" size={28} color={COLORS.textLight} />
                  <Text style={styles.imagePlaceholderText}>No image selected</Text>
                  <Text style={styles.chooseFileText}>Choose file</Text>
                </>
              )}
            </TouchableOpacity>
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
              <Text style={styles.submitBtnText}>Upload Portfolio</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}