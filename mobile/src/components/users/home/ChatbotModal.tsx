import React, { useEffect, useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { styles } from "./ChatbotModal.styles";
import { getChatHistory, sendChatMessage, BackendChatMessage } from "../../../api/chatbot.api"; // ⚠️ adjust relative path if needed

type Message = { id: string; text: string; fromBot: boolean };

const WELCOME_MESSAGE: Message = {
  id: "welcome",
  text: "Hi! I'm your wedding planning assistant. How can I help you today?",
  fromBot: true,
};

const mapHistory = (history: BackendChatMessage[]): Message[] =>
  history.map((m) => ({ id: m.id, text: m.content, fromBot: m.role === "ASSISTANT" }));

export function ChatbotModal({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState("");
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    if (!visible) return;

    (async () => {
      try {
        setIsLoadingHistory(true);
        const history = await getChatHistory();
        setMessages(history.length > 0 ? mapHistory(history) : [WELCOME_MESSAGE]);
      } catch (error) {
        console.log("GET CHAT HISTORY ERROR =>", error);
        // keep the welcome message as a fallback rather than showing a blank chat
      } finally {
        setIsLoadingHistory(false);
      }
    })();
  }, [visible]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || isSending) return;

    const userMessage: Message = { id: `local-${Date.now()}`, text, fromBot: false };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsSending(true);

    try {
      const { reply } = await sendChatMessage(text);
      setMessages((prev) => [...prev, { id: `bot-${Date.now()}`, text: reply, fromBot: true }]);
    } catch (error) {
      console.log("SEND CHAT MESSAGE ERROR =>", error);
      setMessages((prev) => [
        ...prev,
        { id: `error-${Date.now()}`, text: "Something went wrong. Please try again.", fromBot: true },
      ]);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <LinearGradient
          colors={["#ff8fa1", "#ff4d6d"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.headerGradient}
        >
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <View style={styles.botIconCircle}>
                <MaterialIcons name="smart-toy" size={20} color="#fff" />
              </View>
              <View>
                <Text style={styles.headerTitle}>Wedding Assistant</Text>
                <Text style={styles.headerSubtitle}>Always here to help</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <MaterialIcons name="close" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </LinearGradient>

        {isLoadingHistory ? (
          <View style={[styles.messageList, { justifyContent: "center", alignItems: "center" }]}>
            <ActivityIndicator size="small" color="#ff4d6d" />
          </View>
        ) : (
          <FlatList
            data={messages}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.messageList}
            renderItem={({ item }) => (
              <View style={[styles.messageRow, item.fromBot ? styles.botRow : styles.userRow]}>
                {item.fromBot && (
                  <View style={styles.botAvatar}>
                    <MaterialIcons name="smart-toy" size={14} color="#fff" />
                  </View>
                )}
                <View style={[styles.messageBubble, item.fromBot ? styles.botBubble : styles.userBubble]}>
                  <Text style={[styles.messageText, !item.fromBot && styles.userMessageText]}>
                    {item.text}
                  </Text>
                </View>
              </View>
            )}
            ListFooterComponent={
              isSending ? (
                <View style={[styles.messageRow, styles.botRow]}>
                  <View style={styles.botAvatar}>
                    <MaterialIcons name="smart-toy" size={14} color="#fff" />
                  </View>
                  <View style={[styles.messageBubble, styles.botBubble, styles.typingBubble]}>
                    <ActivityIndicator size="small" color="#ff4d6d" />
                  </View>
                </View>
              ) : null
            }
          />
        )}

        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            placeholder="Type a message..."
            placeholderTextColor="#999"
            value={input}
            onChangeText={setInput}
            onSubmitEditing={handleSend}
            returnKeyType="send"
            editable={!isSending}
          />
          <TouchableOpacity
            style={[styles.sendButton, (!input.trim() || isSending) && styles.sendButtonDisabled]}
            onPress={handleSend}
            disabled={!input.trim() || isSending}
          >
            <MaterialIcons name="send" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}