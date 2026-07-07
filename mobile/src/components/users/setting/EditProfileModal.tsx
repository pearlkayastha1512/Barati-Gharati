import React, { useState, useEffect } from "react";
import { Modal, View, Text, TextInput, TouchableOpacity, Pressable, ScrollView } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { ProfileData } from "../../../store/settingsStore";
import { styles } from "../../../screens/couple/styles/SettingsScreen.styles";

type Props = {
  visible: boolean;
  onClose: () => void;
  profile: ProfileData;
  onSave: (data: Partial<ProfileData>) => void;
};

export function EditProfileModal({ visible, onClose, profile, onSave }: Props) {
  const [form, setForm] = useState(profile);

  useEffect(() => {
    if (visible) setForm(profile);
  }, [visible, profile]);

  const update = (key: keyof ProfileData, value: string) => setForm((f) => ({ ...f, [key]: value }));

  const handleSave = () => {
    onSave(form);
    onClose();
  };

  const Field = ({ label, field, placeholder }: { label: string; field: keyof ProfileData; placeholder: string }) => (
    <>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        style={styles.fieldInput}
        placeholder={placeholder}
        placeholderTextColor="#bbb"
        value={form[field]}
        onChangeText={(v) => update(field, v)}
      />
    </>
  );

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.modalOverlay} onPress={onClose}>
        <Pressable style={styles.editProfileSheet} onPress={(e) => e.stopPropagation()}>
          <View style={styles.addExpenseHeader}>
            <Text style={styles.addExpenseTitle}>Edit Profile</Text>
            <TouchableOpacity onPress={onClose}>
              <MaterialIcons name="close" size={22} color="#333" />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={styles.sectionSubheading}>Personal Information</Text>
            <Field label="Full Name" field="fullName" placeholder="Full Name" />
            <Field label="Email" field="email" placeholder="Email" />
            <Field label="Phone" field="phone" placeholder="Phone" />
            <Field label="Gender" field="gender" placeholder="Gender" />

            <Text style={styles.sectionSubheading}>Contact Information</Text>
            <Field label="Address" field="address" placeholder="Address" />
            <Field label="City" field="city" placeholder="City" />
            <Field label="State" field="state" placeholder="State" />
            <Field label="Country" field="country" placeholder="Country" />

            <Text style={styles.sectionSubheading}>Partner Information</Text>
            <Field label="Partner Name" field="partnerName" placeholder="Partner Name" />
            <Field label="Partner Email" field="partnerEmail" placeholder="Partner Email" />
            <Field label="Partner Phone" field="partnerPhone" placeholder="Partner Phone" />

            <Text style={styles.sectionSubheading}>Wedding Information</Text>
            <Field label="Wedding Date" field="weddingDate" placeholder="dd-mm-yyyy" />
            <Field label="Venue" field="venue" placeholder="Venue" />
            <Field label="Guest Count" field="guestCount" placeholder="0" />
            <Field label="Occupation" field="occupation" placeholder="Occupation" />
            <Field label="Theme" field="theme" placeholder="Theme" />
          </ScrollView>

          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Save Changes</Text>
          </TouchableOpacity>
        </Pressable>
      </Pressable>
    </Modal>
  );
}