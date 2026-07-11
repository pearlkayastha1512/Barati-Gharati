import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useMessagesStore } from "../../store/messagesStore";
import { getSocket } from "../../utils/socket";
import { styles } from "./styles/ChatScreen.styles";

export default function ChatScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const conversationId = route?.params?.conversationId;
  const [isConnected, setIsConnected] = useState(false);

  const conversation = useMessagesStore((state) =>
    state.conversations.find((c) => c.id === conversationId)
  );
  const fetchMessages = useMessagesStore((state) => state.fetchMessages);
  const sendMessage = useMessagesStore((state) => state.sendMessage);
  const addIncomingMessage = useMessagesStore((state) => state.addIncomingMessage);

  const [input, setInput] = useState("");

  useEffect(() => {
    if (!conversationId) return;

    fetchMessages(conversationId);

    const socket = getSocket();

setIsConnected(socket.connected); // check current state immediately

socket.on("connect", () => {
  setIsConnected(true);
});

socket.on("disconnect", () => {
  setIsConnected(false);
});

socket.emit("joinConversation", conversationId);

    const handleNewMessage = (message: any) => {
      if (message.conversationId !== conversationId) return;

      const currentUserId = require("../../store/authStore").useAuthStore.getState().user?.id;

      addIncomingMessage(conversationId, {
        id: message.id,
        text: message.message,
        fromUser: message.senderId === currentUserId,
        timestamp: new Date(message.createdAt).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      });
    };

    socket.on("newMessage", handleNewMessage);

    return () => {
  socket.off("newMessage", handleNewMessage);
  socket.off("connect");
  socket.off("disconnect");
};
  }, [conversationId]);

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
        <Text style={{ textAlign: "center", padding: 4, backgroundColor: isConnected ? "#c8f7c5" : "#f7c5c5" }}>
  {isConnected ? "🟢 Connected" : "🔴 Not Connected"}
</Text>

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