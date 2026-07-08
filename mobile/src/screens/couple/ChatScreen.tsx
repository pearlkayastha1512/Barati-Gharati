import React, { useState } from "react";
import { View, Text, TextInput, FlatList, TouchableOpacity, KeyboardAvoidingView, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useMessagesStore } from "../../store/messagesStore";
import { styles } from "./styles/ChatScreen.styles";

export default function ChatScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const conversationId = route?.params?.conversationId;

  const conversation = useMessagesStore((state) =>
    state.conversations.find((c) => c.id === conversationId)
  );
  const sendMessage = useMessagesStore((state) => state.sendMessage);
  const [input, setInput] = useState("");

  if (!conversation) {
    return (
      <SafeAreaView style={styles.safeArea} edges={["top"]}>
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>Conversation not found.</Text>
        </View>
      </SafeAreaView>
    );
  }

  const handleSend = () => {
    if (!input.trim()) return;
    sendMessage(conversation.id, input.trim());
    setInput("");
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <MaterialIcons name="arrow-back" size={22} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{conversation.vendorName}</Text>
        </View>

        <FlatList
          data={conversation.messages}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.messageList}
          renderItem={({ item }) => (
            <View style={[styles.messageBubble, item.fromUser ? styles.userBubble : styles.vendorBubble]}>
              <Text style={[styles.messageText, item.fromUser && styles.userMessageText]}>{item.text}</Text>
              <Text style={[styles.messageTime, item.fromUser && styles.userMessageTime]}>{item.timestamp}</Text>
            </View>
          )}
        />

        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            placeholder="Type a message..."
            placeholderTextColor="#999"
            value={input}
            onChangeText={setInput}
            onSubmitEditing={handleSend}
            returnKeyType="send"
          />
          <TouchableOpacity style={styles.sendButton} onPress={handleSend} disabled={!input.trim()}>
            <MaterialIcons name="send" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}