import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Pressable,
  Alert,
  ActivityIndicator,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useSettingsStore } from "../../../store/settingsStore";
import { styles } from "../../../screens/couple/styles/SettingsScreen.styles";

type Props = {
  visible: boolean;
  onClose: () => void;
};

export function ChangePasswordModal({ visible, onClose }: Props) {
  const changePassword = useSettingsStore((state) => state.changePassword);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetAndClose = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    onClose();
  };

  const handleSubmit = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert("Missing fields", "Please fill in all fields.");
      return;
    }
    if (newPassword.length < 6) {
      Alert.alert("Password too short", "New password must be at least 6 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert("Passwords don't match", "New password and confirm password must match.");
      return;
    }

    setIsSubmitting(true);
    const result = await changePassword(currentPassword, newPassword);
    setIsSubmitting(false);

    if (result.success) {
      Alert.alert("Success", "Your password has been changed.");
      resetAndClose();
    } else {
      Alert.alert("Error", result.error ?? "Unable to change password.");
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={resetAndClose}>
      <Pressable style={styles.modalOverlay} onPress={resetAndClose}>
        <Pressable style={styles.editProfileSheet} onPress={(e) => e.stopPropagation()}>
          <View style={styles.addExpenseHeader}>
            <Text style={styles.addExpenseTitle}>Change Password</Text>
            <TouchableOpacity onPress={resetAndClose}>
              <MaterialIcons name="close" size={22} color="#333" />
            </TouchableOpacity>
          </View>

          <Text style={styles.fieldLabel}>Current Password</Text>
          <TextInput
            style={styles.fieldInput}
            placeholder="Enter current password"
            placeholderTextColor="#bbb"
            secureTextEntry
            value={currentPassword}
            onChangeText={setCurrentPassword}
          />

          <Text style={styles.fieldLabel}>New Password</Text>
          <TextInput
            style={styles.fieldInput}
            placeholder="Enter new password"
            placeholderTextColor="#bbb"
            secureTextEntry
            value={newPassword}
            onChangeText={setNewPassword}
          />

          <Text style={styles.fieldLabel}>Confirm New Password</Text>
          <TextInput
            style={styles.fieldInput}
            placeholder="Re-enter new password"
            placeholderTextColor="#bbb"
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />

          <View style={{ height: 20 }} />

          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.saveButtonText}>Update Password</Text>
            )}
          </TouchableOpacity>
        </Pressable>
      </Pressable>
    </Modal>
  );
}