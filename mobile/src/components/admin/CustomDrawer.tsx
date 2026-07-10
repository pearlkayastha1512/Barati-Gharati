import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { DrawerContentScrollView, DrawerContentComponentProps } from '@react-navigation/drawer';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { colors } from '../../constants/colors';

const navItems = [
  { name: 'Dashboard', icon: 'grid-outline', route: 'Dashboard' },
  { name: 'Vendor Management', icon: 'people-outline', route: 'VendorManagement' },
  { name: 'Customer Management', icon: 'person-outline', route: 'CustomerManagement' },
  { name: 'Bookings', icon: 'calendar-outline', route: 'Bookings' },
  { name: 'Payments', icon: 'card-outline', route: 'Payments' },
  { name: 'Reviews', icon: 'star-outline', route: 'Reviews' },
  { name: 'Notifications', icon: 'notifications-outline', route: 'Notifications' },
  { name: 'Settings', icon: 'settings-outline', route: 'Settings' },
];

export default function CustomDrawer(props: DrawerContentComponentProps) {
  const activeRoute = props.state.routeNames[props.state.index];

  return (
    <View style={{ flex: 1 }}>
      <DrawerContentScrollView {...props} contentContainerStyle={{ paddingTop: 0 }}>
        <View style={styles.logoBox}>
          <Image
            source={require('../../../assets/Barati Gharati Logo new.png')}
            style={styles.logoImage}
            resizeMode="contain"
          />
        </View>

        <Text style={styles.sectionLabel}>ADMINISTRATION</Text>

        {navItems.map((item) => {
          const active = activeRoute === item.route;
          return (
            <TouchableOpacity
              key={item.route}
              style={[styles.navItem, active && styles.navItemActive]}
              onPress={() => props.navigation.navigate(item.route)}
            >
              <Ionicons
                name={item.icon as any}
                size={20}
                color={active ? colors.white : colors.textGray}
              />
              <Text style={[styles.navText, active && styles.navTextActive]}>{item.name}</Text>
              {active && (
                <MaterialIcons name="chevron-right" size={18} color={colors.white} style={{ marginLeft: 'auto' }} />
              )}
            </TouchableOpacity>
          );
        })}
      </DrawerContentScrollView>

      <View style={styles.statusBox}>
        <Text style={styles.statusTitle}>Platform Status</Text>
        <Text style={styles.statusDesc}>
          Monitor vendors, customers, bookings and payments.
        </Text>
      </View>
      <TouchableOpacity style={styles.logoutRow}>
        <View style={styles.avatar}><Text style={{ color: colors.white, fontWeight: '600' }}>N</Text></View>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  logoBox: {
    margin: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: colors.white,
  },
  logoImage: {
    width: '100%',
    height: 86,
  },
  sectionLabel: {
    fontSize: 11,
    letterSpacing: 1,
    color: colors.textGray,
    marginLeft: 20,
    marginBottom: 8,
    fontWeight: '600',
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginHorizontal: 8,
    borderRadius: 10,
    gap: 12,
  },
  navItemActive: { backgroundColor: colors.navyMid },
  navText: { fontSize: 14, color: colors.textDark },
  navTextActive: { color: colors.white, fontWeight: '600' },
  statusBox: {
    margin: 16,
    padding: 14,
    backgroundColor: colors.bg,
    borderRadius: 12,
  },
  statusTitle: { fontWeight: '700', color: colors.textDark, marginBottom: 4 },
  statusDesc: { fontSize: 12, color: colors.textGray },
  logoutRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 20,
    paddingBottom: 24,
    paddingTop: 8,
  },
  avatar: {
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: colors.textDark,
    alignItems: 'center', justifyContent: 'center',
  },
  logoutText: { color: colors.red, fontWeight: '600' },
});
