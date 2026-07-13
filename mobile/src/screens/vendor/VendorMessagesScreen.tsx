import React, { useEffect } from "react";
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";

import { styles } from "./vendorMessagesScreenStyles";
import { EmptyState } from "../../components/vendors/dashboard/EmptyState";
import { useVendorChatStore } from "../../store/vendorChatStore";

export default function VendorMessagesScreen() {
  const navigation = useNavigation<any>();

  const {
    conversations,
    isLoading,
    fetchConversations,
  } = useVendorChatStore();

  useEffect(() => {
    fetchConversations();
  }, []);

  const getInitial = (name: string) =>
    name?.charAt(0).toUpperCase() || "?";
  console.log("Conversations =>", conversations);

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Messages</Text>
          <Text style={styles.headerSubtitle}>
            Talk with your customers.
          </Text>
        </View>

        {isLoading ? (
          <ActivityIndicator
            size="large"
            style={{ marginTop: 40 }}
          />
        ) : conversations.length === 0 ? (
          <EmptyState
            icon="chat-outline"
            message="No messages yet."
          />
        ) : (
          conversations.map((item) => {
            const lastMessage = item.messages?.[0];

            return (
              <TouchableOpacity
                key={item.id}
                style={styles.row}
                onPress={() =>
                 navigation.navigate("VendorChat", {
  conversationId: item.id,
  receiverId: item.customer.id,
  customerName: item.customer.name,
})
                }
              >
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>
                    {getInitial(item.customer.name)}
                  </Text>
                </View>

                <View style={styles.content}>
                  <View style={styles.nameRow}>
                    <Text style={styles.name}>
                      {item.customer.name}
                    </Text>

                    <Text style={styles.timestamp}>
                      {lastMessage
                        ? new Date(
                            lastMessage.createdAt
                          ).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : ""}
                    </Text>
                  </View>

                  <Text
                    style={styles.lastMessage}
                    numberOfLines={1}
                  >
                    {lastMessage?.message ?? "Start chatting"}
                  </Text>
                </View>

                {/* Add unread support later when backend provides it */}
              </TouchableOpacity>
            );
          })
        )}
      </ScrollView>
    </SafeAreaView>
  );
}