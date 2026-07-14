import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Conversation } from "../../../store/messagesStore";
import { styles } from "../../../screens/couple/styles/MessagesScreen.styles";

export function ConversationListItem({ conversation, onPress }: { conversation: Conversation; onPress: () => void }) {
  const [imageFailed, setImageFailed] = useState(false);

  return (
    <TouchableOpacity
      activeOpacity={0.82}
      style={styles.conversationItem}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Open conversation with ${conversation.vendorName}`}
    >
      <View style={styles.avatarWrapper}>
        {imageFailed || !conversation.vendorAvatar ? (
          <View style={styles.avatarFallback}>
            <MaterialIcons name="storefront" size={24} color="#ff4d6d" />
          </View>
        ) : (
          <Image
            source={{ uri: conversation.vendorAvatar }}
            style={styles.conversationAvatar}
            onError={() => setImageFailed(true)}
          />
        )}
      </View>

      <View style={styles.conversationCopy}>
        <View style={styles.conversationTopRow}>
          <Text style={styles.conversationName} numberOfLines={1}>
            {conversation.vendorName}
          </Text>
          {!!conversation.lastMessageTime && (
            <Text style={styles.conversationTime}>{conversation.lastMessageTime}</Text>
          )}
        </View>
        <Text style={styles.conversationPreview} numberOfLines={1}>
          {conversation.lastMessage || "Start a conversation"}
        </Text>
      </View>

      <View style={styles.openConversationButton}>
        <MaterialIcons name="chevron-right" size={20} color="#d4145a" />
      </View>
    </TouchableOpacity>
  );
}
