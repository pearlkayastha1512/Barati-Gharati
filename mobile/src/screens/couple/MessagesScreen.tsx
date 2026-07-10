import React, { useState } from "react";
import { View, Text, TextInput, FlatList, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useMessagesStore } from "../../store/messagesStore";
import { ConversationListItem } from "../../components/users/messages/ConversationListItem";
import { styles } from "./styles/MessagesScreen.styles";

export default function MessagesScreen() {
  const navigation = useNavigation<any>();
  const conversations = useMessagesStore((state) => state.conversations);
  const [searchText, setSearchText] = useState("");

  const filteredConversations = conversations.filter((c) =>
    c.vendorName.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={22} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Messages</Text>
      </View>

      <View style={styles.searchRow}>
        <MaterialIcons name="search" size={20} color="#999" />
        <TextInput
          placeholder="Search conversations..."
          placeholderTextColor="#999"
          style={styles.searchInput}
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>

      <FlatList
        data={filteredConversations}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 20 }}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <MaterialIcons name="chat-bubble-outline" size={44} color="#ddd" />
            <Text style={styles.emptyStateText}>No conversations yet</Text>
            <Text style={styles.emptyStateSubtext}>
              Message vendors directly from their profile page.
            </Text>
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