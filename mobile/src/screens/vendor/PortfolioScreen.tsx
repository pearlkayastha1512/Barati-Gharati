import React, { useState } from "react";
import { ScrollView, View, Text, TextInput, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

import { COLORS } from "../../constants/theme";
import { styles } from "./portfolioStyles";
import { useVendorPortfolioStore } from "../../store/vendorPortfolioStore";
import { PORTFOLIO_CATEGORIES } from "../../types/vendorPortfolio";
import { StatCard } from "../../components/vendors/dashboard/StatCard";
import { PortfolioCard } from "../../components/vendors/portfolio/PortfolioCard";
import { PortfolioUploadModal } from "../../components/vendors/portfolio/PortfolioUploadModal";
import { EmptyState } from "../../components/vendors/dashboard/EmptyState";

export default function PortfolioScreen() {
  const navigation = useNavigation<any>();
  const items = useVendorPortfolioStore((state) => state.items);
  const addItem = useVendorPortfolioStore((state) => state.addItem);
  const deleteItem = useVendorPortfolioStore((state) => state.deleteItem);

  const [searchText, setSearchText] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  const totalItems = items.length;
  const categoriesUsed = new Set(items.map((i) => i.category)).size;

  const thisMonthCount = items.filter((i) => {
    const created = new Date(i.createdAt);
    const now = new Date();
    return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear();
  }).length;

  const latestUpload =
    items.length > 0
      ? new Date(
          items.reduce((latest, i) => (i.createdAt > latest ? i.createdAt : latest), items[0].createdAt)
        ).toLocaleDateString("en-IN", { day: "numeric", month: "short" })
      : "--";

  const filteredItems = items.filter(
    (i) =>
      !searchText.trim() ||
      i.title.toLowerCase().includes(searchText.toLowerCase()) ||
      i.category.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <MaterialCommunityIcons name="arrow-left" size={22} color={COLORS.text} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>Portfolio</Text>
          <Text style={styles.headerSubtitle}>Manage your wedding business.</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <LinearGradient colors={[COLORS.gradientStart, COLORS.gradientEnd]} style={styles.heroCard}>
          <View style={styles.heroPill}>
            <MaterialCommunityIcons name="image-multiple-outline" size={13} color="#fff" />
            <Text style={styles.heroPillText}>Portfolio Gallery</Text>
          </View>
          <Text style={styles.heroTitle}>Showcase your{"\n"}best work</Text>
          <Text style={styles.heroSubtitle}>
            Impress couples with beautiful wedding memories and increase bookings through your portfolio.
          </Text>

          <View style={styles.heroStatsRow}>
            <View>
              <Text style={styles.heroStatValue}>{totalItems}</Text>
              <Text style={styles.heroStatLabel}>Total Uploads</Text>
            </View>
            <View>
              <Text style={styles.heroStatValue}>{categoriesUsed}</Text>
              <Text style={styles.heroStatLabel}>Categories</Text>
            </View>
            <View>
              <Text style={styles.heroStatValue}>{latestUpload}</Text>
              <Text style={styles.heroStatLabel}>Latest Upload</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.uploadBtn} onPress={() => setModalVisible(true)}>
            <MaterialCommunityIcons name="upload" size={16} color={COLORS.primary} />
            <Text style={styles.uploadBtnText}>Upload Portfolio</Text>
          </TouchableOpacity>
        </LinearGradient>

        <View style={styles.statsGrid}>
          <StatCard icon="image-multiple-outline" label="Portfolio Items" value={`${totalItems}`} sublabel="Uploaded" />
          <StatCard icon="folder-outline" label="Categories" value={`${categoriesUsed}`} sublabel="Used" />
          <StatCard icon="calendar-outline" label="This Month" value={`${thisMonthCount}`} sublabel="Uploads" />
          <StatCard icon="clock-outline" label="Latest Upload" value={latestUpload} sublabel="Recent Work" />
        </View>

        <View style={styles.searchRow}>
          <View style={styles.searchWrapper}>
            <MaterialCommunityIcons name="magnify" size={18} color={COLORS.textMuted} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search portfolio..."
              placeholderTextColor={COLORS.textLight}
              value={searchText}
              onChangeText={setSearchText}
            />
          </View>
        </View>

        {filteredItems.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyTitle}>No Portfolio Found</Text>
            <Text style={styles.emptySubtitle}>No portfolio items match your current filters.</Text>
          </View>
        ) : (
          <View style={styles.grid}>
            {filteredItems.map((item) => (
              <PortfolioCard key={item.id} item={item} onDelete={() => deleteItem(item.id)} />
            ))}
          </View>
        )}

        <TouchableOpacity style={styles.uploadNewCard} onPress={() => setModalVisible(true)} activeOpacity={0.8}>
          <View style={styles.uploadNewIconCircle}>
            <MaterialCommunityIcons name="cloud-upload-outline" size={26} color={COLORS.primary} />
          </View>
          <Text style={styles.uploadNewTitle}>Upload New Work</Text>
          <Text style={styles.uploadNewSubtitle}>
            Showcase your latest wedding projects with high-quality photos and videos.
          </Text>
          <View style={styles.uploadNewBtn}>
            <Text style={styles.uploadNewBtnText}>Upload Portfolio</Text>
          </View>
        </TouchableOpacity>
      </ScrollView>

      <PortfolioUploadModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSubmit={addItem}
      />
    </SafeAreaView>
  );
}