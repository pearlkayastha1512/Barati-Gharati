import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Pressable,
  ScrollView,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { ProfileData } from "../../../store/settingsStore";
import { styles } from "../../../screens/couple/styles/SettingsScreen.styles";

type Props = {
  visible: boolean;
  onClose: () => void;
  profile: ProfileData;
  onSave: (data: Partial<ProfileData>) => void;
};

type FieldProps = {
  label: string;
  value: string;
  placeholder: string;
  onChange: (text: string) => void;
};

const Field = ({
  label,
  value,
  placeholder,
  onChange,
}: FieldProps) => (
  <>
    <Text style={styles.fieldLabel}>{label}</Text>
    <TextInput
      style={styles.fieldInput}
      placeholder={placeholder}
      placeholderTextColor="#bbb"
      value={value}
      onChangeText={onChange}
    />
  </>
);

export function EditProfileModal({
  visible,
  onClose,
  profile,
  onSave,
}: Props) {
  const [form, setForm] = useState(profile);

  useEffect(() => {
    if (visible) {
      setForm(profile);
    }
  }, [visible, profile]);

  const update = (key: keyof ProfileData, value: string) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSave = () => {
    onSave(form);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable style={styles.modalOverlay} onPress={onClose}>
        <Pressable
          style={styles.editProfileSheet}
          onPress={(e) => e.stopPropagation()}
        >
          <View style={styles.addExpenseHeader}>
            <Text style={styles.addExpenseTitle}>Edit Profile</Text>

            <TouchableOpacity onPress={onClose}>
              <MaterialIcons name="close" size={22} color="#333" />
            </TouchableOpacity>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <Text style={styles.sectionSubheading}>
              Personal Information
            </Text>

            <Field
              label="Full Name"
              value={form.fullName}
              placeholder="Full Name"
              onChange={(v) => update("fullName", v)}
            />

            <Field
              label="Email"
              value={form.email}
              placeholder="Email"
              onChange={(v) => update("email", v)}
            />

            <Field
              label="Phone"
              value={form.phone}
              placeholder="Phone"
              onChange={(v) => update("phone", v)}
            />

            <Field
              label="Gender"
              value={form.gender}
              placeholder="Gender"
              onChange={(v) => update("gender", v)}
            />

            <Text style={styles.sectionSubheading}>
              Contact Information
            </Text>

            <Field
              label="Address"
              value={form.address}
              placeholder="Address"
              onChange={(v) => update("address", v)}
            />

            <Field
              label="City"
              value={form.city}
              placeholder="City"
              onChange={(v) => update("city", v)}
            />

            <Field
              label="State"
              value={form.state}
              placeholder="State"
              onChange={(v) => update("state", v)}
            />

            <Field
              label="Country"
              value={form.country}
              placeholder="Country"
              onChange={(v) => update("country", v)}
            />

            <Text style={styles.sectionSubheading}>
              Partner Information
            </Text>

            <Field
              label="Partner Name"
              value={form.partnerName}
              placeholder="Partner Name"
              onChange={(v) => update("partnerName", v)}
            />

            <Field
              label="Partner Email"
              value={form.partnerEmail}
              placeholder="Partner Email"
              onChange={(v) => update("partnerEmail", v)}
            />

            <Field
              label="Partner Phone"
              value={form.partnerPhone}
              placeholder="Partner Phone"
              onChange={(v) => update("partnerPhone", v)}
            />

            <Text style={styles.sectionSubheading}>
              Wedding Information
            </Text>

            <Field
              label="Wedding Date"
              value={form.weddingDate}
              placeholder="dd-mm-yyyy"
              onChange={(v) => update("weddingDate", v)}
            />

            <Field
              label="Venue"
              value={form.venue}
              placeholder="Venue"
              onChange={(v) => update("venue", v)}
            />

            <Field
              label="Guest Count"
              value={form.guestCount}
              placeholder="0"
              onChange={(v) => update("guestCount", v)}
            />

            <Field
              label="Occupation"
              value={form.occupation}
              placeholder="Occupation"
              onChange={(v) => update("occupation", v)}
            />

            <Field
              label="Theme"
              value={form.theme}
              placeholder="Theme"
              onChange={(v) => update("theme", v)}
            />

            <View style={{ height: 20 }} />
          </ScrollView>

          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSave}
          >
            <Text style={styles.saveButtonText}>
              Save Changes
            </Text>
          </TouchableOpacity>
        </Pressable>
      </Pressable>
    </Modal>
  );
}