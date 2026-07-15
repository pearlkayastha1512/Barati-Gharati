import React, { useCallback } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { styles } from "./vendorMessagesScreenStyles";
import { useVendorChatStore } from "../../store/vendorChatStore";
import { COLORS } from "../../constants/theme";

export default function VendorMessagesScreen() {
  const navigation = useNavigation<any>();
  const { conversations, isLoading, error, fetchConversations } =
    useVendorChatStore();

  // Bottom tabs remain mounted. Refetch every time Messages becomes active so
  // newly-created conversations and latest messages appear without app restart.
  useFocusEffect(
    useCallback(() => {
      void fetchConversations();
    }, [fetchConversations]),
  );

  const getInitial = (name: string) =>
    name?.charAt(0).toUpperCase() || "?";

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isLoading && conversations.length > 0}
            onRefresh={() => void fetchConversations()}
            colors={[COLORS.primary]}
            tintColor={COLORS.primary}
          />
        }
      >
        <View style={styles.header}>
          <View style={styles.headerIcon}>
            <MaterialCommunityIcons
              name="message-text-outline"
              size={23}
              color={COLORS.primary}
            />
          </View>
          <View style={styles.headerCopy}>
            <Text style={styles.headerTitle}>Messages</Text>
            <Text style={styles.headerSubtitle}>Talk with your customers.</Text>
          </View>
          <View style={styles.countPill}>
            <Text style={styles.countText}>{conversations.length}</Text>
          </View>
        </View>

        {isLoading && conversations.length === 0 ? (
          <View style={styles.stateCard}>
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text style={styles.stateTitle}>Loading conversations...</Text>
          </View>
        ) : error ? (
          <TouchableOpacity
            style={styles.errorCard}
            activeOpacity={0.8}
            onPress={() => void fetchConversations()}
          >
            <View style={styles.errorIcon}>
              <MaterialCommunityIcons
                name="cloud-alert-outline"
                size={28}
                color={COLORS.danger}
              />
            </View>
            <Text style={styles.errorTitle}>Messages load nahi hue</Text>
            <Text style={styles.errorText}>{error}</Text>
            <Text style={styles.retryText}>Tap to try again</Text>
          </TouchableOpacity>
        ) : conversations.length === 0 ? (
          <View style={styles.stateCard}>
            <View style={styles.emptyIcon}>
              <MaterialCommunityIcons
                name="message-processing-outline"
                size={34}
                color={COLORS.primary}
              />
            </View>
            <Text style={styles.stateTitle}>No conversations yet</Text>
            <Text style={styles.stateText}>
              Customer conversations appear here after advance payment and admin approval.
            </Text>
          </View>
        ) : (
          <View style={styles.listCard}>
            {conversations.map((item, index) => {
              const lastMessage = item.messages?.[0];

              return (
                <TouchableOpacity
                  key={item.id}
                  activeOpacity={0.78}
                  style={[
                    styles.row,
                    index === conversations.length - 1 && styles.lastRow,
                  ]}
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
                      <Text style={styles.name} numberOfLines={1}>
                        {item.customer.name}
                      </Text>
                      <Text style={styles.timestamp}>
                        {lastMessage
                          ? new Date(lastMessage.createdAt).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : ""}
                      </Text>
                    </View>

                    <View style={styles.messageRow}>
                      <Text style={styles.lastMessage} numberOfLines={1}>
                        {lastMessage?.message ?? "Start chatting"}
                      </Text>
                      <MaterialCommunityIcons
                        name="chevron-right"
                        size={19}
                        color={COLORS.textLight}
                      />
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
