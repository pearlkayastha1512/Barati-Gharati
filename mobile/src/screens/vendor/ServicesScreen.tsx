import { View, Text, ScrollView, TextInput, TouchableOpacity, Modal, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { COLORS } from "../../constants/theme";
import {
  useVendorServicesStore, VendorServiceRecord, ServiceCategory, SERVICE_CATEGORIES,
} from "../../store/vendorServicesStore";
import { StatCard } from "../../components/vendors/dashboard/StatCard";
import { ServiceCard } from "../../components/vendors/services/ServiceCard";
import { ServiceFormModal } from "../../components/vendors/services/ServiceFormModal";
import { EmptyState } from "../../components/vendors/dashboard/EmptyState";
import { styles } from "./servicesScreenStyles";  // ✅ the one you pasted, has everything
import React, { useState, useEffect } from "react";
import { Alert } from "react-native";

export default function ServicesScreen() {
  const services = useVendorServicesStore((state) => state.services);
  const addService = useVendorServicesStore((state) => state.addService);
  const updateService = useVendorServicesStore((state) => state.updateService);
  const deleteService = useVendorServicesStore((state) => state.deleteService);

  const [searchText, setSearchText] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [editingService, setEditingService] = useState<VendorServiceRecord | null>(null);

  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory | "All">("All");
  const [categoryModalVisible, setCategoryModalVisible] = useState(false);

  const fetchServices = useVendorServicesStore(
  (state) => state.fetchServices
);
useEffect(() => {
  const loadServices = async () => {
    await fetchServices();
  };

  loadServices();
}, [fetchServices]);

  const totalServices = services.length;
  const activeServices = services.filter((s) => s.status === "Active").length;
  const avgPrice =
    services.length > 0
      ? Math.round(services.reduce((sum, s) => sum + s.price, 0) / services.length)
      : 0;
  const lowestPrice = services.length > 0 ? Math.min(...services.map((s) => s.price)) : 0;
  const servicesWithReviews = services.filter((s) => s.reviewsCount > 0);
const avgRating =
  servicesWithReviews.length > 0
    ? (servicesWithReviews.reduce((sum, s) => sum + s.rating, 0) / servicesWithReviews.length).toFixed(1)
    : "0.0";
  const totalReviews = services.reduce((sum, s) => sum + s.reviewsCount, 0);

  const filteredServices = services.filter((s) => {
    const matchesSearch =
      !searchText.trim() ||
      s.serviceName.toLowerCase().includes(searchText.toLowerCase()) ||
      s.category.toLowerCase().includes(searchText.toLowerCase());

    const matchesCategory =
      selectedCategory === "All" || s.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const openCreateModal = () => {
    setEditingService(null);
    setModalVisible(true);
  };

  const openEditModal = (service: VendorServiceRecord) => {
    setEditingService(service);
    setModalVisible(true);
  };
const handleSubmit = async (data: {
  serviceName: string;
  category: ServiceCategory;
  description: string;
  duration: string;
  price: number;
  image: string | null;
}) => {
  const result = editingService
    ? await updateService(editingService.id, data)
    : await addService(data);

  if (!result.success) {
    return result;
  }

  setModalVisible(false);
  setEditingService(null);
  return result;
};
  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Vendor Dashboard</Text>
        <Text style={styles.headerSubtitle}>Manage your wedding business.</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <LinearGradient colors={[COLORS.gradientStart, COLORS.gradientEnd]} style={styles.heroCard}>
          <View style={styles.heroPill}>
            <MaterialCommunityIcons name="briefcase-outline" size={13} color="#fff" />
            <Text style={styles.heroPillText}>Services Dashboard</Text>
          </View>
          <Text style={styles.heroTitle}>Manage your{"\n"}wedding services.</Text>
          <Text style={styles.heroSubtitle}>
            Create, update and organize all your wedding services from one place.
          </Text>

          <TouchableOpacity style={styles.addServiceBtn} onPress={openCreateModal}>
            <MaterialCommunityIcons name="plus" size={16} color={COLORS.primary} />
            <Text style={styles.addServiceBtnText}>Add Service</Text>
          </TouchableOpacity>
        </LinearGradient>

        <View style={styles.statsGrid}>
          <StatCard icon="briefcase-outline" label="Services" value={`${totalServices}`} sublabel="Total Services" />
          <StatCard icon="star-outline" label="Rating" value={avgRating} sublabel={`${totalReviews} Reviews`} />
          <StatCard icon="trending-up" label="Average Price" value={`₹${avgPrice.toLocaleString("en-IN")}`} sublabel="Per Service" />
          <StatCard icon="currency-inr" label="Starting From" value={`₹${lowestPrice.toLocaleString("en-IN")}`} sublabel="Lowest Price" />
        </View>

        <View style={styles.searchFilterRow}>
          <View style={styles.searchWrapper}>
            <MaterialCommunityIcons name="magnify" size={18} color={COLORS.textMuted} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search service..."
              placeholderTextColor={COLORS.textLight}
              value={searchText}
              onChangeText={setSearchText}
            />
          </View>

          <TouchableOpacity
            style={styles.categoryFilterBtn}
            onPress={() => setCategoryModalVisible(true)}
            activeOpacity={0.8}
          >
            <Text style={styles.categoryFilterBtnText} numberOfLines={1}>
              {selectedCategory}
            </Text>
            <MaterialCommunityIcons name="chevron-down" size={18} color={COLORS.primary} />
          </TouchableOpacity>
        </View>

        {filteredServices.length === 0 ? (
          <EmptyState icon="briefcase-outline" message="No services found." />
        ) : (
          filteredServices.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              onEdit={() => openEditModal(service)}
             onDelete={() =>
  Alert.alert(
    "Delete Service",
    "Are you sure you want to delete this service?",
    [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
  try {
    await deleteService(service.id);
    Alert.alert("Success", "Service deleted successfully.");
  } catch {
    Alert.alert("Error", "Failed to delete service.");
  }
},
      },
    ]
  )
}
            />
          ))
        )}

        <TouchableOpacity style={styles.addNewCard} onPress={openCreateModal} activeOpacity={0.8}>
          <View style={styles.addNewIconCircle}>
            <MaterialCommunityIcons name="plus" size={22} color={COLORS.primary} />
          </View>
          <Text style={styles.addNewTitle}>Add New Service</Text>
          <Text style={styles.addNewSubtitle}>
            Create a new wedding service with pricing, description, gallery and availability.
          </Text>
          <View style={styles.createServiceBtn}>
            <Text style={styles.createServiceBtnText}>Create Service</Text>
          </View>
        </TouchableOpacity>
      </ScrollView>

      <ServiceFormModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSubmit={handleSubmit}
        initialService={editingService}
      />

      <Modal
        visible={categoryModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setCategoryModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.categoryModalOverlay}
          activeOpacity={1}
          onPress={() => setCategoryModalVisible(false)}
        >
          <View style={styles.categoryModalCard}>
            <FlatList
              data={["All", ...SERVICE_CATEGORIES] as (ServiceCategory | "All")[]}
              keyExtractor={(item) => item}
              style={styles.categoryModalList}
              renderItem={({ item }) => {
                const isSelected = item === selectedCategory;
                return (
                  <TouchableOpacity
                    style={[
                      styles.categoryModalItem,
                      isSelected && styles.categoryModalItemSelected,
                    ]}
                    onPress={() => {
                      setSelectedCategory(item);
                      setCategoryModalVisible(false);
                    }}
                  >
                    <Text
                      style={[
                        styles.categoryModalItemText,
                        isSelected && styles.categoryModalItemTextSelected,
                      ]}
                    >
                      {item === "All" ? "All Categories" : item}
                    </Text>
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}
