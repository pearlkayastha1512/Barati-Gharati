import React from "react";
import { ScrollView, View, Text, TouchableOpacity, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { COLORS } from "../../constants/theme";
import { styles } from "./servicesScreenStyles";
import { EmptyState } from "../../components/vendors/dashboard/EmptyState";
import { MOCK_SERVICES } from "../../constants/mockVendorData";

export default function ServicesScreen() {
  const handleAddService = () => {
    // TODO: navigate to an "Add Service" form screen once built
    Alert.alert("Add Service", "Service creation form coming soon.");
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>Services</Text>
            <Text style={styles.headerSubtitle}>Manage your wedding services.</Text>
          </View>
        </View>

        {MOCK_SERVICES.length === 0 ? (
          <EmptyState icon="briefcase-outline" message="No services added yet." />
        ) : (
          MOCK_SERVICES.map((s) => (
            <View key={s.id} style={styles.card}>
              <View style={styles.cardTopRow}>
                <Text style={styles.serviceName}>{s.name}</Text>
                <MaterialCommunityIcons name="dots-vertical" size={18} color={COLORS.textMuted} />
              </View>
              <Text style={styles.serviceCategory}>{s.category}</Text>
              <Text style={styles.servicePrice}>₹{s.price}</Text>
              <View style={[styles.statusBadge, s.active ? styles.statusActive : styles.statusInactive]}>
                <Text style={s.active ? styles.statusActiveText : styles.statusInactiveText}>
                  {s.active ? "Active" : "Inactive"}
                </Text>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      <TouchableOpacity style={styles.fab} onPress={handleAddService}>
        <MaterialCommunityIcons name="plus" size={26} color="#fff" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}