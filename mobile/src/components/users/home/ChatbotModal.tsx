import React, { useState } from "react";
import { Modal, View, Text, TextInput, TouchableOpacity, FlatList, KeyboardAvoidingView, Platform } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { styles } from "./ChatbotModal.styles";

// TODO: once backend is connected, replace this local state with:
// - on open, fetch history via getChatHistory() and populate messages
// - onSend should call sendChatMessage(text), append the user message immediately,
//   then append the bot's reply once the API responds
type Message = { id: string; text: string; fromBot: boolean };

const INITIAL_MESSAGES: Message[] = [
  { id: "1", text: "Hi! I'm your wedding planning assistant. How can I help you today?", fromBot: true },
];

export function ChatbotModal({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;
    const userMessage: Message = { id: Date.now().toString(), text: input.trim(), fromBot: false };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    // TODO: replace with real API call — this is just a placeholder echo response
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { id: (Date.now() + 1).toString(), text: "This is a placeholder reply — chatbot API not connected yet.", fromBot: true },
      ]);
    }, 500);
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.botIconCircle}>
              <MaterialIcons name="smart-toy" size={20} color="#fff" />
            </View>
            <Text style={styles.headerTitle}>Wedding Assistant</Text>
          </View>
          <TouchableOpacity onPress={onClose}>
            <MaterialIcons name="close" size={24} color="#333" />
          </TouchableOpacity>
        </View>

        <FlatList
          data={messages}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.messageList}
          renderItem={({ item }) => (
            <View style={[styles.messageBubble, item.fromBot ? styles.botBubble : styles.userBubble]}>
              <Text style={[styles.messageText, !item.fromBot && styles.userMessageText]}>{item.text}</Text>
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
    </Modal>
  );
}