import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { Conversation } from "../../../store/messagesStore";
import { styles } from "../../../screens/couple/styles/MessagesScreen.styles";

export function ConversationListItem({ conversation, onPress }: { conversation: Conversation; onPress: () => void }) {
  return (
    <TouchableOpacity style={styles.conversationItem} onPress={onPress}>
      <Image source={{ uri: conversation.vendorAvatar }} style={styles.conversationAvatar} />
      <View style={{ flex: 1, marginLeft: 12 }}>
        <View style={styles.conversationTopRow}>
          <Text style={styles.conversationName}>{conversation.vendorName}</Text>
          <Text style={styles.conversationTime}>{conversation.lastMessageTime}</Text>
        </View>
        <Text style={styles.conversationPreview} numberOfLines={1}>
          {conversation.lastMessage}
        </Text>
      </View>
    </TouchableOpacity>
  );
}