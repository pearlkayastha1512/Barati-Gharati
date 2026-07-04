import { Alert, StyleSheet, View } from "react-native";
import { Button, Text, TextInput } from "react-native-paper";
import { Controller, useForm } from "react-hook-form";
import { useState } from "react";
import { resetPassword } from "../../api/auth.api";

type ResetPasswordForm = {
  token: string;
  password: string;
  confirmPassword: string;
};

export default function ResetPasswordScreen() {
  const [showPassword, setShowPassword] = useState(false);

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ResetPasswordForm>({
    defaultValues: {
      token: "",
      password: "",
      confirmPassword: "",
    },
  });

  const password = watch("password");

  const onSubmit = async (data: ResetPasswordForm) => {
    try {
      await resetPassword({
        token: data.token,
        password: data.password,
      });

      Alert.alert(
        "Success",
        "Password reset successfully."
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
        Reset Password
      </Text>

      <Controller
        control={control}
        name="token"
        rules={{ required: "Token is required" }}
        render={({ field: { onChange, value } }) => (
          <TextInput
            label="Reset Token"
            mode="outlined"
            value={value}
            onChangeText={onChange}
            error={!!errors.token}
            style={styles.input}
          />
        )}
      />

      {errors.token && (
        <Text style={styles.error}>
          {errors.token.message}
        </Text>
      )}

      <Controller
        control={control}
        name="password"
        rules={{
          required: "Password is required",
          minLength: {
            value: 6,
            message: "Minimum 6 characters",
          },
        }}
        render={({ field: { onChange, value } }) => (
          <TextInput
            label="New Password"
            mode="outlined"
            value={value}
            onChangeText={onChange}
            secureTextEntry={!showPassword}
            error={!!errors.password}
            style={styles.input}
          />
        )}
      />

      {errors.password && (
        <Text style={styles.error}>
          {errors.password.message}
        </Text>
      )}

      <Controller
        control={control}
        name="confirmPassword"
        rules={{
          validate: (value) =>
            value === password || "Passwords do not match",
        }}
        render={({ field: { onChange, value } }) => (
          <TextInput
            label="Confirm Password"
            mode="outlined"
            value={value}
            onChangeText={onChange}
            secureTextEntry={!showPassword}
            error={!!errors.confirmPassword}
            style={styles.input}
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
        onPress={handleSubmit(onSubmit)}
      >
        Reset Password
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
    marginBottom: 20,
  },
  input: {
    marginBottom: 10,
  },
  error: {
    color: "red",
    marginBottom: 10,
  },
});