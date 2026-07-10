import React, { useState } from "react";
import { View, Text, TouchableOpacity, Modal, FlatList } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { COLORS, RADIUS, SPACING } from "../../../constants/theme";

export type StatusFilter =
  | "All Status"
  | "Pending"
  | "Accepted"
  | "Completed"
  | "Cancelled"
  | "Rejected";

const OPTIONS: StatusFilter[] = [
  "All Status",
  "Pending",
  "Accepted",
  "Completed",
  "Cancelled",
  "Rejected",
];

type Props = { value: StatusFilter; onSelect: (value: StatusFilter) => void };

export function StatusFilterDropdown({ value, onSelect }: Props) {
  const [visible, setVisible] = useState(false);

  return (
    <>
      <TouchableOpacity style={styles.field} onPress={() => setVisible(true)}>
        <MaterialCommunityIcons name="filter-variant" size={16} color="#fff" />
        <Text style={styles.fieldText}>{value}</Text>
        <MaterialCommunityIcons name="chevron-down" size={16} color="#fff" />
      </TouchableOpacity>

      <Modal visible={visible} transparent animationType="fade" onRequestClose={() => setVisible(false)}>
        <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={() => setVisible(false)}>
          <View style={styles.modal}>
            <FlatList
              data={OPTIONS}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.option}
                  onPress={() => {
                    onSelect(item);
                    setVisible(false);
                  }}
                >
                  <Text style={styles.optionText}>{item}</Text>
                  {item === value && <MaterialCommunityIcons name="check" size={18} color={COLORS.primary} />}
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
}

import { StyleSheet } from "react-native";
const styles = StyleSheet.create({
  field: {
    flexDirection: "row", alignItems: "center", backgroundColor: COLORS.primaryDark,
    borderRadius: RADIUS.md, paddingHorizontal: 12, paddingVertical: 9, gap: 6,
  },
  fieldText: { fontSize: 12, fontWeight: "700", color: "#fff" },
  overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.4)", justifyContent: "center", padding: 30 },
  modal: { backgroundColor: "#fff", borderRadius: RADIUS.lg, paddingVertical: 8 },
  option: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    paddingHorizontal: SPACING.lg, paddingVertical: 14,
  },
  optionText: { fontSize: 14, color: COLORS.text },
});