import { useState } from "react";
import { View, StyleSheet, Alert } from "react-native";
import {
  Text,
  TextInput,
  Button,
  TouchableRipple,
} from "react-native-paper";
import { Controller, useForm } from "react-hook-form";
import { useNavigation } from "@react-navigation/native";
import { register } from "../../api/auth.api";

type RegisterForm = {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
};

export default function RegisterScreen() {
  const navigation = useNavigation<any>();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

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
      await register({
        name: data.name,
        email: data.email,
        phone: data.phone,
        password: data.password,
      });

      Alert.alert(
        "Registration Successful",
        "Please verify your email before logging in."
      );

      navigation.replace("Login");
    } catch (error: any) {
      Alert.alert(
        "Registration Failed",
        error.response?.data?.message || "Something went wrong"
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>
        Create Account
      </Text>

      <Text variant="bodyMedium" style={styles.subtitle}>
        Register to continue
      </Text>

      {/* Name */}

      <Controller
        control={control}
        name="name"
        rules={{
          required: "Name is required",
        }}
        render={({ field: { onChange, value } }) => (
          <TextInput
            label="Full Name"
            mode="outlined"
            value={value}
            onChangeText={onChange}
            error={!!errors.name}
            style={styles.input}
          />
        )}
      />

      {errors.name && (
        <Text style={styles.error}>
          {errors.name.message}
        </Text>
      )}

      {/* Email */}

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
            label="Email"
            mode="outlined"
            value={value}
            onChangeText={onChange}
            keyboardType="email-address"
            autoCapitalize="none"
            error={!!errors.email}
            style={styles.input}
          />
        )}
      />

      {errors.email && (
        <Text style={styles.error}>
          {errors.email.message}
        </Text>
      )}

      {/* Phone */}

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
            label="Phone Number"
            mode="outlined"
            value={value}
            onChangeText={onChange}
            keyboardType="phone-pad"
            error={!!errors.phone}
            style={styles.input}
          />
        )}
      />

      {errors.phone && (
        <Text style={styles.error}>
          {errors.phone.message}
        </Text>
      )}
            {/* Password */}

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
            label="Password"
            mode="outlined"
            value={value}
            onChangeText={onChange}
            secureTextEntry={!showPassword}
            error={!!errors.password}
            style={styles.input}
            right={
              <TextInput.Icon
                icon={showPassword ? "eye-off" : "eye"}
                onPress={() =>
                  setShowPassword(!showPassword)
                }
              />
            }
          />
        )}
      />

      {errors.password && (
        <Text style={styles.error}>
          {errors.password.message}
        </Text>
      )}

      {/* Confirm Password */}

      <Controller
        control={control}
        name="confirmPassword"
        rules={{
          required: "Confirm Password is required",
          validate: (value) =>
            value === password || "Passwords do not match",
        }}
        render={({ field: { onChange, value } }) => (
          <TextInput
            label="Confirm Password"
            mode="outlined"
            value={value}
            onChangeText={onChange}
            secureTextEntry={!showConfirmPassword}
            error={!!errors.confirmPassword}
            style={styles.input}
            right={
              <TextInput.Icon
                icon={
                  showConfirmPassword ? "eye-off" : "eye"
                }
                onPress={() =>
                  setShowConfirmPassword(
                    !showConfirmPassword
                  )
                }
              />
            }
          />
        )}
      />

      {errors.confirmPassword && (
        <Text style={styles.error}>
          {errors.confirmPassword.message}
        </Text>
      )}

      <Button
        mode="contained"
        style={styles.button}
        onPress={handleSubmit(onSubmit)}
      >
        Register
      </Button>

      <View style={styles.footer}>
        <Text>Already have an account? </Text>

        <TouchableRipple
          onPress={() => navigation.replace("Login")}
        >
          <Text style={styles.login}>
            Login
          </Text>
        </TouchableRipple>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#FFF8F8",
  },

  title: {
    color: "#C2185B",
    fontWeight: "bold",
    marginBottom: 8,
  },

  subtitle: {
    color: "#666",
    marginBottom: 30,
  },

  input: {
    marginBottom: 10,
  },

  error: {
    color: "red",
    marginBottom: 10,
    marginLeft: 4,
  },

  button: {
    borderRadius: 8,
    paddingVertical: 5,
    marginTop: 10,
  },

  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 25,
  },

  login: {
    color: "#C2185B",
    fontWeight: "bold",
  },
});