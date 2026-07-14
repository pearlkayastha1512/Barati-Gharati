import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useMessagesStore } from "../../store/messagesStore";
import { getSocket } from "../../utils/socket";
import { styles } from "./styles/ChatScreen.styles";

export default function ChatScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const conversationId = route?.params?.conversationId;
  const [isConnected, setIsConnected] = useState(false);
  const [warning, setWarning] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);
  const listRef = useRef<FlatList>(null);

  const conversation = useMessagesStore((state) =>
    state.conversations.find((c) => c.id === conversationId)
  );
  const fetchMessages = useMessagesStore((state) => state.fetchMessages);
  const sendMessage = useMessagesStore((state) => state.sendMessage);
  const addIncomingMessage = useMessagesStore((state) => state.addIncomingMessage);

  const [input, setInput] = useState("");

  useEffect(() => {
    if (!conversationId) return;

    void fetchMessages(conversationId);

    const socket = getSocket();

    setIsConnected(socket.connected);

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
  }, [addIncomingMessage, conversationId, fetchMessages]);

  if (!conversation) {
    return (
      <SafeAreaView style={styles.safeArea} edges={["top"]}>
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>Conversation not found.</Text>
        </View>
      </SafeAreaView>
    );
  }

  const handleSend = async () => {
    const message = input.trim();
    if (!message || isSending) return;

    setIsSending(true);
    const result = await sendMessage(conversation.id, message);
    setIsSending(false);

    if (!result.success) {
      setWarning(result.error ?? "Message send nahi ho saka.");
      return;
    }

    setWarning(null);
    setInput("");
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <MaterialIcons name="arrow-back" size={22} color="#3f1d2f" />
          </TouchableOpacity>
          <LinearGradient
            colors={["#ff8fa1", "#c9185b"]}
            style={styles.headerAvatar}
          >
            <Text style={styles.headerAvatarText}>
              {conversation.vendorName.charAt(0).toUpperCase()}
            </Text>
          </LinearGradient>
          <View style={styles.headerCopy}>
            <Text style={styles.headerTitle} numberOfLines={1}>{conversation.vendorName}</Text>
            <Text style={styles.headerSubtitle}>Secure vendor conversation</Text>
          </View>
        </View>

        <View style={[styles.connectionBar, isConnected ? styles.connectedBar : styles.disconnectedBar]}>
          <View style={[styles.connectionDot, isConnected ? styles.connectedDot : styles.disconnectedDot]} />
          <Text style={[styles.connectionText, !isConnected && styles.disconnectedText]}>
            {isConnected ? "Connected · Messages are protected" : "Connecting to secure chat..."}
          </Text>
        </View>

        {warning && (
          <View style={styles.warningBanner}>
            <View style={styles.warningIconBox}>
              <MaterialIcons name="gpp-maybe" size={21} color="#c2410c" />
            </View>
            <View style={styles.warningCopy}>
              <Text style={styles.warningTitle}>Message not sent</Text>
              <Text style={styles.warningText}>{warning}</Text>
            </View>
            <TouchableOpacity style={styles.warningClose} onPress={() => setWarning(null)}>
              <MaterialIcons name="close" size={18} color="#9a3412" />
            </TouchableOpacity>
          </View>
        )}

        <LinearGradient
          colors={["#fffaf6", "#fff1f4", "#fce7ee"]}
          locations={[0, 0.55, 1]}
          style={styles.chatBackground}
        >
          <View pointerEvents="none" style={styles.decorations}>
            <MaterialIcons name="local-florist" size={92} color="rgba(201,24,91,0.055)" style={styles.flowerTop} />
            <MaterialIcons name="favorite" size={54} color="rgba(255,77,109,0.045)" style={styles.heartCenter} />
            <MaterialIcons name="auto-awesome" size={76} color="rgba(108,45,69,0.05)" style={styles.sparkleBottom} />
            <View style={styles.decorativeRingOne} />
            <View style={styles.decorativeRingTwo} />
          </View>

          <FlatList
            ref={listRef}
            data={conversation.messages}
            keyExtractor={(item) => item.id}
            contentContainerStyle={[
              styles.messageList,
              conversation.messages.length === 0 && styles.emptyMessageList,
            ]}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: true })}
            ListEmptyComponent={(
              <View style={styles.chatEmptyState}>
                <View style={styles.chatEmptyIcon}>
                  <MaterialIcons name="forum" size={30} color="#c9185b" />
                </View>
                <Text style={styles.chatEmptyTitle}>Start your conversation</Text>
                <Text style={styles.chatEmptyText}>
                  Discuss booking details safely here. Personal contact and payment details cannot be shared.
                </Text>
              </View>
            )}
            renderItem={({ item }) => (
              <View style={[styles.messageBubble, item.fromUser ? styles.userBubble : styles.vendorBubble]}>
                <Text style={[styles.messageText, item.fromUser && styles.userMessageText]}>{item.text}</Text>
                <Text style={[styles.messageTime, item.fromUser && styles.userMessageTime]}>{item.timestamp}</Text>
              </View>
            )}
          />
        </LinearGradient>

        <View style={styles.inputRow}>
          <View style={styles.inputShell}>
            <MaterialIcons name="chat-bubble-outline" size={19} color="#a36b7e" />
            <TextInput
              style={styles.input}
              placeholder="Type a message..."
              placeholderTextColor="#a36b7e"
              value={input}
              onChangeText={setInput}
              onSubmitEditing={() => void handleSend()}
              returnKeyType="send"
              maxLength={1000}
              multiline
            />
          </View>
          <TouchableOpacity
            style={[styles.sendButton, (!input.trim() || isSending) && styles.sendButtonDisabled]}
            onPress={() => void handleSend()}
            disabled={!input.trim() || isSending}
          >
            {isSending ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <MaterialIcons name="send" size={21} color="#fff" />
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
