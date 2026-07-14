import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { ProfileData } from "../../../store/settingsStore";
import { styles } from "../../../screens/couple/styles/SettingsScreen.styles";

type Props = {
  profile: ProfileData;
  onEdit: () => void;
};

function InfoRow({ icon, label, value }: { icon: keyof typeof MaterialIcons.glyphMap; label: string; value: string }) {
  return (
    <View style={styles.infoRow}>
      <View style={styles.infoIconCircle}>
        <MaterialIcons name={icon} size={18} color="#ff4d6d" />
      </View>
      <View style={styles.infoCopy}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value || "-"}</Text>
      </View>
    </View>
  );
}

export function AccountCard({ profile, onEdit }: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.cardHeaderRow}>
        <Text style={styles.cardHeaderTitle}>Account</Text>
        <TouchableOpacity style={styles.editButton} onPress={onEdit}>
          <MaterialIcons name="edit" size={14} color="#fff" />
          <Text style={styles.editButtonText}>Edit</Text>
        </TouchableOpacity>
      </View>

      <InfoRow icon="person-outline" label="Full Name" value={profile.fullName} />
      <InfoRow icon="mail-outline" label="Email" value={profile.email} />
      <InfoRow icon="call" label="Phone" value={profile.phone} />
    </View>
  );
}
