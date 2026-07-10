import React, { useState } from "react";
import { Modal, View, Text, TextInput, TouchableOpacity, ScrollView, Platform } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { styles } from "./BookVendorModal.styles";

// TODO: replace with real packages once Package/Service API is connected.
// `price` should come from whatever the vendor uploaded for this service.
type PackageOption = { name: string; price: number };

type Props = {
  visible: boolean;
  onClose: () => void;
  vendorName: string;
  packages: PackageOption[]; // the vendor's uploaded services (e.g. DJ, Catering, Decor plans)
  onSubmit: (data: {
    brideName: string;
    groomName: string;
    phone: string;
    email: string;
    partnerEmail: string;
    partnerPhone: string;
    partnerOccupation: string;
    weddingTheme: string;
    weddingDate: string;
    packageName: string;
    estimatedPrice: number;
  }) => void;
};

const WEDDING_THEMES = ["Traditional", "Royal", "Minimal"];

// --- small date helpers (dd-mm-yyyy <-> Date), kept local to this file ---
function parseDMY(value: string): Date | null {
  if (!value) return null;
  const [dd, mm, yyyy] = value.split("-");
  if (!dd || !mm || !yyyy) return null;
  const date = new Date(Number(yyyy), Number(mm) - 1, Number(dd));
  return isNaN(date.getTime()) ? null : date;
}

function formatDMY(date: Date): string {
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const yyyy = date.getFullYear();
  return `${dd}-${mm}-${yyyy}`;
}

// IMPORTANT: every field component below is defined at module scope (outside
// BookVendorModal). If they were defined inside the modal's function body instead,
// each keystroke/state change would redefine them as brand-new component types and
// React would unmount + remount the underlying inputs — which is what causes a
// TextInput to lose focus (keyboard closing) after a single character.

