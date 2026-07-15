import React from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

export type LegalSection = {
  heading: string;
  body: string;
};

type Props = {
  title: string;
  lastUpdated: string;
  intro?: string;
  sections: LegalSection[];
};

export function LegalPageLayout({ title, lastUpdated, intro, sections }: Props) {
  const navigation = useNavigation<any>();

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={22} color="#3F1D2F" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{title}</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.updatedText}>Last Updated: {lastUpdated}</Text>

        {intro ? <Text style={styles.intro}>{intro}</Text> : null}

        {sections.map((section, index) => (
          <View key={index} style={styles.sectionCard}>
            <Text style={styles.sectionHeading}>{section.heading}</Text>
            <Text style={styles.sectionBody}>{section.body}</Text>
          </View>
        ))}

        <View style={{ height: 20 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFF8F5",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 14,
  },

  backButton: {
    width: 40,
    height: 40,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFEF7",
    borderWidth: 1,
    borderColor: "#FFB3BF",
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#3F1D2F",
  },

  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },

  updatedText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#8D6171",
    marginBottom: 14,
  },

  intro: {
    fontSize: 14,
    color: "#3F1D2F",
    lineHeight: 21,
    marginBottom: 18,
  },

  sectionCard: {
    borderRadius: 18,
    padding: 16,
    backgroundColor: "#FFFEF7",
    borderWidth: 1,
    borderColor: "#FFE6EB",
    marginBottom: 14,
  },

  sectionHeading: {
    fontSize: 15,
    fontWeight: "800",
    color: "#3F1D2F",
    marginBottom: 8,
  },

  sectionBody: {
    fontSize: 13.5,
    color: "#6C2D45",
    lineHeight: 21,
  },
});