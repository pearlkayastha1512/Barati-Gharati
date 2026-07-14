import React, { useState } from "react";
import { TouchableOpacity, Text, Modal, View, FlatList, Pressable } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { styles } from "./VendorList.styles";

export type SortOption = "Popularity" | "Highest Rated" | "Price: Low to High" | "Price: High to Low" | "Newest";

const SORT_OPTIONS: SortOption[] = [
  "Popularity",
  "Highest Rated",
  "Price: Low to High",
  "Price: High to Low",
  "Newest",
];

type Props = {
  selectedSort: SortOption;
  onSelect: (sort: SortOption) => void;
};

export function SortPicker({ selectedSort, onSelect }: Props) {
  const [visible, setVisible] = useState(false);

  return (
    <>
      <TouchableOpacity style={styles.sortPill} onPress={() => setVisible(true)}>
        <MaterialIcons name="swap-vert" size={16} color="#FF4D6D" />
        <Text style={styles.sortPillText}>{selectedSort}</Text>
        <MaterialIcons name="arrow-drop-down" size={18} color="#8D6171" />
      </TouchableOpacity>

      <Modal visible={visible} transparent animationType="fade" onRequestClose={() => setVisible(false)}>
        <Pressable style={styles.modalOverlay} onPress={() => setVisible(false)}>
          <View style={styles.modalSheet}>
            <Text style={styles.modalTitle}>Sort By</Text>
            <FlatList
              data={SORT_OPTIONS}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalItem}
                  onPress={() => {
                    onSelect(item);
                    setVisible(false);
                  }}
                >
                  <Text
                    style={[
                      styles.modalItemText,
                      item === selectedSort && styles.modalItemTextActive,
                    ]}
                  >
                    {item}
                  </Text>
                  {item === selectedSort && (
                    <MaterialIcons name="check" size={18} color="#FF4D6D" />
                  )}
                </TouchableOpacity>
              )}
            />
          </View>
        </Pressable>
      </Modal>
    </>
  );
}
