import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { adminTheme } from '../../constants/adminTheme';

type Props = {
  icon: string;
  iconColor: string;
  iconBg: string;
  label: string;
  value: string | number;
};

export default function StatCard({ icon, iconColor, iconBg, label, value }: Props) {
  return (
    <View style={styles.card}>
      <View style={[styles.iconBox, { backgroundColor: iconBg }]}>
        <Ionicons name={icon as any} size={20} color={iconColor} />
      </View>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '47%',
    backgroundColor: adminTheme.surface,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: adminTheme.border,
    shadowColor: adminTheme.shadow,
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
    minWidth: 0,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  label: { fontSize: 12, lineHeight: 18, color: adminTheme.muted, marginBottom: 4 },
  value: { fontSize: 24, lineHeight: 31, fontWeight: '800', color: adminTheme.ink },
});
