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
import { register } from "../../api/auth.api";
import { useAuthStore } from "../../store/authStore";
import { Text, TextInput, TouchableRipple } from "react-native-paper";
import { Controller, useForm } from "react-hook-form";
import { useNavigation } from "@react-navigation/native";
import { COLORS, SPACING, RADIUS } from "../../constants/theme";

type RegisterForm = {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
};

export default function RegisterScreen() {
  const navigation = useNavigation<any>();
  const { login: saveAuth } = useAuthStore();
  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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

  const onSubmit = async (data: RegisterForm) => {
    try {
      setLoading(true);

      await register({
        name: data.name,
        email: data.email,
        phone: data.phone,
        password: data.password,
      });

      Alert.alert("Success", "Account created successfully. Please log in.", [
        { text: "OK", onPress: () => navigation.replace("Login") },
      ]);
    } catch (error: any) {
      console.log("REGISTER ERROR =>", JSON.stringify(error?.response?.data, null, 2));
      Alert.alert(
        "Error",
        error?.response?.data?.message ?? "Something went wrong."
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
              <Text style={styles.heroTitle}>Create Account</Text>
              <Text style={styles.heroSubtitle}>Register to continue planning your big day.</Text>
            </View>

            {/* Form card */}
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
                    placeholder="••••••••"
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
                    {loading ? "Creating Account..." : "Register"}
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
});