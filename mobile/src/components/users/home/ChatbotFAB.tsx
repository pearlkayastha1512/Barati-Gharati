import React from "react";
import { TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { styles } from "./ChatbotFAB.styles";

export function ChatbotFAB({ onPress }: { onPress: () => void }) {
  return (
    <TouchableOpacity style={styles.fab} onPress={onPress} activeOpacity={0.85}>
      <MaterialIcons name="smart-toy" size={26} color="#fff" />
    </TouchableOpacity>
  );
}