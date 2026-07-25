import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { styles } from "./styles/PlanMyWeddingScreen.styles";
import { premiumPlanningApi } from "../../api/premiumPlanning.api";
import { SafeAreaView } from "react-native-safe-area-context";

const VENDOR_OPTIONS = [
  "Venue",
  "Catering",
  "Photography",
  "Decor",
  "Makeup",
  "Music & DJ",
  "Mehendi",
  "Transport",
];

const WEDDING_TYPE_OPTIONS = [
  "Traditional",
  "Destination",
  "Intimate",
  "Royal",
  "Beach",
  "Court Marriage",
  "Multi-day Celebration",
];

const VENUE_PREFERENCE_OPTIONS = [
  "Palace",
  "Resort",
  "Banquet Hall",
  "Lawn / Garden",
  "Beach",
  "Farmhouse",
  "Hotel",
  "Heritage Property",
];

const CITY_OPTIONS = [
  "Lucknow",
  "Delhi",
  "Mumbai",
  "Bengaluru",
  "Hyderabad",
  "Chennai",
  "Kolkata",
  "Pune",
  "Ahmedabad",
  "Jaipur",
  "Surat",
  "Kanpur",
  "Nagpur",
  "Indore",
  "Bhopal",
  "Patna",
  "Vadodara",
  "Agra",
  "Varanasi",
  "Meerut",
  "Rajkot",
  "Amritsar",
  "Allahabad",
  "Ranchi",
  "Gwalior",
  "Chandigarh",
  "Noida",
  "Ghaziabad",
  "Dehradun",
  "Udaipur",
  "Jodhpur",
  "Goa",
];

type Props = {
  onBack: () => void;
  onCreated: () => void;
};

