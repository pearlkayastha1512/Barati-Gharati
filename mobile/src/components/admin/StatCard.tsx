import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../constants/colors';

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
    backgroundColor: colors.white,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  label: { fontSize: 12, color: colors.textGray, marginBottom: 4 },
  value: { fontSize: 24, fontWeight: '800', color: colors.textDark },
});