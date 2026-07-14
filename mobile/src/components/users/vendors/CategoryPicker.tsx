import React, { useState } from "react";
import { TouchableOpacity, Text, Modal, View, FlatList, Pressable } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { CATEGORIES } from "../../../constants/vendorData";
import { styles } from "./VendorList.styles";

type Props = {
  activeCategory: string | null;
  onSelect: (category: string | null) => void;
};

export function CategoryPicker({ activeCategory, onSelect }: Props) {
  const [visible, setVisible] = useState(false);
  const displayLabel = activeCategory ?? "All Categories";

  return (
    <>
      <TouchableOpacity style={styles.cityPill} onPress={() => setVisible(true)}>
        <MaterialIcons name="category" size={16} color="#FF4D6D" />
        <Text style={styles.cityPillText}>{displayLabel}</Text>
        <MaterialIcons name="arrow-drop-down" size={20} color="#8D6171" />
      </TouchableOpacity>

      <Modal visible={visible} transparent animationType="fade" onRequestClose={() => setVisible(false)}>
        <Pressable style={styles.modalOverlay} onPress={() => setVisible(false)}>
          <View style={styles.modalSheet}>
            <Text style={styles.modalTitle}>Select Category</Text>
            <FlatList
              data={["All Categories", ...CATEGORIES]}
              keyExtractor={(item) => item}
              renderItem={({ item }) => {
                const isActive = item === "All Categories" ? activeCategory === null : item === activeCategory;
                return (
                  <TouchableOpacity
                    style={styles.modalItem}
                    onPress={() => {
                      onSelect(item === "All Categories" ? null : item);
                      setVisible(false);
                    }}
                  >
                    <Text style={[styles.modalItemText, isActive && styles.modalItemTextActive]}>
                      {item}
                    </Text>
                    {isActive && <MaterialIcons name="check" size={18} color="#FF4D6D" />}
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        </Pressable>
      </Modal>
    </>
  );
}