// Native calendar picker via @react-native-community/datetimepicker.
function DatePickerField({
  value,
  onChangeText,
}: {
  value: string; // dd-mm-yyyy
  onChangeText: (v: string) => void;
}) {
  const [showPicker, setShowPicker] = useState(false);
  const dateValue = parseDMY(value) ?? new Date();

  const handleChange = (event: DateTimePickerEvent, selected?: Date) => {
    // Android auto-closes after one tap; iOS keeps the picker open until dismissed
    if (Platform.OS === "android") setShowPicker(false);
    if (event.type === "dismissed") return;
    if (selected) onChangeText(formatDMY(selected));
  };

  return (
    <View>
      <Text style={styles.label}>💍 Wedding Date</Text>
      <TouchableOpacity style={styles.input} onPress={() => setShowPicker(true)}>
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
          <Text style={{ color: value ? "#1A1A1A" : "#999", fontSize: 14 }}>
            {value || "dd-mm-yyyy"}
          </Text>
          <MaterialIcons name="calendar-today" size={16} color="#C2185B" />
        </View>
      </TouchableOpacity>

      {showPicker && (
        <DateTimePicker
          value={dateValue}
          mode="date"
          display={Platform.OS === "ios" ? "inline" : "default"}
          minimumDate={new Date()}
          onChange={handleChange}
        />
      )}

      {/* iOS inline picker doesn't auto-dismiss, so give it a Done button */}
      {Platform.OS === "ios" && showPicker && (
        <TouchableOpacity
          style={{ alignSelf: "flex-end", paddingVertical: 6, paddingHorizontal: 4 }}
          onPress={() => setShowPicker(false)}
        >
          <Text style={{ color: "#C2185B", fontWeight: "700" }}>Done</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

// Simple dropdown, reused for Wedding Theme.
function ThemeDropdown({
  value,
  onSelect,
}: {
  value: string;
  onSelect: (v: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <View>
      <Text style={styles.label}>Wedding Theme</Text>
      <TouchableOpacity style={styles.input} onPress={() => setIsOpen((prev) => !prev)}>
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
          <Text style={{ color: value ? "#1A1A1A" : "#999", fontSize: 14 }}>
            {value || "Select theme"}
          </Text>
          <MaterialIcons name={isOpen ? "keyboard-arrow-up" : "keyboard-arrow-down"} size={18} color="#666" />
        </View>
      </TouchableOpacity>

      {isOpen && (
        <View style={{ marginTop: 6, borderWidth: 1, borderColor: "#E0E0E0", borderRadius: 10, overflow: "hidden" }}>
          {WEDDING_THEMES.map((theme) => {
            const isActive = theme === value;
            return (
              <TouchableOpacity
                key={theme}
                onPress={() => {
                  onSelect(theme);
                  setIsOpen(false);
                }}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  paddingHorizontal: 12,
                  paddingVertical: 10,
                  backgroundColor: isActive ? "#FCE4EC" : "#fff",
                  borderBottomWidth: 1,
                  borderBottomColor: "#F1F1F1",
                }}
              >
                <Text style={{ fontSize: 13, color: isActive ? "#C2185B" : "#333", fontWeight: isActive ? "700" : "400" }}>
                  {theme}
                </Text>
                {isActive && <MaterialIcons name="check" size={16} color="#C2185B" />}
              </TouchableOpacity>
            );
          })}
        </View>
      )}
    </View>
  );
}

// Scrollable dropdown of the vendor's uploaded services/packages (replaces the old chip row).
function ServicePackagePicker({
  packages,
  selectedPackage,
  onSelect,
}: {
  packages: PackageOption[];
  selectedPackage: string;
  onSelect: (name: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const selected = packages.find((p) => p.name === selectedPackage) ?? null;

  return (
    <View>
      <Text style={styles.label}>📦 Package</Text>
      <TouchableOpacity
        style={styles.input}
        onPress={() => setIsOpen((prev) => !prev)}
        disabled={packages.length === 0}
      >
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
          <Text style={{ color: selected ? "#1A1A1A" : "#999", fontSize: 14 }}>
            {selected
              ? `${selected.name} · ₹${selected.price.toLocaleString("en-IN")}`
              : packages.length === 0
              ? "No services available"
              : "Select a service"}
          </Text>
          <MaterialIcons name={isOpen ? "keyboard-arrow-up" : "keyboard-arrow-down"} size={18} color="#666" />
        </View>
      </TouchableOpacity>

      {isOpen && packages.length > 0 && (
        <ScrollView
          style={{ marginTop: 6, maxHeight: 160, borderWidth: 1, borderColor: "#E0E0E0", borderRadius: 10 }}
          nestedScrollEnabled
        >
          {packages.map((pkg) => {
            const isActive = pkg.name === selectedPackage;
            return (
              <TouchableOpacity
                key={pkg.name}
                onPress={() => {
                  onSelect(pkg.name);
                  setIsOpen(false);
                }}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  paddingHorizontal: 12,
                  paddingVertical: 10,
                  backgroundColor: isActive ? "#FCE4EC" : "#fff",
                  borderBottomWidth: 1,
                  borderBottomColor: "#F1F1F1",
                }}
              >
                <Text style={{ fontSize: 13, color: "#1A1A1A", fontWeight: isActive ? "700" : "500" }}>
                  {pkg.name}
                </Text>
                <Text style={{ fontSize: 12, color: "#999" }}>
                  ₹{pkg.price.toLocaleString("en-IN")}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      )}
    </View>
  );
}

export function BookVendorModal({ visible, onClose, vendorName, packages, onSubmit }: Props) {
  const [brideName, setBrideName] = useState("");
  const [groomName, setGroomName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [partnerEmail, setPartnerEmail] = useState("");
  const [partnerPhone, setPartnerPhone] = useState("");
  const [partnerOccupation, setPartnerOccupation] = useState("");
  const [weddingTheme, setWeddingTheme] = useState("");
  const [weddingDate, setWeddingDate] = useState("");
  const [selectedPackage, setSelectedPackage] = useState(packages[0]?.name ?? "");

  const selectedPackagePrice = packages.find((p) => p.name === selectedPackage)?.price ?? 0;

  const requiredFieldsFilled =
    brideName.trim() && groomName.trim() && phone.trim() && email.trim() && weddingDate.trim() && selectedPackage;

  const resetForm = () => {
    setBrideName("");
    setGroomName("");
    setPhone("");
    setEmail("");
    setPartnerEmail("");
    setPartnerPhone("");
    setPartnerOccupation("");
    setWeddingTheme("");
    setWeddingDate("");
    setSelectedPackage(packages[0]?.name ?? "");
  };

  const handleSubmit = () => {
    if (!requiredFieldsFilled) return;
    onSubmit({
      brideName: brideName.trim(),
      groomName: groomName.trim(),
      phone: phone.trim(),
      email: email.trim(),
      partnerEmail: partnerEmail.trim(),
      partnerPhone: partnerPhone.trim(),
      partnerOccupation: partnerOccupation.trim(),
      weddingTheme: weddingTheme.trim(),
      weddingDate: weddingDate.trim(),
      packageName: selectedPackage,
      estimatedPrice: selectedPackagePrice,
    });
    resetForm();
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.card}>
          <View style={styles.header}>
            <View>
              <Text style={styles.title}>Book Vendor</Text>
              <Text style={styles.subtitle}>
                Complete your booking details for <Text style={styles.subtitleBold}>{vendorName}</Text>
              </Text>
            </View>
            <TouchableOpacity onPress={onClose}>
              <MaterialIcons name="close" size={22} color="#666" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.formScroll} showsVerticalScrollIndicator={false}>
            <View style={styles.row}>
              <View style={styles.halfField}>
                <Text style={styles.label}>👰 Bride Name</Text>
                <TextInput style={styles.input} placeholder="Bride Name" placeholderTextColor="#999" value={brideName} onChangeText={setBrideName} />
              </View>
              <View style={styles.halfField}>
                <Text style={styles.label}>🤵 Groom Name</Text>
                <TextInput style={styles.input} placeholder="Groom Name" placeholderTextColor="#999" value={groomName} onChangeText={setGroomName} />
              </View>
            </View>

            <View style={styles.row}>
              <View style={styles.halfField}>
                <Text style={styles.label}>📞 Phone</Text>
                <TextInput style={styles.input} placeholder="Phone Number" placeholderTextColor="#999" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
              </View>
              <View style={styles.halfField}>
                <Text style={styles.label}>📧 Email</Text>
                <TextInput style={styles.input} placeholder="Email Address" placeholderTextColor="#999" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
              </View>
            </View>

            <View style={styles.row}>
              <View style={styles.halfField}>
                <Text style={styles.label}>Partner Email</Text>
                <TextInput style={styles.input} placeholder="Partner Email" placeholderTextColor="#999" value={partnerEmail} onChangeText={setPartnerEmail} keyboardType="email-address" autoCapitalize="none" />
              </View>
              <View style={styles.halfField}>
                <Text style={styles.label}>Partner Phone</Text>
                <TextInput style={styles.input} placeholder="Partner Phone" placeholderTextColor="#999" value={partnerPhone} onChangeText={setPartnerPhone} keyboardType="phone-pad" />
              </View>
            </View>

            <View style={styles.row}>
              <View style={styles.halfField}>
                <Text style={styles.label}>Partner Occupation</Text>
                <TextInput style={styles.input} placeholder="Partner Occupation" placeholderTextColor="#999" value={partnerOccupation} onChangeText={setPartnerOccupation} />
              </View>
              <View style={styles.halfField}>
                <ThemeDropdown value={weddingTheme} onSelect={setWeddingTheme} />
              </View>
            </View>

            <View style={styles.row}>
              <View style={styles.halfField}>
                <DatePickerField value={weddingDate} onChangeText={setWeddingDate} />
              </View>
              <View style={styles.halfField}>
                <ServicePackagePicker
                  packages={packages}
                  selectedPackage={selectedPackage}
                  onSelect={setSelectedPackage}
                />
              </View>
            </View>
          </ScrollView>

          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Estimated Price</Text>
            <Text style={styles.priceValue}>₹{selectedPackagePrice.toLocaleString("en-IN")}</Text>
          </View>

          <TouchableOpacity
            style={[styles.submitButton, !requiredFieldsFilled && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={!requiredFieldsFilled}
          >
            <Text style={styles.submitButtonText}>
              {requiredFieldsFilled ? "Confirm Booking" : "Fill all required fields"}
            </Text>
          </TouchableOpacity>
          {!requiredFieldsFilled && (
            <Text style={styles.validationHint}>
              Please fill in Bride Name, Groom Name, Phone, Email, Wedding Date, and a Package to continue.
            </Text>
          )}
        </View>
      </View>
    </Modal>
  );
}