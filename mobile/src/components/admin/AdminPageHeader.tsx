import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { adminTheme } from "../../constants/adminTheme";

type Props = {
  navigation: any;
  title: string;
  subtitle: string;
  icon: string;
};

export default function AdminPageHeader({ navigation, title, subtitle, icon }: Props) {
  return (
    <View style={styles.header}>
      <TouchableOpacity style={styles.menuButton} onPress={() => navigation.openDrawer()}>
        <Ionicons name="menu" size={25} color={adminTheme.ink} />
      </TouchableOpacity>
      <View style={styles.copy}>
        <Text style={styles.title} numberOfLines={1}>{title}</Text>
        <Text style={styles.subtitle} numberOfLines={1}>{subtitle}</Text>
      </View>
      <View style={styles.iconBox}>
        <Ionicons name={icon as any} size={21} color={adminTheme.primaryDark} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: "row", alignItems: "center", marginBottom: 17 },
  menuButton: { width: 44, height: 44, borderRadius: 15, backgroundColor: adminTheme.surface, borderWidth: 1, borderColor: adminTheme.border, alignItems: "center", justifyContent: "center" },
  copy: { flex: 1, minWidth: 0, marginHorizontal: 11 },
  title: { color: adminTheme.ink, fontSize: 19, lineHeight: 25, fontWeight: "900" },
  subtitle: { color: adminTheme.muted, fontSize: 11, marginTop: 1 },
  iconBox: { width: 42, height: 42, borderRadius: 15, backgroundColor: adminTheme.blush, alignItems: "center", justifyContent: "center" },
});

