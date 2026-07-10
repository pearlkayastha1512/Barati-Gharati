import React, { useState, useEffect } from "react";
import { Modal, View, Text, TextInput, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { styles } from "./EditBudgetModal.styles";

type Props = {
  visible: boolean;
  onClose: () => void;
  currentBudget: number;
  onSubmit: (amount: number) => void;
};

export function EditBudgetModal({ visible, onClose, currentBudget, onSubmit }: Props) {
  const [amount, setAmount] = useState(String(currentBudget));

  useEffect(() => {
    if (visible) setAmount(String(currentBudget));
  }, [visible, currentBudget]);

  const parsedAmount = parseInt(amount.replace(/[^0-9]/g, ""), 10) || 0;

  const handleSubmit = () => {
    if (parsedAmount <= 0) return;
    onSubmit(parsedAmount);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.card}>
          <View style={styles.header}>
            <Text style={styles.title}>Edit Total Budget</Text>
            <TouchableOpacity onPress={onClose}>
              <MaterialIcons name="close" size={22} color="#666" />
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>Total Wedding Budget (₹)</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. 1000000"
            placeholderTextColor="#999"
            value={amount}
            onChangeText={setAmount}
            keyboardType="number-pad"
          />

          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.saveButton, parsedAmount <= 0 && styles.saveButtonDisabled]}
              onPress={handleSubmit}
              disabled={parsedAmount <= 0}
            >
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}