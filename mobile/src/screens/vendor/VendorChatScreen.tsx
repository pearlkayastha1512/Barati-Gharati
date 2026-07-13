import React, {
  useEffect,
  useState,
} from "react";

import {
  SafeAreaView,
  View,
  FlatList,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

import { useRoute } from "@react-navigation/native";

import socketService from "../../services/socketService";
import { useVendorChatDetailStore } from "../../store/vendorChatDetailStore";
import { useAuthStore } from "../../store/authStore";

export default function VendorChatScreen() {
  const route = useRoute<any>();

  const {
    conversationId,
    receiverId,
    customerName,
  } = route.params;

  const {
    messages,
    fetchMessages,
    sendChatMessage,
    addIncomingMessage,
  } = useVendorChatDetailStore();

  const { user } = useAuthStore();

  const [text, setText] = useState("");

  useEffect(() => {
    fetchMessages(conversationId);

    const socket = socketService.connect();

    socket.emit(
      "joinConversation",
      conversationId
    );

    socket.on(
      "newMessage",
      addIncomingMessage
    );

    return () => {
      socket.off(
        "newMessage",
        addIncomingMessage
      );
    };
  }, []);

  const handleSend = async () => {
    if (!text.trim()) return;

    await sendChatMessage(
      conversationId,
      receiverId,
      text
    );

    setText("");
  };

  return (
    <SafeAreaView style={styles.container}>

      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          {customerName}
        </Text>
      </View>

      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{
          padding: 15,
        }}
        renderItem={({ item }) => {
          const isMine =
            item.senderId === user?.id;

          return (
            <View
              style={[
                styles.messageContainer,
                isMine
                  ? styles.myMessage
                  : styles.otherMessage,
              ]}
            >
              <Text
                style={[
                  styles.messageText,
                  isMine && {
                    color: "#fff",
                  },
                ]}
              >
                {item.message}
              </Text>

              <Text
                style={[
                  styles.time,
                  isMine && {
                    color: "#ddd",
                  },
                ]}
              >
                {new Date(
                  item.createdAt
                ).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Text>
            </View>
          );
        }}
      />

      <View style={styles.inputContainer}>
        <TextInput
          value={text}
          onChangeText={setText}
          placeholder="Type a message..."
          style={styles.input}
        />

        <TouchableOpacity
          style={styles.sendButton}
          onPress={handleSend}
        >
          <Text
            style={{
              color: "#fff",
              fontWeight: "600",
            }}
          >
            Send
          </Text>
        </TouchableOpacity>
      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F8F8",
  },

  header: {
    padding: 18,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    backgroundColor: "#fff",
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
  },

  messageContainer: {
    padding: 12,
    borderRadius: 18,
    marginBottom: 12,
    maxWidth: "75%",
  },

  myMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#8B5CF6",
  },

  otherMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#fff",
  },

  messageText: {
    fontSize: 15,
    color: "#222",
  },

  time: {
    marginTop: 4,
    fontSize: 10,
    color: "#777",
    alignSelf: "flex-end",
  },

  inputContainer: {
    flexDirection: "row",
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    backgroundColor: "#fff",
  },

  input: {
    flex: 1,
    backgroundColor: "#F2F2F2",
    borderRadius: 25,
    paddingHorizontal: 18,
  },

  sendButton: {
    marginLeft: 10,
    backgroundColor: "#8B5CF6",
    borderRadius: 25,
    paddingHorizontal: 18,
    justifyContent: "center",
  },
});