import { useState } from "react";
import {
  View,
  StyleSheet,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Text, TextInput, TouchableRipple } from "react-native-paper";
import { Controller, useForm } from "react-hook-form";
import { useNavigation } from "@react-navigation/native";
import { forgotPassword } from "../../api/auth.api";
import { COLORS, SPACING, RADIUS } from "../../constants/theme";

type ForgotPasswordForm = {
  email: string;
};

export default function ForgotPasswordScreen() {
  const navigation = useNavigation<any>();
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordForm>({
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: ForgotPasswordForm) => {
    try {
      setLoading(true);
      await forgotPassword({ email: data.email });

      Alert.alert(
        "Success",
        "Password reset link has been sent to your email.",
        [
          {
            text: "OK",
            onPress: () => navigation.replace("Login"),
          },
        ]
      );
    } catch (error: any) {
      const isNetworkError = !error?.response;

      Alert.alert(
        "Error",
        isNetworkError
          ? "Backend server se connect nahi ho pa raha. Please check that the backend is running and your phone and laptop are on the same Wi-Fi."
          : error.response?.data?.message ?? "Something went wrong."
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
            <TouchableRipple
              onPress={() => navigation.goBack()}
              style={styles.backButton}
            >
              <MaterialCommunityIcons name="arrow-left" size={22} color={COLORS.text} />
            </TouchableRipple>

            {/* Heading */}
            <View style={styles.headingSection}>
              <Text style={styles.heroTitle}>Forgot Password</Text>
              <Text style={styles.heroSubtitle}>
                Enter your registered email and we'll send you a reset link.
              </Text>
            </View>

            {/* Form card */}
            <View style={styles.formCard}>
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
                    {loading ? "Sending..." : "Send Reset Link"}
                  </Text>
                </LinearGradient>
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
  },

  headingSection: {
    alignItems: "center",
    marginBottom: SPACING.xl,
    marginTop: SPACING.xxl,
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

  submitButton: {
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
});