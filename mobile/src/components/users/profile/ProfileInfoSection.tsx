import React from "react";
import { View, Text } from "react-native";
import { Divider } from "react-native-paper";
import { styles } from "../../../screens/couple/styles/ProfileScreen.styles";

type Row = { label: string; value?: string };

type Props = {
  title: string;
  rows: Row[];
};

export function ProfileInfoSection({ title, rows }: Props) {
  return (
    <View style={styles.sectionCard}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {rows.map((row, i) => (
        <View key={row.label}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>{row.label}</Text>
            <Text style={[styles.infoValue, !row.value && styles.infoValueEmpty]}>
              {row.value || "Not Provided"}
            </Text>
          </View>
          {i < rows.length - 1 && <Divider style={styles.rowDivider} />}
        </View>
      ))}
    </View>
  );
}