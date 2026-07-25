import { useState } from "react";
import {
  View,
  StyleSheet,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
  Modal,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { register } from "../../api/auth.api";
import { useAuthStore } from "../../store/authStore";
import { Text, TextInput, TouchableRipple, Checkbox } from "react-native-paper";
import { Controller, useForm } from "react-hook-form";
import { useNavigation } from "@react-navigation/native";
import { COLORS, SPACING, RADIUS } from "../../constants/theme";
import { MembershipCheckoutModal } from "./MembershipCheckoutModal";
import { CustomerPremiumOrder, RazorpaySuccess } from "../../types/payment";
import { CustomerMembership } from "../../types/user";

type RegisterForm = {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
};

type MembershipTier = "free" | "premium";

// --- Password strength helper ---
function getPasswordStrength(password: string): {
  label: "Weak" | "Medium" | "Strong";
  score: number;
  color: string;
} {
  if (!password) return { label: "Weak", score: 0, color: COLORS.danger };

  const length = password.length;

  if (length < 6) {
    return { label: "Weak", score: 0.33, color: COLORS.danger };
  }
  if (length < 8) {
    return { label: "Medium", score: 0.66, color: "#F5A623" };
  }
  return { label: "Strong", score: 1, color: "#2ECC71" };
}

// --- Terms & Conditions content shown in the popup ---
const TERMS_SECTIONS: { heading: string; body: string }[] = [
  {
    heading: "1. About Barati Gharati",
    body: "Barati Gharati is an online Wedding Marketplace and Wedding Technology (Wed-Tech) Platform that enables users to search, discover, compare, communicate with, and connect with independent wedding vendors including wedding venues, banquet halls, wedding planners, photographers, videographers, makeup artists, mehendi artists, decorators, caterers, DJs, live bands, sufi bands, celebrity artists, choreographers, bridal wear designers, groom wear designers, jewellery vendors, invitation designers, travel services, wedding transportation, wedding website services, budget planning tools, guest management tools, and other wedding-related service providers. Barati Gharati is solely a technology platform and marketplace that connects users with independent vendors.",
  },
  {
    heading: "2. Platform Nature",
    body: "Barati Gharati does not own, operate, manage, employ, supervise, endorse, or control any vendor listed on the Platform. Each vendor operates as an independent business entity. The Platform only facilitates discovery and communication between users and vendors.",
  },
  {
    heading: "3. Eligibility",
    body: "You must be at least 18 years of age, have legal capacity to enter into contracts, provide accurate information, and use the Platform only for lawful purposes.",
  },
  {
    heading: "4. User Accounts",
    body: "Users may create accounts as a couple, bride, groom, family member, wedding planner, vendor, business, or organization. Users are responsible for maintaining password confidentiality, all activities performed under their account, and updating information whenever necessary.",
  },
  {
    heading: "5. Vendor Listings",
    body: "Vendor information displayed on the Platform may include business name, contact details, portfolio, pricing, reviews, ratings, availability, service areas, and business description. Although Barati Gharati may verify certain information, such verification does not guarantee the vendor's identity, capability, quality of work, licensing status, legal compliance, reliability, or future performance. Users are solely responsible for conducting their own due diligence before hiring any vendor.",
  },
  {
    heading: "6. Direct Communication with Vendors",
    body: "Barati Gharati provides vendor contact details solely for facilitating communication. Once a user obtains or is provided with any vendor's contact information, all future communications, negotiations, quotations, agreements, bookings, modifications, cancellations, and transactions shall be solely between the user and the respective vendor. Barati Gharati shall have no responsibility, obligation, or liability in relation to such communications or agreements.",
  },
  {
    heading: "7. Direct Payments to Vendors",
    body: "If a user chooses to make any payment directly to a vendor — including advance payment, token amount, booking amount, security deposit, full payment, cash, UPI, bank transfer, credit card, debit card, wallet, or QR code payment — such payment is made entirely at the user's own discretion and risk. Barati Gharati is not a party to such payment transactions.",
  },
  {
    heading: "8. No Refund for Direct Vendor Payments",
    body: "If users directly contact or transact with vendors, Barati Gharati shall not refund any amount, recover any payment, mediate financial disputes, compensate users, or guarantee vendor refunds. All refund requests must be resolved directly with the concerned vendor.",
  },
  {
    heading: "9. Marketplace Disclaimer",
    body: "Barati Gharati only provides vendor listings, search features, marketplace technology, budget planning tools, wedding planning tools, a wedding website builder, vendor discovery, lead generation, and communication features. Barati Gharati does not provide the actual wedding services.",
  },
  {
    heading: "10. Booking Disclaimer",
    body: "Any booking made with a vendor is an independent agreement between the user and the vendor. Barati Gharati shall not be responsible for vendor cancellation, vendor delay, poor service, misconduct, non-performance, event cancellation, pricing disputes, quality disputes, misrepresentation, fraud, overbooking, or unavailability.",
  },
  {
    heading: "11. Reviews & Ratings",
    body: "Users may submit reviews based on genuine experiences. Barati Gharati reserves the right to remove reviews that are false, misleading, offensive, defamatory, spam, promotional, or illegal. The Platform does not guarantee the accuracy of user-generated reviews.",
  },
  {
    heading: "12. Vendor Responsibilities",
    body: "Each vendor is solely responsible for licenses, registrations, taxes, GST compliance, employees, contracts, deliverables, pricing, safety standards, insurance, and professional conduct.",
  },
  {
    heading: "13. User Responsibilities",
    body: "Users agree to provide accurate booking information, respect vendors, avoid fraudulent activities, not misuse the Platform, and comply with applicable laws.",
  },
  {
    heading: "14. Prohibited Activities",
    body: "Users shall not post false information, upload illegal content, harass vendors, spam users, scrape data, copy website content, use bots without authorization, attempt unauthorized access, or interfere with Platform operations.",
  },
  {
    heading: "15. Intellectual Property",
    body: "All content including logos, brand names, software, source code, graphics, icons, layouts, databases, images, designs, videos, and documents are owned by Barati Gharati, True Knock Industries Private Limited, or their respective owners. No content may be copied, reproduced, or redistributed without prior written permission.",
  },
  {
    heading: "16. Privacy",
    body: "Your use of the Platform is also governed by our Privacy Policy.",
  },
  {
    heading: "17. Third-Party Services",
    body: "The Platform may integrate with third-party services such as Google Maps, payment gateways, WhatsApp, YouTube, Vimeo, social media platforms, and analytics providers. Barati Gharati is not responsible for third-party services or their availability.",
  },
  {
    heading: "18. Force Majeure",
    body: "Barati Gharati shall not be liable for delays or failures resulting from events beyond reasonable control including natural disasters, fire, flood, pandemic, government orders, war, terrorism, internet failures, power outages, cyber attacks, and technical failures.",
  },
  {
    heading: "19. Limitation of Liability",
    body: "To the fullest extent permitted by applicable law, Barati Gharati and its affiliates, directors, officers, employees, partners, licensors, and agents shall not be liable for any direct, indirect, consequential, incidental, or special damages arising from vendor services, third-party actions, user conduct, Platform usage, or technical errors.",
  },
  {
    heading: "20. Changes to These Terms",
    body: "Barati Gharati may modify these Terms at any time. Updated Terms will be published on the Platform with a revised \"Last Updated\" date. Continued use of the Platform after such changes constitutes acceptance of the revised Terms.",
  },
  {
    heading: "21. Governing Law & Jurisdiction",
    body: "These Terms shall be governed by and construed in accordance with the laws of India. Any dispute arising out of or relating to these Terms shall first be attempted to be resolved amicably, failing which it shall be referred to arbitration under the Arbitration and Conciliation Act, 1996, subject to the exclusive jurisdiction of the courts having jurisdiction over the registered office of True Knock Industries Private Limited.",
  },
];

export default function RegisterScreen() {
  const navigation = useNavigation<any>();
  const { login: saveAuth } = useAuthStore();
  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [membershipTier, setMembershipTier] = useState<MembershipTier>("free");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [termsError, setTermsError] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);

  // Payment modal state
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [pendingFormData, setPendingFormData] = useState<RegisterForm | null>(null);

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterForm>({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    },
  });

  const password = watch("password");
  const strength = getPasswordStrength(password);

  const completeRegistration = async (
    data: RegisterForm,
    paymentFields?: {
      membershipPaymentOrderId: string;
      membershipPaymentId: string;
      membershipPaymentSignature: string;
    },
  ) => {
    try {
      setLoading(true);

      await register({
        name: data.name,
        email: data.email,
        phone: data.phone,
        password: data.password,
        membership:
          membershipTier === "premium"
            ? CustomerMembership.PREMIUM
            : CustomerMembership.FREE,
        ...(paymentFields ?? {}),
      });

      navigation.replace("VerifyEmail", { email: data.email });
    } catch (error: any) {
      console.log("REGISTER ERROR =>", JSON.stringify(error?.response?.data, null, 2));
      Alert.alert(
        "Error",
        error?.response?.data?.message ?? "Something went wrong."
      );
    } finally {
      setLoading(false);
      setShowPaymentModal(false);
      setPendingFormData(null);
    }
  };

  const onSubmit = async (data: RegisterForm) => {
    if (!agreedToTerms) {
      setTermsError(true);
      return;
    }
    setTermsError(false);

    if (membershipTier === "premium") {
      // Open Razorpay checkout first — account is only created after payment succeeds
      setPendingFormData(data);
      setShowPaymentModal(true);
      return;
    }

    // Free tier — no payment step needed
    await completeRegistration(data);
  };

  const handlePaymentSuccess = async (
    payment: RazorpaySuccess,
    _order: CustomerPremiumOrder,
  ) => {
    if (!pendingFormData) return;
    await completeRegistration(pendingFormData, {
      membershipPaymentOrderId: payment.razorpay_order_id,
      membershipPaymentId: payment.razorpay_payment_id,
      membershipPaymentSignature: payment.razorpay_signature,
    });
  };

  return (
    <View style={styles.fullScreen}>
      <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={{ flex: 1 }}
        >
          <ScrollView
            contentContainerStyle={styles.scroll}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <TouchableRipple
              onPress={() => navigation.goBack()}
              style={styles.backButton}
            >
              <MaterialCommunityIcons name="arrow-left" size={22} color={COLORS.text} />
            </TouchableRipple>

            <View style={styles.logoSection}>
              <View style={styles.logoCircle}>
                <Image
                  source={require("../../../assets/Barati_Gharati_Logo-removebg-preview.png")}
                  style={styles.logoImage}
                  resizeMode="contain"
                />
              </View>
              <Text style={styles.heroTitle}>Create Account</Text>
              <Text style={styles.heroSubtitle}>Register to continue planning your big day.</Text>
            </View>

            <View style={styles.formCard}>
              <Text style={styles.formLabel}>Full Name</Text>
              <Controller
                control={control}
                name="name"
                rules={{ required: "Name is required" }}
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    mode="outlined"
                    placeholder="Your full name"
                    value={value}
                    onChangeText={onChange}
                    error={!!errors.name}
                    style={styles.input}
                    outlineStyle={styles.inputOutline}
                    left={<TextInput.Icon icon="account-outline" color={COLORS.textMuted} />}
                  />
                )}
              />
              {errors.name && <Text style={styles.error}>{errors.name.message}</Text>}

              <Text style={[styles.formLabel, { marginTop: SPACING.md }]}>Email Address</Text>
              <Controller
                control={control}
                name="email"
                rules={{
                  required: "Email is required",
                  pattern: {
                    value: /\S+@\S+\.\S+/,
                    message: "Enter a valid email",
                  },
                }}
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    mode="outlined"
                    placeholder="you@example.com"
                    value={value}
                    onChangeText={onChange}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    error={!!errors.email}
                    style={styles.input}
                    outlineStyle={styles.inputOutline}
                    left={<TextInput.Icon icon="email-outline" color={COLORS.textMuted} />}
                  />
                )}
              />
              {errors.email && <Text style={styles.error}>{errors.email.message}</Text>}

              <Text style={[styles.formLabel, { marginTop: SPACING.md }]}>Phone Number</Text>
              <Controller
                control={control}
                name="phone"
                rules={{
                  required: "Phone number is required",
                  pattern: {
                    value: /^[0-9]{10}$/,
                    message: "Enter a valid 10 digit phone number",
                  },
                }}
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    mode="outlined"
                    placeholder="10 digit phone number"
                    value={value}
                    onChangeText={onChange}
                    keyboardType="phone-pad"
                    error={!!errors.phone}
                    style={styles.input}
                    outlineStyle={styles.inputOutline}
                    left={<TextInput.Icon icon="phone-outline" color={COLORS.textMuted} />}
                  />
                )}
              />
              {errors.phone && <Text style={styles.error}>{errors.phone.message}</Text>}

              <Text style={[styles.formLabel, { marginTop: SPACING.md }]}>Password</Text>
              <Controller
                control={control}
                name="password"
                rules={{
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                }}
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    mode="outlined"
                    placeholder="Create Password"
                    value={value}
                    onChangeText={onChange}
                    secureTextEntry={!showPassword}
                    error={!!errors.password}
                    style={styles.input}
                    outlineStyle={styles.inputOutline}
                    left={<TextInput.Icon icon="lock-outline" color={COLORS.textMuted} />}
                    right={
                      <TextInput.Icon
                        icon={showPassword ? "eye-off" : "eye"}
                        color={COLORS.textMuted}
                        onPress={() => setShowPassword(!showPassword)}
                      />
                    }
                  />
                )}
              />
              {errors.password && <Text style={styles.error}>{errors.password.message}</Text>}

              <Text style={[styles.formLabel, { marginTop: SPACING.md }]}>Confirm Password</Text>
              <Controller
                control={control}
                name="confirmPassword"
                rules={{
                  required: "Confirm Password is required",
                  validate: (value) => value === password || "Passwords do not match",
                }}
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    mode="outlined"
                    placeholder="Confirm Password"
                    value={value}
                    onChangeText={onChange}
                    secureTextEntry={!showConfirmPassword}
                    error={!!errors.confirmPassword}
                    style={styles.input}
                    outlineStyle={styles.inputOutline}
                    left={<TextInput.Icon icon="lock-check-outline" color={COLORS.textMuted} />}
                    right={
                      <TextInput.Icon
                        icon={showConfirmPassword ? "eye-off" : "eye"}
                        color={COLORS.textMuted}
                        onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                      />
                    }
                  />
                )}
              />
              {errors.confirmPassword && (
                <Text style={styles.error}>{errors.confirmPassword.message}</Text>
              )}

              <View style={styles.strengthRow}>
                <Text style={styles.formLabel}>Password Strength</Text>
                <Text style={[styles.strengthLabel, { color: strength.color }]}>
                  {strength.label}
                </Text>
              </View>
              <View style={styles.strengthTrack}>
                <View
                  style={[
                    styles.strengthFill,
                    { width: `${strength.score * 100}%`, backgroundColor: strength.color },
                  ]}
                />
              </View>

              <View style={styles.membershipHeader}>
                <View>
                  <Text style={styles.membershipTitle}>Choose your membership</Text>
                  <Text style={styles.membershipSubtitle}>
                    Premium includes our managed wedding-planning service.
                  </Text>
                </View>
                <MaterialCommunityIcons name="crown" size={22} color="#F5A623" />
              </View>

              <View style={styles.membershipRow}>
                <TouchableRipple
                  onPress={() => setMembershipTier("free")}
                  style={[
                    styles.membershipCard,
                    membershipTier === "free" && styles.membershipCardSelected,
                  ]}
                  borderless
                >
                  <View>
                    <View style={styles.membershipCardTopRow}>
                      <Text style={styles.membershipCardTitle}>Free</Text>
                      <Text style={styles.membershipCardPrice}>₹0</Text>
                    </View>
                    <Text style={styles.membershipCardDesc}>
                      Browse vendors and use standard planning tools.
                    </Text>
                  </View>
                </TouchableRipple>

                <TouchableRipple
                  onPress={() => setMembershipTier("premium")}
                  style={[
                    styles.membershipCard,
                    membershipTier === "premium" && styles.membershipCardSelected,
                  ]}
                  borderless
                >
                  <View>
                    <View style={styles.membershipCardTopRow}>
                      <Text style={styles.membershipCardTitle}>Premium</Text>
                      <Text style={styles.membershipCardPrice}>₹4,999</Text>
                    </View>
                    <Text style={styles.membershipCardDesc}>
                      One-time payment · personal team review and quotation.
                    </Text>
                    <View style={styles.membershipFeatures}>
                      {[
                        "Fill wedding preferences",
                        "Vendor assignment",
                        "Personal quotation",
                        "Booking coordination",
                      ].map((feature) => (
                        <View key={feature} style={styles.membershipFeatureRow}>
                          <MaterialCommunityIcons
                            name="check-circle-outline"
                            size={14}
                            color="#2ECC71"
                          />
                          <Text style={styles.membershipFeatureText}>{feature}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                </TouchableRipple>
              </View>

              {/* Checkbox and label are independent touch targets —
                  no nested TouchableRipple, so both onPress handlers fire reliably */}
              <View style={styles.termsRowInner}>
                <Checkbox
                  status={agreedToTerms ? "checked" : "unchecked"}
                  onPress={() => setShowTermsModal(true)}
                  color={COLORS.primary}
                />
                <TouchableRipple
                  onPress={() => {
                    setAgreedToTerms(!agreedToTerms);
                    setTermsError(false);
                  }}
                  style={{ flexShrink: 1 }}
                >
                  <Text style={styles.termsLink}>I agree to the Terms & Conditions</Text>
                </TouchableRipple>
              </View>
              {termsError && (
                <Text style={styles.error}>Please accept the Terms & Conditions to continue</Text>
              )}

              <TouchableRipple
                onPress={handleSubmit(onSubmit)}
                disabled={loading}
                style={[styles.submitButton, loading && { opacity: 0.7 }]}
                borderless
              >
                <LinearGradient
                  colors={[COLORS.gradientStart, COLORS.gradientEnd]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.submitButtonGradient}
                >
                  <Text style={styles.submitButtonText}>
                    {loading
                      ? "Creating Account..."
                      : membershipTier === "premium"
                      ? "Continue to Payment"
                      : "Create Account"}
                  </Text>
                </LinearGradient>
              </TouchableRipple>
            </View>

            <View style={styles.footer}>
              <Text style={styles.footerText}>Already have an account? </Text>
              <TouchableRipple onPress={() => navigation.replace("Login")}>
                <Text style={styles.login}>Login</Text>
              </TouchableRipple>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>

    {/* Terms & Conditions popup */}
      <Modal
        visible={showTermsModal}
        animationType="slide"
        transparent
        onRequestClose={() => setShowTermsModal(false)}
      >
        <View style={styles.modalOverlay}>
          {/* Tapping this dim area (above the card) closes the modal */}
          <Pressable style={styles.modalDismissZone} onPress={() => setShowTermsModal(false)} />

          {/* The card itself has no responder-claiming logic, so the
              ScrollView inside it is free to handle drag/scroll gestures */}
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Terms & Conditions</Text>
              <TouchableRipple
                onPress={() => setShowTermsModal(false)}
                style={styles.modalCloseButton}
                borderless
              >
                <MaterialCommunityIcons name="close" size={20} color={COLORS.text} />
              </TouchableRipple>
            </View>

            <ScrollView
              style={styles.modalScroll}
              contentContainerStyle={styles.modalScrollContent}
              showsVerticalScrollIndicator={true}
              nestedScrollEnabled={true}
              bounces={true}
            >
              {TERMS_SECTIONS.map((section) => (
                <View key={section.heading} style={styles.modalSection}>
                  <Text style={styles.modalSectionHeading}>{section.heading}</Text>
                  <Text style={styles.modalSectionBody}>{section.body}</Text>
                </View>
              ))}
            </ScrollView>

            <TouchableRipple
              onPress={() => {
                setAgreedToTerms(true);
                setTermsError(false);
                setShowTermsModal(false);
              }}
              style={styles.modalAcceptButton}
              borderless
            >
              <LinearGradient
                colors={[COLORS.gradientStart, COLORS.gradientEnd]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.modalAcceptGradient}
              >
                <Text style={styles.modalAcceptText}>I Agree, Close</Text>
              </LinearGradient>
            </TouchableRipple>
          </View>
        </View>
      </Modal>
      {pendingFormData && (
        <MembershipCheckoutModal
          visible={showPaymentModal}
          customerName={pendingFormData.name}
          customerEmail={pendingFormData.email}
          customerPhone={pendingFormData.phone}
          onClose={() => {
            setShowPaymentModal(false);
            setPendingFormData(null);
          }}
          onSuccess={handlePaymentSuccess}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  fullScreen: {
    flex: 1,
    backgroundColor: "#fff",
  },
  safeArea: {
    flex: 1,
  },
  scroll: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xxl,
  },
  backButton: {
    position: "absolute",
    top: SPACING.md,
    left: SPACING.lg,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.background,
    zIndex: 1,
  },
  logoSection: {
    alignItems: "center",
    marginBottom: SPACING.xl,
    marginTop: SPACING.xxl,
  },
  logoCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: COLORS.surface,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: SPACING.md,
    padding: SPACING.sm,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: COLORS.border,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
  },
  logoImage: {
    width: "100%",
    height: "100%",
    borderRadius: 45,
  },
  heroTitle: {
    fontSize: 26,
    fontWeight: "800",
    color: COLORS.text,
  },
  heroSubtitle: {
    fontSize: 13,
    color: COLORS.textMuted,
    marginTop: 6,
    textAlign: "center",
    paddingHorizontal: SPACING.lg,
  },
  formCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
  },
  formLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.textMuted,
    marginBottom: 6,
  },
  input: {
    backgroundColor: COLORS.surface,
  },
  inputOutline: {
    borderRadius: RADIUS.md,
  },
  error: {
    color: COLORS.danger,
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  strengthRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: SPACING.md,
    marginBottom: 6,
  },
  strengthLabel: {
    fontSize: 12,
    fontWeight: "700",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "flex-end",
  },
  modalDismissZone: {
    flex: 1,
  },
  modalCard: {
    backgroundColor: "#fff",
    borderTopLeftRadius: RADIUS.lg,
    borderTopRightRadius: RADIUS.lg,
    height: "85%",
    paddingTop: SPACING.md,
    paddingBottom: SPACING.lg,
  },
  strengthTrack: {
    height: 6,
    borderRadius: 3,
    backgroundColor: "#eee",
    overflow: "hidden",
  },
  strengthFill: {
    height: "100%",
    borderRadius: 3,
  },
  membershipHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginTop: SPACING.lg,
  },
  membershipTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: COLORS.text,
  },
  membershipSubtitle: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 2,
    maxWidth: 260,
  },
  membershipRow: {
    flexDirection: "row",
    gap: SPACING.sm,
    marginTop: SPACING.sm,
  },
  membershipCard: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: "#eee",
    borderRadius: RADIUS.md,
    padding: SPACING.sm,
  },
  membershipCardSelected: {
    borderColor: COLORS.primary,
    backgroundColor: `${COLORS.primary}0D`,
  },
  membershipCardTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  membershipCardTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: COLORS.text,
  },
  membershipCardPrice: {
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.text,
  },
  membershipCardDesc: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 4,
  },
  membershipFeatures: {
    marginTop: SPACING.sm,
    gap: 4,
  },
  membershipFeatureRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  membershipFeatureText: {
    fontSize: 11,
    color: COLORS.text,
  },
  termsRowInner: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: SPACING.md,
  },
  termsLink: {
    color: COLORS.danger,
    fontWeight: "700",
    fontSize: 12,
  },
  submitButton: {
    borderRadius: RADIUS.md,
    overflow: "hidden",
    marginTop: SPACING.lg,
  },
  submitButtonGradient: {
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  submitButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: SPACING.xl,
  },
  footerText: {
    color: COLORS.textMuted,
    fontSize: 13,
  },
  login: {
    color: COLORS.primary,
    fontWeight: "800",
    fontSize: 13,
  },
  // --- Terms modal styles ---
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "flex-end",
  },
  
  modalScroll: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: COLORS.text,
  },
  modalCloseButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.background,
  },
  
  modalScrollContent: {
    paddingVertical: SPACING.md,
  },
  modalSection: {
    marginBottom: SPACING.md,
  },
  modalSectionHeading: {
    fontSize: 13,
    fontWeight: "800",
    color: COLORS.text,
    marginBottom: 4,
  },
  modalSectionBody: {
    fontSize: 12.5,
    lineHeight: 19,
    color: COLORS.textMuted,
  },
  modalAcceptButton: {
    marginHorizontal: SPACING.lg,
    marginTop: SPACING.sm,
    borderRadius: RADIUS.md,
    overflow: "hidden",
  },
  modalAcceptGradient: {
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  modalAcceptText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 14,
  },
});