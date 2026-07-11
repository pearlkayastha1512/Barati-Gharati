import React, { useState } from "react";
import { Modal, View, Text, TextInput, TouchableOpacity, Pressable, FlatList } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { CAL_COLORS } from "../../../constants/calendarTheme";
import { useVendorCalendarStore } from "../../../store/vendorCalendarStore";
import { styles } from "./BlockDateModal.styles";

type Props = {
  visible: boolean;
  onClose: () => void;
};

export function BlockDateModal({ visible, onClose }: Props) {
  const { selectedDate, blockedDates, isBlocked, blockDate, unblockDate } = useVendorCalendarStore();
  const [reason, setReason] = useState("");

  const selectedIsBlocked = isBlocked(selectedDate);

  const handleToggle = () => {
    if (selectedIsBlocked) {
      unblockDate(selectedDate);
    } else {
      blockDate(selectedDate, reason.trim() || undefined);
      setReason("");
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.sheet} onPress={(e) => e.stopPropagation()}>
          <View style={styles.header}>
            <Text style={styles.title}>Manage Availability</Text>
            <TouchableOpacity onPress={onClose}>
              <MaterialCommunityIcons name="close" size={22} color={CAL_COLORS.baseText} />
            </TouchableOpacity>
          </View>

          <Text style={styles.selectedDateLabel}>Selected Date</Text>
          <Text style={styles.selectedDateValue}>{selectedDate}</Text>

          {!selectedIsBlocked && (
            <>
              <Text style={styles.fieldLabel}>Reason (optional)</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. Personal leave, already booked elsewhere"
                placeholderTextColor={CAL_COLORS.bodyRose}
                value={reason}
                onChangeText={setReason}
              />
            </>
          )}

          <TouchableOpacity
            style={[styles.actionButton, selectedIsBlocked && styles.unblockButton]}
            onPress={handleToggle}
          >
            <MaterialCommunityIcons
              name={selectedIsBlocked ? "lock-open-outline" : "lock-outline"}
              size={18}
              color="#fff"
            />
            <Text style={styles.actionButtonText}>
              {selectedIsBlocked ? "Unblock This Date" : "Block This Date"}
            </Text>
          </TouchableOpacity>

          <Text style={styles.listHeading}>Blocked Dates</Text>
          <FlatList
            data={blockedDates}
            keyExtractor={(item) => item.date}
            style={{ maxHeight: 200 }}
            ListEmptyComponent={<Text style={styles.emptyText}>No blocked dates yet.</Text>}
            renderItem={({ item }) => (
              <View style={styles.blockedRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.blockedDate}>{item.date}</Text>
                  {item.reason ? <Text style={styles.blockedReason}>{item.reason}</Text> : null}
                </View>
                <TouchableOpacity onPress={() => unblockDate(item.date)}>
                  <MaterialCommunityIcons name="trash-can-outline" size={18} color={CAL_COLORS.blocked} />
                </TouchableOpacity>
              </View>
            )}
          />
        </Pressable>
      </Pressable>
    </Modal>
  );
}