export function PlanMyWeddingForm({ onBack, onCreated }: Props) {
  const [weddingType, setWeddingType] = useState("");
  const [venuePreference, setVenuePreference] = useState("");
  const [budget, setBudget] = useState("");
  const [city, setCity] = useState("");
  const [showCitySuggestions, setShowCitySuggestions] = useState(false);
  const [guestCount, setGuestCount] = useState("");
  const [theme, setTheme] = useState("");
  const [requiredVendors, setRequiredVendors] = useState<string[]>([]);
  const [specialRequirements, setSpecialRequirements] = useState("");

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const toggleVendor = (vendor: string) => {
    setRequiredVendors((prev) =>
      prev.includes(vendor) ? prev.filter((v) => v !== vendor) : [...prev, vendor],
    );
  };

  const citySuggestions = city.trim()
    ? CITY_OPTIONS.filter((option) =>
        option.toLowerCase().startsWith(city.trim().toLowerCase()),
      ).slice(0, 5)
    : [];

  const handleCityChange = (value: string) => {
    setCity(value);
    setShowCitySuggestions(true);
  };

  const handleCitySelect = (value: string) => {
    setCity(value);
    setShowCitySuggestions(false);
  };

  const validate = () => {
    const next: Record<string, string> = {};
    if (!weddingType.trim()) next.weddingType = "Wedding type is required";
    if (!venuePreference.trim()) next.venuePreference = "Venue preference is required";
    if (!budget.trim() || isNaN(Number(budget)) || Number(budget) <= 0)
      next.budget = "Enter a valid budget";
    if (!city.trim()) next.city = "City is required";
    if (!guestCount.trim() || isNaN(Number(guestCount)) || Number(guestCount) <= 0)
      next.guestCount = "Enter a valid guest count";
    if (!theme.trim()) next.theme = "Theme is required";
    if (requiredVendors.length === 0) next.requiredVendors = "Select at least one vendor category";

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setSubmitting(true);
    try {
      await premiumPlanningApi.create({
        weddingType: weddingType.trim(),
        venuePreference: venuePreference.trim(),
        budget: Number(budget),
        city: city.trim(),
        guestCount: Number(guestCount),
        theme: theme.trim(),
        requiredVendors,
        specialRequirements: specialRequirements.trim() || undefined,
      });
      onCreated();
    } catch (error: any) {
      const message =
        error?.response?.data?.message || "Something went wrong. Please try again.";
      Alert.alert("Submission failed", message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.headerBar}>
        <TouchableOpacity style={styles.headerBackButton} onPress={onBack}>
          <MaterialIcons name="arrow-back" size={20} color="#3F1D2F" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Wedding Preferences</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.heroCard}>
          <View style={styles.heroBadge}>
            <MaterialIcons name="auto-awesome" size={16} color="#6C2D45" />
            <Text style={styles.heroBadgeText}>Premium concierge</Text>
          </View>
          <Text style={styles.heroTitle}>Tell us about your big day</Text>
          <Text style={styles.heroSubtitle}>
            Our team will review it, match approved vendors, and prepare a personalized
            quotation.
          </Text>
        </View>

        <View style={styles.formCard}>
          <Text style={styles.fieldLabel}>Wedding type</Text>
          <View style={styles.chipsRow}>
            {WEDDING_TYPE_OPTIONS.map((option) => {
              const selected = weddingType === option;
              return (
                <TouchableOpacity
                  key={option}
                  style={[styles.chip, selected && styles.chipSelected]}
                  onPress={() => setWeddingType(option)}
                >
                  <Text style={[styles.chipText, selected && styles.chipTextSelected]}>
                    {option}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
          {errors.weddingType && <Text style={styles.fieldError}>{errors.weddingType}</Text>}

          <Text style={styles.fieldLabel}>Venue preference</Text>
          <View style={styles.chipsRow}>
            {VENUE_PREFERENCE_OPTIONS.map((option) => {
              const selected = venuePreference === option;
              return (
                <TouchableOpacity
                  key={option}
                  style={[styles.chip, selected && styles.chipSelected]}
                  onPress={() => setVenuePreference(option)}
                >
                  <Text style={[styles.chipText, selected && styles.chipTextSelected]}>
                    {option}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
          {errors.venuePreference && (
            <Text style={styles.fieldError}>{errors.venuePreference}</Text>
          )}

          <Text style={styles.fieldLabel}>City</Text>
          <View style={localStyles.autocompleteWrap}>
            <TextInput
              style={styles.input}
              placeholder="Start typing your city..."
              placeholderTextColor="#B98A96"
              value={city}
              onChangeText={handleCityChange}
              onFocus={() => setShowCitySuggestions(true)}
            />
            {showCitySuggestions && citySuggestions.length > 0 && (
              <View style={localStyles.suggestionsBox}>
                {citySuggestions.map((suggestion) => (
                  <TouchableOpacity
                    key={suggestion}
                    style={localStyles.suggestionItem}
                    onPress={() => handleCitySelect(suggestion)}
                  >
                    <MaterialIcons name="location-on" size={16} color="#6C2D45" />
                    <Text style={localStyles.suggestionText}>{suggestion}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
          {errors.city && <Text style={styles.fieldError}>{errors.city}</Text>}

          <Text style={styles.fieldLabel}>Theme</Text>
          <TextInput
            style={styles.input}
            placeholder="Royal, modern, floral..."
            placeholderTextColor="#B98A96"
            value={theme}
            onChangeText={setTheme}
          />
          {errors.theme && <Text style={styles.fieldError}>{errors.theme}</Text>}

          <Text style={styles.fieldLabel}>Budget (₹)</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. 2500000"
            placeholderTextColor="#B98A96"
            keyboardType="numeric"
            value={budget}
            onChangeText={setBudget}
          />
          {errors.budget && <Text style={styles.fieldError}>{errors.budget}</Text>}

          <Text style={styles.fieldLabel}>Guest count</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. 350"
            placeholderTextColor="#B98A96"
            keyboardType="numeric"
            value={guestCount}
            onChangeText={setGuestCount}
          />
          {errors.guestCount && <Text style={styles.fieldError}>{errors.guestCount}</Text>}

          <Text style={styles.fieldLabel}>Required vendors</Text>
          <View style={styles.chipsRow}>
            {VENDOR_OPTIONS.map((vendor) => {
              const selected = requiredVendors.includes(vendor);
              return (
                <TouchableOpacity
                  key={vendor}
                  style={[styles.chip, selected && styles.chipSelected]}
                  onPress={() => toggleVendor(vendor)}
                >
                  <Text style={[styles.chipText, selected && styles.chipTextSelected]}>
                    {vendor}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
          {errors.requiredVendors && (
            <Text style={styles.fieldError}>{errors.requiredVendors}</Text>
          )}

          <Text style={styles.fieldLabel}>Special requirements (optional)</Text>
          <TextInput
            style={[styles.input, styles.inputMultiline]}
            placeholder="Anything our team should know..."
            placeholderTextColor="#B98A96"
            multiline
            value={specialRequirements}
            onChangeText={setSpecialRequirements}
          />

          <TouchableOpacity
            style={[styles.submitButton, submitting && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={submitting}
          >
            {submitting ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <>
                <MaterialIcons name="send" size={16} color="#FFFFFF" />
                <Text style={styles.submitButtonText}>Submit to planning team</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const localStyles = StyleSheet.create({
  autocompleteWrap: {
    position: "relative",
    zIndex: 10,
  },
  suggestionsBox: {
    marginTop: 4,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E7C9D2",
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  suggestionItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F3E2E7",
  },
  suggestionText: {
    fontSize: 14,
    color: "#3F1D2F",
  },
});