import React, { useState } from "react";
import { View, Text, TouchableOpacity, Modal, FlatList } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { VENDOR_CATEGORIES } from "../../../types/vendor";
import { styles } from "../../../screens/vendor/VendorRegistration/styles";

type Props = { value: string; onSelect: (value: string) => void };

export function CategoryDropdown({ value, onSelect }: Props) {
  const [visible, setVisible] = useState(false);

  return (
    <>
      <TouchableOpacity style={styles.dropdownField} onPress={() => setVisible(true)}>
        <MaterialIcons name="category" size={18} color="#999" style={{ marginRight: 8 }} />
        <Text style={[styles.dropdownText, !value && styles.dropdownPlaceholder]}>
          {value || "Select Category"}
        </Text>
        <MaterialIcons name="arrow-drop-down" size={20} color="#999" />
      </TouchableOpacity>

      <Modal visible={visible} transparent animationType="fade" onRequestClose={() => setVisible(false)}>
        <TouchableOpacity style={styles.dropdownOverlay} activeOpacity={1} onPress={() => setVisible(false)}>
          <View style={styles.dropdownModal}>
            <FlatList
  data={VENDOR_CATEGORIES}
  keyExtractor={(item) => item}
  style={{ width: "100%" }}
  renderItem={({ item }) => (
    <TouchableOpacity
      style={styles.dropdownOption}
      onPress={() => {
        onSelect(item);
        setVisible(false);
      }}
    >
      <Text style={styles.dropdownOptionText}>{item}</Text>
      {item === value && <MaterialIcons name="check" size={18} color="#3B5BFF" />}
    </TouchableOpacity>
  )}
/>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
}