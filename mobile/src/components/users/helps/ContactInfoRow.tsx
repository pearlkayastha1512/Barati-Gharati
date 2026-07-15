import React from "react";
import { View, Text, TouchableOpacity, Linking, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

type Props = {
  icon: keyof typeof MaterialIcons.glyphMap;
  label: string;
  lines: string[];
  isLast?: boolean;
};

export function ContactInfoRow({ icon, label, lines, isLast }: Props) {
  const isPhone = label.toLowerCase() === "phone";
  const isEmail = label.toLowerCase() === "email";
  const isTappable = isPhone || isEmail;

  const handlePress = () => {
    if (isPhone) {
      Linking.openURL(`tel:${lines[0].replace(/\s+/g, "")}`);
    } else if (isEmail) {
      Linking.openURL(`mailto:${lines[0]}`);
    }
  };

  const Wrapper = isTappable ? TouchableOpacity : View;

  return (
    <Wrapper
      style={[styles.row, !isLast && styles.rowDivider]}
      {...(isTappable ? { onPress: handlePress, activeOpacity: 0.7 } : {})}
    >
      <View style={styles.iconCircle}>
        <MaterialIcons name={icon} size={19} color="#FF4D6D" />
      </View>

      <View style={styles.copy}>
        <Text style={styles.label}>{label}</Text>
        {lines.map((line, index) => (
          <Text key={index} style={styles.line}>
            {line}
          </Text>
        ))}
      </View>

      {isTappable && (
        <MaterialIcons name="chevron-right" size={20} color="#FFB3BF" />
      )}
    </Wrapper>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: 14,
    gap: 12,
  },

  rowDivider: {
    borderBottomWidth: 1,
    borderBottomColor: "#FFE6EB",
  },

  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: "#FFE6EB",
    alignItems: "center",
    justifyContent: "center",
  },

  copy: {
    flex: 1,
  },

  label: {
    fontSize: 11,
    fontWeight: "700",
    color: "#8D6171",
    marginBottom: 3,
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },

  line: {
    fontSize: 14,
    fontWeight: "600",
    color: "#3F1D2F",
    lineHeight: 20,
  },
});