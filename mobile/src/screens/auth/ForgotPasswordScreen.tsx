import { useState } from "react";
import { View, StyleSheet, Alert } from "react-native";
import { Text, TextInput, Button } from "react-native-paper";
import { Controller, useForm } from "react-hook-form";
import { forgotPassword } from "../../api/auth.api";

type ForgotPasswordForm = {
  email: string;
};

export default function ForgotPasswordScreen() {
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
    await forgotPassword(data.email);

    Alert.alert(
      "Success",
      "Password reset link sent to your email."
    );
  } catch (error: any) {
    Alert.alert(
      "Error",
      error.response?.data?.message || "Something went wrong"
    );
  }
};

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>
        Forgot Password
      </Text>

      <Text style={styles.subtitle}>
        Enter your registered email.
      </Text>

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

      <Button
        mode="contained"
        onPress={handleSubmit(onSubmit)}
      >
        Send Reset Link
      </Button>
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
    marginBottom: 10,
  },

  subtitle: {
    color: "#666",
    marginBottom: 25,
  },

  input: {
    marginBottom: 10,
  },

  error: {
    color: "red",
    marginBottom: 10,
  },
});