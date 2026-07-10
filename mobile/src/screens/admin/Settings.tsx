import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../constants/colors';

export default function Settings({ navigation }: any) {
  const [allowVendorReg, setAllowVendorReg] = useState(true);
  const [allowCustomerReg, setAllowCustomerReg] = useState(true);
  const [enableReviews, setEnableReviews] = useState(true);
  const [enablePayments, setEnablePayments] = useState(true);
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  const settingsList = [
    { label: 'Allow Vendor Registration', value: allowVendorReg, onChange: setAllowVendorReg },
    { label: 'Allow Customer Registration', value: allowCustomerReg, onChange: setAllowCustomerReg },
    { label: 'Enable Reviews', value: enableReviews, onChange: setEnableReviews },
    { label: 'Enable Payments', value: enablePayments, onChange: setEnablePayments },
    { label: 'Maintenance Mode', value: maintenanceMode, onChange: setMaintenanceMode },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 16 }}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
          <Ionicons name="menu" size={26} color={colors.textDark} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={{ width: 26 }} />
      </View>

      <LinearGradient colors={[colors.navyDark, colors.blue]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.banner}>
        <View style={styles.badge}>
          <Ionicons name="settings-outline" size={13} color={colors.white} />
          <Text style={styles.badgeText}>Admin Settings</Text>
        </View>
        <Text style={styles.bannerTitle}>Platform{'\n'}Settings</Text>
        <Text style={styles.bannerDesc}>Configure platform-wide settings and preferences.</Text>
      </LinearGradient>

      <View style={styles.listCard}>
        <Text style={styles.sectionTitle}>Platform Settings</Text>

        {settingsList.map((s, i) => (
          <View key={i} style={styles.row}>
            <Text style={styles.label}>{s.label}</Text>
            <Switch
              value={s.value}
              onValueChange={s.onChange}
              trackColor={{ false: colors.border, true: colors.blue }}
              thumbColor={colors.white}
            />
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
  headerTitle: { fontSize: 18, fontWeight: '800', color: colors.textDark },
  banner: { borderRadius: 18, padding: 20, marginBottom: 16 },
  badge: { flexDirection: 'row', alignItems: 'center', gap: 6, alignSelf: 'flex-start', backgroundColor: 'rgba(255,255,255,0.15)', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20, marginBottom: 14 },
  badgeText: { color: colors.white, fontSize: 11, fontWeight: '600' },
  bannerTitle: { color: colors.white, fontSize: 24, fontWeight: '800', lineHeight: 30, marginBottom: 10 },
  bannerDesc: { color: 'rgba(255,255,255,0.85)', fontSize: 13, lineHeight: 19 },
  listCard: { backgroundColor: colors.white, borderRadius: 14, borderWidth: 1, borderColor: colors.border, padding: 16 },
  sectionTitle: { fontSize: 15, fontWeight: '800', color: colors.textDark, marginBottom: 12 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: colors.border },
  label: { fontSize: 13, color: colors.textDark, fontWeight: '600', flex: 1 },
});