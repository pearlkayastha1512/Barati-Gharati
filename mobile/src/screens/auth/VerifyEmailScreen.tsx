import { useEffect, useRef, useState } from "react";
import {
  View,
  StyleSheet,
  Alert,
  TextInput as RNTextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Text, TouchableRipple } from "react-native-paper";
import { useNavigation, useRoute } from "@react-navigation/native";
import { verifyEmailOtp, resendEmailOtp } from "../../api/auth.api";
import { COLORS, SPACING, RADIUS } from "../../constants/theme";

const OTP_LENGTH = 6;
const RESEND_COOLDOWN_SECONDS = 30;

export default function VerifyEmailScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const email: string = route.params?.email ?? "";

  const [digits, setDigits] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [verifying, setVerifying] = useState(false);
  const [resending, setResending] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  const inputRefs = useRef<Array<RNTextInput | null>>([]);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => {
      setCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  const handleChangeDigit = (value: string, index: number) => {
    const cleaned = value.replace(/[^0-9]/g, "");
    if (!cleaned) {
      const next = [...digits];
      next[index] = "";
      setDigits(next);
      return;
    }

    // Handle pasting a full code into one box
    if (cleaned.length > 1) {
      const next = [...digits];
      for (let i = 0; i < cleaned.length && index + i < OTP_LENGTH; i++) {
        next[index + i] = cleaned[i];
      }
      setDigits(next);
      const lastFilled = Math.min(index + cleaned.length, OTP_LENGTH - 1);
      inputRefs.current[lastFilled]?.focus();
      return;
    }

    const next = [...digits];
    next[index] = cleaned;
    setDigits(next);

    if (index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const otp = digits.join("");
    if (otp.length !== OTP_LENGTH) {
      Alert.alert("Incomplete code", `Please enter the full ${OTP_LENGTH}-digit code.`);
      return;
    }

    try {
      setVerifying(true);
      await verifyEmailOtp({ email, otp });
      Alert.alert(
        "Email verified",
        "Your email has been verified. Your account is now awaiting admin approval.",
        [{ text: "OK", onPress: () => navigation.replace("Login") }],
      );
    } catch (error: any) {
      Alert.alert(
        "Verification failed",
        error?.response?.data?.message ?? "Invalid or expired code. Please try again.",
      );
      setDigits(Array(OTP_LENGTH).fill(""));
      inputRefs.current[0]?.focus();
    } finally {
      setVerifying(false);
    }
  };

  const handleResend = async () => {
    if (cooldown > 0) return;
    try {
      setResending(true);
      await resendEmailOtp({ email });
      setCooldown(RESEND_COOLDOWN_SECONDS);
      Alert.alert("Code sent", "A new verification code has been sent to your email.");
    } catch (error: any) {
      Alert.alert(
        "Couldn't resend",
        error?.response?.data?.message ?? "Please try again in a moment.",
      );
    } finally {
      setResending(false);
    }
  };

  return (
    <View style={styles.fullScreen}>
      <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={{ flex: 1 }}
        >
          <View style={styles.content}>
            <View style={styles.iconCircle}>
              <MaterialCommunityIcons name="email-check-outline" size={40} color={COLORS.primary} />
            </View>

            <Text style={styles.title}>Verify your email</Text>
            <Text style={styles.subtitle}>
              We've sent a {OTP_LENGTH}-digit code to{"\n"}
              <Text style={styles.emailText}>{email}</Text>
            </Text>

            <View style={styles.otpRow}>
              {digits.map((digit, index) => (
                <RNTextInput
                  key={index}
                  ref={(ref) => {
                    inputRefs.current[index] = ref;
                  }}
                  style={[styles.otpBox, digit ? styles.otpBoxFilled : undefined]}
                  value={digit}
                  onChangeText={(value) => handleChangeDigit(value, index)}
                  onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, index)}
                  keyboardType="number-pad"
                  maxLength={OTP_LENGTH}
                  textAlign="center"
                />
              ))}
            </View>

            <TouchableRipple
              onPress={handleVerify}
              disabled={verifying}
              style={[styles.submitButton, verifying && { opacity: 0.7 }]}
              borderless
            >
              <LinearGradient
                colors={[COLORS.gradientStart, COLORS.gradientEnd]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.submitButtonGradient}
              >
                <Text style={styles.submitButtonText}>
                  {verifying ? "Verifying..." : "Verify Email"}
                </Text>
              </LinearGradient>
            </TouchableRipple>

            <View style={styles.resendRow}>
              <Text style={styles.resendText}>Didn't receive the code? </Text>
              <TouchableRipple onPress={handleResend} disabled={cooldown > 0 || resending}>
                <Text
                  style={[
                    styles.resendLink,
                    (cooldown > 0 || resending) && styles.resendLinkDisabled,
                  ]}
                >
                  {cooldown > 0 ? `Resend in ${cooldown}s` : resending ? "Sending..." : "Resend"}
                </Text>
              </TouchableRipple>
            </View>
          </View>
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
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: SPACING.lg,
  },
  iconCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: COLORS.surface,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: COLORS.text,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 13,
    color: COLORS.textMuted,
    marginTop: 8,
    textAlign: "center",
    lineHeight: 20,
  },
  emailText: {
    fontWeight: "700",
    color: COLORS.text,
  },
  otpRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
    marginTop: SPACING.xl,
    marginBottom: SPACING.lg,
  },
  otpBox: {
    width: 46,
    height: 54,
    borderRadius: RADIUS.md,
    borderWidth: 1.5,
    borderColor: "#eee",
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.text,
    backgroundColor: COLORS.surface,
  },
  otpBoxFilled: {
    borderColor: COLORS.primary,
  },
  submitButton: {
    width: "100%",
    borderRadius: RADIUS.md,
    overflow: "hidden",
    marginTop: SPACING.md,
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
  resendRow: {
    flexDirection: "row",
    marginTop: SPACING.xl,
    alignItems: "center",
  },
  resendText: {
    color: COLORS.textMuted,
    fontSize: 13,
  },
  resendLink: {
    color: COLORS.primary,
    fontWeight: "800",
    fontSize: 13,
  },
  resendLinkDisabled: {
    color: COLORS.textMuted,
  },
});