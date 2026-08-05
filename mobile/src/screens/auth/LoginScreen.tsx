import { useState } from "react";
import {
  View,
  StyleSheet,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { UserRole } from "../../types/user";
import { Text, TextInput, TouchableRipple } from "react-native-paper";
import { Controller, useForm } from "react-hook-form";
import { StackActions, useNavigation } from "@react-navigation/native";
import { login, sendLoginOtp, verifyLoginOtp } from "../../api/auth.api";
import { useAuthStore } from "../../store/authStore";
import { COLORS, SPACING, RADIUS } from "../../constants/theme";
import { useVendorRegistrationStore } from "../../store/vendorRegistrationStore";
import { syncPushTokenWithBackend } from "../../hooks/usePushNotifications";

type LoginForm = {
  email: string;
  password: string;
};

export default function LoginScreen() {
  const navigation = useNavigation<any>();
  const { login: saveAuth } = useAuthStore();

  const [loginMethod, setLoginMethod] = useState<"password" | "phone">("password");
  const [phone, setPhone] = useState("");
  const [phoneOtpSent, setPhoneOtpSent] = useState(false);
  const [phoneOtp, setPhoneOtp] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const resetVendorRegistration = useVendorRegistrationStore((state) => state.reset);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleSendPhoneOtp = async () => {
    const cleanPhone = phone.trim();
    if (!/^\d{10}$/.test(cleanPhone)) {
      Alert.alert("Invalid Phone Number", "Please enter a valid 10-digit registered mobile number.");
      return;
    }
    try {
      setLoading(true);
      const res = await sendLoginOtp(cleanPhone);
      setPhoneOtpSent(true);
      Alert.alert(
        "OTP Sent",
        (res as any).otp
          ? `Your OTP Code is: ${(res as any).otp}`
          : res.message || "OTP has been sent to your phone number."
      );
    } catch (error: any) {
      Alert.alert("Error", error?.response?.data?.message || "Failed to send OTP.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyPhoneOtp = async () => {
    if (!/^\d{6}$/.test(phoneOtp)) {
      Alert.alert("Invalid OTP", "Please enter the 6-digit OTP code.");
      return;
    }
    try {
      setLoading(true);
      const response = await verifyLoginOtp(phone.trim(), phoneOtp);
      await saveAuth(response.accessToken, response.user);
      await syncPushTokenWithBackend();

      const appNavigation = navigation.getParent() ?? navigation;
      if (response.user.role === UserRole.VENDOR) {
        appNavigation.dispatch(StackActions.replace("Vendor"));
        return;
      }
      if (response.user.role === UserRole.ADMIN) {
        appNavigation.dispatch(StackActions.replace("Admin"));
        return;
      }
      appNavigation.dispatch(StackActions.replace("Couple"));
    } catch (error: any) {
      Alert.alert("Verification Failed", error?.response?.data?.message || "Invalid OTP.");
    } finally {
      setLoading(false);
    }
  };

 const onSubmit = async (data: LoginForm) => {
  try {
    setLoading(true);
    const response = await login(data);
    await saveAuth(response.accessToken, response.user);
    await syncPushTokenWithBackend();   // <-- YE NAYI LINE
    console.log("LOGGED IN USER =>", JSON.stringify(response.user, null, 2));

    const appNavigation = navigation.getParent() ?? navigation;

    if (response.user.role === UserRole.VENDOR) {
      appNavigation.dispatch(StackActions.replace("Vendor"));
      return;
    }

    if (response.user.role === UserRole.ADMIN) {
      appNavigation.dispatch(StackActions.replace("Admin"));
      return;
    }

    appNavigation.dispatch(StackActions.replace("Couple"));
  } catch (error: any) {
    const isNetworkError = !error?.response;

    Alert.alert(
      "Login Failed",
      isNetworkError
        ? "Backend server se connect nahi ho pa raha. Please check that the backend is running and your phone and laptop are on the same Wi-Fi."
        : error.response.data?.message ?? "Something went wrong."
    );
  } finally {
    setLoading(false);
  }
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
            {/* Logo + heading */}
            <View style={styles.logoSection}>
              <View style={styles.logoCircle}>
                <Image
                  source={require("../../../assets/Barati_Gharati_Logo-removebg-preview.png")}
                  style={styles.logoImage}
                  resizeMode="contain"
                />
              </View>
              <Text style={styles.heroTitle}>Welcome Back</Text>
              <Text style={styles.heroSubtitle}>Sign in to continue planning your big day.</Text>
            </View>

            {/* Form card */}
            <View style={styles.formCard}>
              {/* Method Switcher */}
              <View style={styles.tabContainer}>
                <TouchableRipple
                  onPress={() => setLoginMethod("password")}
                  style={[
                    styles.tabButton,
                    loginMethod === "password" && styles.tabButtonActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.tabText,
                      loginMethod === "password" && styles.tabTextActive,
                    ]}
                  >
                    Password Login
                  </Text>
                </TouchableRipple>
                <TouchableRipple
                  onPress={() => setLoginMethod("phone")}
                  style={[
                    styles.tabButton,
                    loginMethod === "phone" && styles.tabButtonActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.tabText,
                      loginMethod === "phone" && styles.tabTextActive,
                    ]}
                  >
                    Phone OTP Login
                  </Text>
                </TouchableRipple>
              </View>

              {loginMethod === "phone" ? (
                <>
                  <Text style={styles.formLabel}>Mobile Phone Number</Text>
                  <TextInput
                    mode="outlined"
                    placeholder="10-digit registered phone number"
                    value={phone}
                    onChangeText={(val) => setPhone(val.replace(/\D/g, "").slice(0, 10))}
                    keyboardType="phone-pad"
                    style={styles.input}
                    outlineStyle={styles.inputOutline}
                    left={<TextInput.Icon icon="phone-outline" color={COLORS.textMuted} />}
                  />

                  {phoneOtpSent && (
                    <>
                      <Text style={[styles.formLabel, { marginTop: SPACING.md }]}>Enter 6-digit OTP</Text>
                      <TextInput
                        mode="outlined"
                        placeholder="000000"
                        value={phoneOtp}
                        onChangeText={(val) => setPhoneOtp(val.replace(/\D/g, "").slice(0, 6))}
                        keyboardType="number-pad"
                        style={styles.input}
                        outlineStyle={styles.inputOutline}
                        left={<TextInput.Icon icon="shield-check-outline" color={COLORS.textMuted} />}
                      />
                    </>
                  )}

                  {!phoneOtpSent ? (
                    <TouchableRipple
                      onPress={handleSendPhoneOtp}
                      disabled={loading}
                      style={[styles.loginButton, { marginTop: SPACING.lg }, loading && { opacity: 0.7 }]}
                      borderless
                    >
                      <LinearGradient
                        colors={[COLORS.gradientStart, COLORS.gradientEnd]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.loginButtonGradient}
                      >
                        <Text style={styles.loginButtonText}>
                          {loading ? "Sending OTP..." : "Send Login OTP"}
                        </Text>
                      </LinearGradient>
                    </TouchableRipple>
                  ) : (
                    <View style={{ flexDirection: "row", gap: 10, marginTop: SPACING.lg }}>
                      <TouchableRipple
                        onPress={handleVerifyPhoneOtp}
                        disabled={loading}
                        style={[styles.loginButton, { flex: 1 }, loading && { opacity: 0.7 }]}
                        borderless
                      >
                        <LinearGradient
                          colors={[COLORS.gradientStart, COLORS.gradientEnd]}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 0 }}
                          style={styles.loginButtonGradient}
                        >
                          <Text style={styles.loginButtonText}>
                            {loading ? "Verifying..." : "Verify & Login"}
                          </Text>
                        </LinearGradient>
                      </TouchableRipple>
                      <TouchableRipple
                        onPress={handleSendPhoneOtp}
                        disabled={loading}
                        style={[styles.resendBtn]}
                        borderless
                      >
                        <Text style={styles.resendText}>Resend</Text>
                      </TouchableRipple>
                    </View>
                  )}
                </>
              ) : (
                <>
                  <Text style={styles.formLabel}>Email Address</Text>
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
                        placeholder="••••••••"
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

                  <TouchableRipple
                    onPress={() => navigation.navigate("ForgotPassword")}
                    style={styles.forgotWrap}
                  >
                    <Text style={styles.forgot}>Forgot Password?</Text>
                  </TouchableRipple>

                  <TouchableRipple
                    onPress={handleSubmit(onSubmit)}
                    disabled={loading}
                    style={[styles.loginButton, loading && { opacity: 0.7 }]}
                    borderless
                  >
                    <LinearGradient
                      colors={[COLORS.gradientStart, COLORS.gradientEnd]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={styles.loginButtonGradient}
                    >
                      <Text style={styles.loginButtonText}>
                        {loading ? "Logging in..." : "Login"}
                      </Text>
                    </LinearGradient>
                  </TouchableRipple>
                </>
              )}
            </View>

            <View style={styles.footer}>
              <Text style={styles.footerText}>Don't have an account? </Text>
              <TouchableRipple onPress={() => navigation.navigate("Register")}>
                <Text style={styles.register}>Register</Text>
              </TouchableRipple>
            </View>

            <View style={styles.footerSecondary}>
              <Text style={styles.footerText}>Want to list your services? </Text>
              <TouchableRipple
                onPress={() => {
                  resetVendorRegistration();
                  navigation.navigate("VendorRegister");
                }}
              >
                <Text style={styles.register}>Become a Vendor</Text>
              </TouchableRipple>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
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

  logoSection: {
    alignItems: "center",
    marginBottom: SPACING.xl,
  },

  logoCircle: {
    width: 110,
    height: 110,
    borderRadius: 55,
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
    borderRadius: 55,
  },

  heroTitle: {
    fontSize: 26,
    fontWeight: "800",
    color: COLORS.text,
  },

  heroSubtitle: {
    fontSize: 13,
    color: COLORS.textMuted,
    marginTop: 4,
    textAlign: "center",
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

  tabContainer: {
    flexDirection: "row",
    backgroundColor: "#F1F5F9",
    borderRadius: RADIUS.md,
    padding: 3,
    marginBottom: SPACING.lg,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: RADIUS.sm,
  },
  tabButtonActive: {
    backgroundColor: "#FFFFFF",
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  tabText: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.textMuted,
  },
  tabTextActive: {
    color: COLORS.primary,
  },
  resendBtn: {
    justifyContent: "center",
    paddingHorizontal: 16,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  resendText: {
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.text,
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

  forgotWrap: {
    alignSelf: "flex-end",
    marginTop: SPACING.sm,
    marginBottom: SPACING.lg,
  },

  forgot: {
    color: COLORS.primary,
    fontWeight: "600",
    fontSize: 13,
  },

  loginButton: {
    borderRadius: RADIUS.md,
    overflow: "hidden",
  },

  loginButtonGradient: {
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
  },

  loginButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
  },

  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: SPACING.xl,
  },

  footerSecondary: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: SPACING.sm,
  },

  footerText: {
    color: COLORS.textMuted,
    fontSize: 13,
  },

  register: {
    color: COLORS.primary,
    fontWeight: "800",
    fontSize: 13,
  },
});