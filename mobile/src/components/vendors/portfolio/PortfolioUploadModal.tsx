import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { COLORS } from "../../../constants/theme";
import {
  PortfolioCategory,
  PORTFOLIO_CATEGORIES,
  PortfolioItemRecord,
} from "../../../types/vendorPortfolio";
import { styles } from "./PortfolioUploadModal.styles";

type Props = {
  visible: boolean;
  editItem?: PortfolioItemRecord | null;
  onClose: () => void;
  onSubmit: (
    data:
      | FormData
      | {
          title: string;
          category: PortfolioCategory;
          description: string;
        }
  ) => Promise<void>;
};

export function PortfolioUploadModal({ visible, editItem, onClose, onSubmit }: Props) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<PortfolioCategory | null>(null);
  const [description, setDescription] = useState("");
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [categoryPickerOpen, setCategoryPickerOpen] = useState(false);

  // ==========================================================
  // Reset / hydrate form state whenever the modal opens
  // ==========================================================
  useEffect(() => {
    if (!visible) return;

    if (editItem) {
      setTitle(editItem.title);
      setCategory(editItem.category);
      setDescription(editItem.description);
      setImageUri(editItem.image);
    } else {
      setTitle("");
      setCategory(null);
      setDescription("");
      setImageUri(null);
      setCategoryPickerOpen(false);
    }

    setCategoryPickerOpen(false);
  }, [visible, editItem]);

  // ==========================================================
  // Image picker
  // ==========================================================
  const handlePickImage = async () => {
    if (editItem) {
      Alert.alert(
        "Image cannot be changed",
        "Current backend only supports editing title, category and description."
      );
      return;
    }

    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert("Permission Required", "Please allow photo library access.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
    });

    if (!result.canceled && result.assets.length > 0) {
      setImageUri(result.assets[0].uri);
    }
  };

  // ==========================================================
  // Submit (create vs. edit)
  // ==========================================================
  const handleSubmit = async () => {
    if (!title.trim()) {
      Alert.alert("Missing Title", "Please enter a title.");
      return;
    }

    if (!category) {
      Alert.alert("Missing Category", "Please select a category.");
      return;
    }

    try {
      // EDIT MODE
      if (editItem) {
        await onSubmit({
          title: title.trim(),
          category,
          description: description.trim(),
        });

        onClose();
        return;
      }

      // CREATE MODE
      if (!imageUri) {
        Alert.alert("Image Required", "Please choose an image.");
        return;
      }

      const formData = new FormData();
      formData.append("title", title.trim());
      formData.append("category", category);
      formData.append("description", description.trim());
      formData.append("image", {
        uri: imageUri,
        name: "portfolio.jpg",
        type: "image/jpeg",
      } as any);

      await onSubmit(formData);
      onClose();
    } catch (err) {
      console.log(err);
      Alert.alert("Error", editItem ? "Failed to update portfolio." : "Failed to upload portfolio.");
    }
  };

  // ==========================================================
  // Render
  // ==========================================================
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>{editItem ? "Edit Portfolio" : "Upload Portfolio"}</Text>

            <TouchableOpacity onPress={onClose}>
              <MaterialCommunityIcons name="close" size={22} color={COLORS.textMuted} />
            </TouchableOpacity>
          </View>

          {/* Form */}
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={styles.label}>Title</Text>
            <TextInput
              style={styles.input}
              placeholder="Wedding Shoot"
              placeholderTextColor={COLORS.textLight}
              value={title}
              onChangeText={setTitle}
            />

            <Text style={styles.label}>Category</Text>
            <TouchableOpacity
              style={styles.dropdownField}
              onPress={() => setCategoryPickerOpen(!categoryPickerOpen)}
            >
              <Text style={[styles.dropdownText, !category && styles.dropdownPlaceholder]}>
                {category ?? "Select Category"}
              </Text>
              <MaterialCommunityIcons
                name={categoryPickerOpen ? "chevron-up" : "chevron-down"}
                size={18}
                color={COLORS.textMuted}
              />
            </TouchableOpacity>

            {categoryPickerOpen && (
              <View style={styles.dropdownList}>
                {PORTFOLIO_CATEGORIES.map((item) => (
                  <TouchableOpacity
                    key={item}
                    style={styles.dropdownOption}
                    onPress={() => {
                      setCategory(item);
                      setCategoryPickerOpen(false);
                    }}
                  >
                    <Text style={styles.dropdownOptionText}>{item}</Text>
                    {category === item && (
                      <MaterialCommunityIcons name="check" size={18} color={COLORS.primary} />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            )}

            <Text style={styles.label}>Description</Text>
            <TextInput
              style={styles.textArea}
              placeholder="Describe your work..."
              placeholderTextColor={COLORS.textLight}
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={4}
            />

            <Text style={styles.label}>Portfolio Image</Text>
            <TouchableOpacity
              style={styles.imageBox}
              onPress={handlePickImage}
              activeOpacity={editItem ? 1 : 0.8}
            >
              {imageUri ? (
                <Image source={{ uri: imageUri }} style={styles.imagePreview} />
              ) : (
                <>
                  <MaterialCommunityIcons name="image-outline" size={30} color={COLORS.textLight} />
                  <Text style={styles.imagePlaceholderText}>No image selected</Text>
                  {!editItem && <Text style={styles.chooseFileText}>Choose Image</Text>}
                </>
              )}
            </TouchableOpacity>
          </ScrollView>

          {/* Footer actions */}
          <View style={styles.footer}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
              <Text style={styles.submitBtnText}>{editItem ? "Save Changes" : "Upload Portfolio"}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
