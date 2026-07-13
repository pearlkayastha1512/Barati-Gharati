import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from "react-native";
import {
  AudioModule,
  RecordingPresets,
  useAudioRecorder,
} from "expo-audio";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

import { COLORS } from "../../constants/theme";
import { useVendorChatbotStore } from "../../store/vendorChatbotStore";

export default function VendorChatbotScreen() {
  const navigation = useNavigation<any>();

  const flatListRef = useRef<FlatList>(null);

  const [message, setMessage] = useState("");

const [isRecording, setIsRecording] =
  useState(false);

const recorder =
  useAudioRecorder(
    RecordingPresets.HIGH_QUALITY
  );

  const {
  messages,
  loading,
  fetchHistory,
  sendMessage,
  sendVoiceMessage,
} = useVendorChatbotStore();

  useEffect(() => {
    fetchHistory();
  }, []);

  useEffect(() => {
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({
        animated: true,
      });
    }, 100);
  }, [messages]);

  const onSend = async () => {
    if (!message.trim()) return;

    const text = message;

    setMessage("");

    await sendMessage(text);
  };
  const startRecording = async () => {
  try {
    const permission =
      await AudioModule.requestRecordingPermissionsAsync();

    if (!permission.granted) {
      Alert.alert(
        "Permission Required",
        "Please allow microphone permission."
      );
      return;
    }

    await recorder.prepareToRecordAsync();

    recorder.record();

    setIsRecording(true);

  } catch (e) {
    console.log(e);
  }
};

const stopRecording = async () => {
  try {
    await recorder.stop();

    setIsRecording(false);

    const uri = recorder.uri;

    if (uri) {
      await sendVoiceMessage(uri);
    }

  } catch (e) {
    console.log(e);
  }
};

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#FFF5F8",
      }}
    >
      {/* Header */}

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 16,
          paddingVertical: 15,
          backgroundColor: COLORS.primary,
        }}
      >
        <TouchableOpacity
          onPress={() => navigation.goBack()}
        >
          <MaterialCommunityIcons
            name="arrow-left"
            size={26}
            color="#fff"
          />
        </TouchableOpacity>

        <MaterialCommunityIcons
          name="robot-happy-outline"
          size={28}
          color="#fff"
          style={{ marginLeft: 15 }}
        />

        <View style={{ marginLeft: 10 }}>
          <Text
            style={{
              color: "#fff",
              fontSize: 18,
              fontWeight: "700",
            }}
          >
            Vendor Assistant
          </Text>

          <Text
            style={{
              color: "#FFE3EF",
              fontSize: 12,
            }}
          >
            AI powered business assistant
          </Text>
        </View>
      </View>

      {/* Empty State */}

      {messages.length === 0 && !loading ? (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            paddingHorizontal: 30,
          }}
        >
          <MaterialCommunityIcons
            name="robot-happy-outline"
            size={80}
            color={COLORS.primary}
          />

          <Text
            style={{
              marginTop: 20,
              fontSize: 20,
              fontWeight: "700",
              color: COLORS.text,
            }}
          >
            Wedding AI Assistant
          </Text>

          <Text
            style={{
              marginTop: 10,
              textAlign: "center",
              color: "#777",
              fontSize: 15,
              lineHeight: 22,
            }}
          >
            Ask me anything about pricing, leads,
            bookings, packages or growing your
            wedding business.
          </Text>
        </View>
      ) : (
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item, index) =>
            item.id ?? index.toString()
          }
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            padding: 15,
            paddingBottom: 20,
          }}
          renderItem={({ item }) => (
            <View
              style={{
                alignSelf:
                  item.role === "USER"
                    ? "flex-end"
                    : "flex-start",

                backgroundColor:
                  item.role === "USER"
                    ? COLORS.primary
                    : "#fff",

                paddingHorizontal: 15,
                paddingVertical: 12,

                marginBottom: 10,

                borderRadius: 18,

                maxWidth: "80%",

                elevation: 2,

                shadowColor: "#000",

                shadowOpacity: 0.08,

                shadowRadius: 3,
              }}
            >
              <Text
                style={{
                  color:
                    item.role === "USER"
                      ? "#fff"
                      : COLORS.text,

                  fontSize: 15,

                  lineHeight: 22,
                }}
              >
                {item.content}
              </Text>
            </View>
          )}
        />
      )}

      {/* Typing Indicator */}

      {loading && (
        <View
          style={{
            alignSelf: "flex-start",

            backgroundColor: "#fff",

            paddingHorizontal: 18,
            paddingVertical: 12,

            borderRadius: 18,

            marginHorizontal: 15,

            marginBottom: 10,

            elevation: 2,
          }}
        >
          <ActivityIndicator
            color={COLORS.primary}
          />
        </View>
      )}

      {/* Input */}
      {isRecording && (
  <View
    style={{
      alignItems: "center",
      paddingVertical: 8,
    }}
  >
    <Text
      style={{
        color: "#ff3b30",
        fontWeight: "700",
      }}
    >
      🎤 Recording...
    </Text>
  </View>
)}

      <KeyboardAvoidingView
        behavior={
          Platform.OS === "ios"
            ? "padding"
            : undefined
        }
      >
        <View
          style={{
            flexDirection: "row",

            alignItems: "center",

            padding: 10,

            borderTopWidth: 1,

            borderColor: "#F0F0F0",

            backgroundColor: "#fff",
          }}
        >
         <TextInput
  value={message}
  onChangeText={setMessage}
  placeholder="Ask your assistant..."
  placeholderTextColor="#999"
  multiline
  style={{
    flex: 1,
    minHeight: 48,
    maxHeight: 120,
    backgroundColor: "#F7F7F7",
    borderRadius: 25,
    paddingHorizontal: 18,
    paddingVertical: 12,
    fontSize: 15,
  }}
/>

<TouchableOpacity
  onPress={
    isRecording
      ? stopRecording
      : startRecording
  }
  style={{
    marginHorizontal: 10,
  }}
>
  <MaterialCommunityIcons
    name={
      isRecording
        ? "stop-circle"
        : "microphone"
    }
    size={34}
    color={
      isRecording
        ? "#ff3b30"
        : COLORS.primary
    }
  />
</TouchableOpacity>

<TouchableOpacity
  onPress={onSend}
  disabled={loading}
  style={{
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
  }}
>
  <MaterialCommunityIcons
    name="send"
    size={22}
    color="#fff"
  />
</TouchableOpacity>
           
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}