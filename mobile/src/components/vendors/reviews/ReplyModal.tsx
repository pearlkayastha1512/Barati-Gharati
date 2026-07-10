import React, { useState } from "react";
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { COLORS, RADIUS, SPACING } from "../../../constants/theme";

type Props = {
  visible: boolean;
  onClose: () => void;
  customerName: string;
  onSubmit: (reply: string) => void;
};

export function ReplyModal({ visible, onClose, customerName, onSubmit }: Props) {
  const [reply, setReply] = useState("");

  const handleSubmit = () => {
    if (!reply.trim()) return;
    onSubmit(reply.trim());
    setReply("");
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.card}>
          <View style={styles.header}>
            <Text style={styles.title}>Reply to {customerName}</Text>
            <TouchableOpacity onPress={onClose}>
              <MaterialCommunityIcons name="close" size={22} color={COLORS.textMuted} />
            </TouchableOpacity>
          </View>

          <TextInput
            style={styles.input}
            placeholder="Write your reply..."
            placeholderTextColor={COLORS.textLight}
            value={reply}
            onChangeText={setReply}
            multiline
            numberOfLines={4}
          />

          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.submitButton, !reply.trim() && styles.submitButtonDisabled]}
              onPress={handleSubmit}
              disabled={!reply.trim()}
            >
              <Text style={styles.submitButtonText}>Send Reply</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.4)", justifyContent: "center", padding: SPACING.xl },
  card: { backgroundColor: COLORS.surface, borderRadius: RADIUS.xl, padding: SPACING.lg },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: SPACING.md },
  title: { fontSize: 16, fontWeight: "700", color: COLORS.text },
  input: {
    borderWidth: 1, borderColor: COLORS.border, borderRadius: RADIUS.md,
    padding: SPACING.md, fontSize: 13, color: COLORS.text, minHeight: 90,
    textAlignVertical: "top", marginBottom: SPACING.md,
  },
  buttonRow: { flexDirection: "row", justifyContent: "flex-end", gap: 10 },
  cancelButton: { borderWidth: 1, borderColor: COLORS.border, borderRadius: RADIUS.md, paddingHorizontal: 18, paddingVertical: 10 },
  cancelButtonText: { fontSize: 13, fontWeight: "600", color: COLORS.text },
  submitButton: { backgroundColor: COLORS.primary, borderRadius: RADIUS.md, paddingHorizontal: 18, paddingVertical: 10 },
  submitButtonDisabled: { backgroundColor: COLORS.primary, opacity: 0.4 },
  submitButtonText: { fontSize: 13, fontWeight: "700", color: "#fff" },
});