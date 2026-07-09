import React from "react";
import { ScrollView, View, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";

import { styles } from "./vendorMessagesScreenStyles";
import { EmptyState } from "../../components/vendors/dashboard/EmptyState";
import { MOCK_MESSAGES } from "../../constants/mockVendorData";

export default function VendorMessagesScreen() {
  const navigation = useNavigation<any>();

  const getInitial = (name: string) => name.charAt(0).toUpperCase();

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Messages</Text>
          <Text style={styles.headerSubtitle}>Talk with your customers.</Text>
        </View>

        {MOCK_MESSAGES.length === 0 ? (
          <EmptyState icon="chat-outline" message="No messages yet." />
        ) : (
          MOCK_MESSAGES.map((m) => (
            <TouchableOpacity
              key={m.id}
              style={styles.row}
              onPress={() => navigation.navigate("VendorChat", { customerName: m.customerName })}
            >
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{getInitial(m.customerName)}</Text>
              </View>
              <View style={styles.content}>
                <View style={styles.nameRow}>
                  <Text style={styles.name}>{m.customerName}</Text>
                  <Text style={styles.timestamp}>{m.timestamp}</Text>
                </View>
                <Text style={styles.lastMessage} numberOfLines={1}>{m.lastMessage}</Text>
              </View>
              {m.unread && <View style={styles.unreadDot} />}
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}