import React from "react";
import { ScrollView, TouchableOpacity, Text } from "react-native";
import { CATEGORIES } from "../../constants/vendorData";
import { styles } from "./VendorList.styles";

type Props = {
  activeCategory: string | null;
  onSelect: (category: string | null) => void;
};

export function CategoryChips({ activeCategory, onSelect }: Props) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.chipsRow}
      contentContainerStyle={{ paddingHorizontal: 20, alignItems: "center" }}
    >
      {CATEGORIES.map((cat) => {
        const isActive = cat === activeCategory;
        return (
          <TouchableOpacity
            key={cat}
            style={[styles.chip, isActive && styles.chipActive]}
            onPress={() => onSelect(isActive ? null : cat)}
          >
            <Text style={[styles.chipText, isActive && styles.chipTextActive]}>{cat}</Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}