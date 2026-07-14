import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { useMessagesStore } from "../../store/messagesStore";
import { ConversationListItem } from "../../components/users/messages/ConversationListItem";
import { styles } from "./styles/MessagesScreen.styles";

export default function MessagesScreen() {
  const navigation = useNavigation<any>();
  const conversations = useMessagesStore((state) => state.conversations);
  const isLoading = useMessagesStore((state) => state.isLoading);
  const [searchText, setSearchText] = useState("");
  const fetchConversations = useMessagesStore((state) => state.fetchConversations);

  useEffect(() => {
    void fetchConversations();
  }, [fetchConversations]);

  const normalizedSearch = searchText.trim().toLowerCase();
  const filteredConversations = conversations.filter(
    (conversation) =>
      conversation.vendorName.toLowerCase().includes(normalizedSearch) ||
      conversation.lastMessage.toLowerCase().includes(normalizedSearch),
  );

  const conversationLabel = `${conversations.length} ${
    conversations.length === 1 ? "conversation" : "conversations"
  }`;

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={22} color="#3f1d2f" />
        </TouchableOpacity>
        <View style={styles.headerCopy}>
          <Text style={styles.headerTitle}>Messages</Text>
          <Text style={styles.headerSubtitle}>Chat with your selected vendors</Text>
        </View>
      </View>

      <LinearGradient
        colors={["#ff4d6d", "#ff8fa1", "#fff3b0"]}
        locations={[0, 0.62, 1]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.messagesHero}
      >
        <View pointerEvents="none" style={styles.heroDecorationLarge} />
        <View pointerEvents="none" style={styles.heroDecorationSmall} />
        <View style={styles.heroIconCircle}>
          <MaterialIcons name="forum" size={24} color="#ff4d6d" />
        </View>
        <View style={styles.heroCopy}>
          <Text style={styles.heroEyebrow}>{conversationLabel}</Text>
          <Text style={styles.heroTitle}>Your wedding conversations</Text>
          <Text style={styles.heroSubtitle}>Keep every vendor discussion together.</Text>
        </View>
      </LinearGradient>

      <View style={styles.searchRow}>
        <MaterialIcons name="search" size={21} color="#d4145a" />
        <TextInput
          placeholder="Search conversations..."
          placeholderTextColor="#a67888"
          style={styles.searchInput}
          value={searchText}
          onChangeText={setSearchText}
          returnKeyType="search"
        />
        {searchText.length > 0 && (
          <TouchableOpacity
            style={styles.clearSearchButton}
            onPress={() => setSearchText("")}
            accessibilityRole="button"
            accessibilityLabel="Clear conversation search"
          >
            <MaterialIcons name="close" size={17} color="#6c2d45" />
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={filteredConversations}
        keyExtractor={(item) => item.id}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.listContent,
          filteredConversations.length === 0 && styles.emptyListContent,
        ]}
        refreshControl={
          <RefreshControl
            refreshing={isLoading && conversations.length > 0}
            onRefresh={() => void fetchConversations()}
            colors={["#ff4d6d"]}
            tintColor="#ff4d6d"
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            {isLoading ? (
              <>
                <ActivityIndicator size="large" color="#ff4d6d" />
                <Text style={styles.emptyStateText}>Loading conversations...</Text>
              </>
            ) : (
              <>
                <View style={styles.emptyIconCircle}>
                  <MaterialIcons
                    name={normalizedSearch ? "search-off" : "chat-bubble-outline"}
                    size={34}
                    color="#ff4d6d"
                  />
                </View>
                <Text style={styles.emptyStateText}>
                  {normalizedSearch ? "No matching conversations" : "No conversations yet"}
                </Text>
                <Text style={styles.emptyStateSubtext}>
                  {normalizedSearch
                    ? "Try searching with a different vendor name or message."
                    : "Message vendors directly from their profile page."}
                </Text>
              </>
            )}
          </View>
        }
        renderItem={({ item }) => (
          <ConversationListItem
            conversation={item}
            onPress={() => navigation.navigate("Chat", { conversationId: item.id })}
          />
        )}
      />
    </SafeAreaView>
  );
}
