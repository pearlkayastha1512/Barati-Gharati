import React from "react";
import { View, Text } from "react-native";
import { styles } from "../../../screens/vendor/VendorRegistration/styles";

type Row = { label: string; value: string };

export function ReviewCard({ title, rows }: { title: string; rows: Row[] }) {
  return (
    <View style={styles.reviewCard}>
      <Text style={styles.reviewCardTitle}>{title}</Text>
      {rows.map((row) => (
        <View key={row.label} style={styles.reviewRow}>
          <Text style={styles.reviewRowLabel}>{row.label}</Text>
          <Text style={styles.reviewRowValue}>{row.value}</Text>
        </View>
      ))}
    </View>
  );
}