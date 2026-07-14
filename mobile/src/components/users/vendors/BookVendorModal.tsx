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
    eventType: string;
    eventTitle: string;
    primaryPersonName: string;
    primaryPersonAge?: number;
    brideName: string;
    groomName: string;
    phone: string;
    email: string;
    partnerEmail: string;
    partnerPhone: string;
    partnerOccupation: string;
    weddingTheme: string;
    weddingDate: string;
    guests: number;
    address: string;
    state: string;
    country: string;
    specialRequirements: string;
    packageName: string;
    estimatedPrice: number;
  }) => Promise<boolean>;
};

const WEDDING_THEMES = ["Traditional", "Royal", "Minimal"];
const EVENT_TYPES = [
  "Wedding", "Engagement", "Anniversary", "Birthday", "Kids Birthday",
  "Baby Shower", "Birth Celebration", "Naming Ceremony", "Mundan",
  "Housewarming", "Retirement Party", "Graduation Party", "Corporate Event",
  "Other Celebration",
];
const COUPLE_EVENTS = ["Wedding", "Engagement", "Anniversary"];

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
      <Text style={styles.label}>Event Date</Text>
      <TouchableOpacity style={styles.input} onPress={() => setShowPicker(true)}>
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
          <Text style={{ color: value ? "#1A1A1A" : "#999", fontSize: 14 }}>
            {value || "dd-mm-yyyy"}
          </Text>
          <MaterialIcons name="calendar-today" size={16} color="#FF4D6D" />
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
          <Text style={{ color: "#FF4D6D", fontWeight: "700" }}>Done</Text>
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
                <Text style={{ fontSize: 13, color: isActive ? "#FF4D6D" : "#3F1D2F", fontWeight: isActive ? "700" : "400" }}>
                  {theme}
                </Text>
                {isActive && <MaterialIcons name="check" size={16} color="#FF4D6D" />}
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
  const [eventType, setEventType] = useState("Wedding");
  const [eventTypeOpen, setEventTypeOpen] = useState(false);
  const [eventTitle, setEventTitle] = useState("");
  const [primaryPersonName, setPrimaryPersonName] = useState("");
  const [primaryPersonAge, setPrimaryPersonAge] = useState("");
  const [brideName, setBrideName] = useState("");
  const [groomName, setGroomName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [partnerEmail, setPartnerEmail] = useState("");
  const [partnerPhone, setPartnerPhone] = useState("");
  const [partnerOccupation, setPartnerOccupation] = useState("");
  const [weddingTheme, setWeddingTheme] = useState("");
  const [weddingDate, setWeddingDate] = useState("");
  const [guests, setGuests] = useState("");
  const [address, setAddress] = useState("");
  const [contactState, setContactState] = useState("");
  const [country, setCountry] = useState("");
  const [specialRequirements, setSpecialRequirements] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(packages[0]?.name ?? "");

  const selectedPackagePrice = packages.find((p) => p.name === selectedPackage)?.price ?? 0;

  const requiredFieldsFilled =
    primaryPersonName.trim() && phone.trim() && email.trim() && weddingDate.trim() && selectedPackage;

  const resetForm = () => {
    setEventType("Wedding");
    setEventTitle("");
    setPrimaryPersonName("");
    setPrimaryPersonAge("");
    setBrideName("");
    setGroomName("");
    setPhone("");
    setEmail("");
    setPartnerEmail("");
    setPartnerPhone("");
    setPartnerOccupation("");
    setWeddingTheme("");
    setWeddingDate("");
    setGuests("");
    setAddress("");
    setContactState("");
    setCountry("");
    setSpecialRequirements("");
    setSelectedPackage(packages[0]?.name ?? "");
  };

  const handleSubmit = async () => {
    if (!requiredFieldsFilled) return;
    setSubmitting(true);
    const created = await onSubmit({
      eventType,
      eventTitle: eventTitle.trim(),
      primaryPersonName: primaryPersonName.trim(),
      primaryPersonAge: primaryPersonAge ? Number(primaryPersonAge) : undefined,
      brideName: brideName.trim(),
      groomName: groomName.trim(),
      phone: phone.trim(),
      email: email.trim(),
      partnerEmail: partnerEmail.trim(),
      partnerPhone: partnerPhone.trim(),
      partnerOccupation: partnerOccupation.trim(),
      weddingTheme: weddingTheme.trim(),
      weddingDate: weddingDate.trim(),
      guests: Number(guests) || 0,
      address: address.trim(),
      state: contactState.trim(),
      country: country.trim(),
      specialRequirements: specialRequirements.trim(),
      packageName: selectedPackage,
      estimatedPrice: selectedPackagePrice,
    });
    setSubmitting(false);
    if (!created) return;
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
              <MaterialIcons name="close" size={22} color="#3F1D2F" />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.formScroll}
            contentContainerStyle={styles.formContent}
            showsVerticalScrollIndicator
            nestedScrollEnabled
            scrollEnabled={!eventTypeOpen}
            keyboardShouldPersistTaps="handled"
          >
            <View style={{ marginBottom: 14 }}>
              <Text style={styles.label}>Event Type</Text>
              <TouchableOpacity style={styles.input} onPress={() => setEventTypeOpen((open) => !open)}>
                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                  <Text>{eventType}</Text>
                  <MaterialIcons name={eventTypeOpen ? "keyboard-arrow-up" : "keyboard-arrow-down"} size={18} color="#666" />
                </View>
              </TouchableOpacity>
              {eventTypeOpen && (
                <ScrollView
                  style={styles.dropdownBox}
                  contentContainerStyle={styles.dropdownContent}
                  nestedScrollEnabled
                  showsVerticalScrollIndicator
                  keyboardShouldPersistTaps="handled"
                >
                  {EVENT_TYPES.map((type) => (
                    <TouchableOpacity
                      key={type}
                      style={styles.dropdownOption}
                      onPress={() => {
                        setEventType(type);
                        setEventTypeOpen(false);
                      }}
                    >
                      <Text style={{ color: type === eventType ? "#FF4D6D" : "#3F1D2F", fontWeight: type === eventType ? "700" : "400" }}>
                        {type}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              )}
            </View>

            <View style={styles.row}>
              <View style={styles.halfField}>
                <Text style={styles.label}>Celebrant / Primary Person *</Text>
                <TextInput style={styles.input} placeholder="Name of the person being celebrated" placeholderTextColor="#999" value={primaryPersonName} onChangeText={setPrimaryPersonName} />
              </View>
              <View style={styles.halfField}>
                <Text style={styles.label}>Event Title</Text>
                <TextInput style={styles.input} placeholder="Aarav's Birthday, Annual Party..." placeholderTextColor="#999" value={eventTitle} onChangeText={setEventTitle} />
              </View>
            </View>

            {["Birthday", "Kids Birthday", "Birth Celebration", "Naming Ceremony", "Mundan", "Retirement Party"].includes(eventType) && (
              <View style={{ marginBottom: 14 }}>
                <Text style={styles.label}>Age (Optional)</Text>
                <TextInput style={styles.input} placeholder="Age" placeholderTextColor="#999" value={primaryPersonAge} onChangeText={setPrimaryPersonAge} keyboardType="number-pad" />
              </View>
            )}

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

            {COUPLE_EVENTS.includes(eventType) && <>
              <View style={styles.optionalSection}>
                <Text style={styles.optionalTitle}>Couple Details</Text>
                <Text style={styles.optionalSubtitle}>Optional for this booking</Text>
              </View>
              <View style={styles.row}>
                <View style={styles.halfField}>
                  <Text style={styles.label}>Bride Name (Optional)</Text>
                  <TextInput style={styles.input} placeholder="Bride Name" placeholderTextColor="#999" value={brideName} onChangeText={setBrideName} />
                </View>
                <View style={styles.halfField}>
                  <Text style={styles.label}>Groom Name (Optional)</Text>
                  <TextInput style={styles.input} placeholder="Groom Name" placeholderTextColor="#999" value={groomName} onChangeText={setGroomName} />
                </View>
              </View>
              <View style={styles.row}>
                <View style={styles.halfField}>
                  <Text style={styles.label}>Partner Email (Optional)</Text>
                  <TextInput style={styles.input} placeholder="Partner Email" placeholderTextColor="#999" value={partnerEmail} onChangeText={setPartnerEmail} keyboardType="email-address" autoCapitalize="none" />
                </View>
                <View style={styles.halfField}>
                  <Text style={styles.label}>Partner Phone (Optional)</Text>
                  <TextInput style={styles.input} placeholder="Partner Phone" placeholderTextColor="#999" value={partnerPhone} onChangeText={setPartnerPhone} keyboardType="phone-pad" />
                </View>
              </View>
              <View style={styles.row}>
                <View style={styles.halfField}>
                  <Text style={styles.label}>Partner Occupation (Optional)</Text>
                  <TextInput style={styles.input} placeholder="Partner Occupation" placeholderTextColor="#999" value={partnerOccupation} onChangeText={setPartnerOccupation} />
                </View>
                <View style={styles.halfField}>
                  <Text style={styles.label}>Event Theme (Optional)</Text>
                  <TextInput style={styles.input} placeholder="Traditional, superhero, floral..." placeholderTextColor="#999" value={weddingTheme} onChangeText={setWeddingTheme} />
                </View>
              </View>
            </>}

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

            <View style={styles.row}>
              <View style={styles.halfField}>
                <Text style={styles.label}>👥 Guests</Text>
                <TextInput style={styles.input} placeholder="Number of guests" placeholderTextColor="#999" value={guests} onChangeText={setGuests} keyboardType="number-pad" />
              </View>
              <View style={styles.halfField}>
                <Text style={styles.label}>🏛 Vendor</Text>
                <View style={[styles.input, styles.readonlyInput]}><Text style={styles.readonlyText}>{vendorName}</Text></View>
              </View>
            </View>

            <View style={styles.row}>
              <View style={styles.halfField}>
                <Text style={styles.label}>Address</Text>
                <TextInput style={styles.input} placeholder="Address" placeholderTextColor="#999" value={address} onChangeText={setAddress} />
              </View>
              <View style={styles.halfField}>
                <Text style={styles.label}>State</Text>
                <TextInput style={styles.input} placeholder="State" placeholderTextColor="#999" value={contactState} onChangeText={setContactState} />
              </View>
            </View>

            <Text style={styles.label}>Country</Text>
            <TextInput style={[styles.input, { marginBottom: 14 }]} placeholder="Country" placeholderTextColor="#999" value={country} onChangeText={setCountry} />
            <Text style={styles.label}>Special Requirements</Text>
            <TextInput style={[styles.input, styles.requirementsInput]} multiline placeholder="Decoration, catering, entertainment, accessibility..." placeholderTextColor="#999" value={specialRequirements} onChangeText={setSpecialRequirements} />
          </ScrollView>

          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Estimated Price</Text>
            <Text style={styles.priceValue}>₹{selectedPackagePrice.toLocaleString("en-IN")}</Text>
          </View>

          <TouchableOpacity
            style={[styles.submitButton, (!requiredFieldsFilled || submitting) && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={!requiredFieldsFilled || submitting}
          >
            <Text style={styles.submitButtonText}>
              {submitting ? "Processing..." : requiredFieldsFilled ? "Confirm Booking" : "Fill all required fields"}
            </Text>
          </TouchableOpacity>
          {!requiredFieldsFilled && (
            <Text style={styles.validationHint}>
              Please fill in Primary Person, Phone, Email, Event Date, and a Package to continue.
            </Text>
          )}
        </View>
      </View>
    </Modal>
  );
}
