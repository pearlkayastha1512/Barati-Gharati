import { Alert, StyleSheet, View } from "react-native";
import { Button, Text, TextInput } from "react-native-paper";
import { Controller, useForm } from "react-hook-form";
import { verifyEmail } from "../../api/auth.api";
import { useNavigation } from "@react-navigation/native";

type VerifyEmailForm = {
  token: string;
};

export default function VerifyEmailScreen() {
  const navigation = useNavigation<any>();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<VerifyEmailForm>({
    defaultValues: {
      token: "",
    },
  });

  const onSubmit = async (data: VerifyEmailForm) => {
    try {
      await verifyEmail(data.token);

      Alert.alert(
        "Success",
        "Email verified successfully."
      );

      navigation.replace("Login");
    } catch (error: any) {
      Alert.alert(
        "Verification Failed",
        error.response?.data?.message || "Something went wrong"
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>
        Verify Email
      </Text>

      <Text style={styles.subtitle}>
        Paste your verification token.
      </Text>

      <Controller
        control={control}
        name="token"
        rules={{
          required: "Verification token is required",
        }}
        render={({ field: { onChange, value } }) => (
          <TextInput
            label="Verification Token"
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

      <Button
        mode="contained"
        onPress={handleSubmit(onSubmit)}
      >
        Verify Email
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