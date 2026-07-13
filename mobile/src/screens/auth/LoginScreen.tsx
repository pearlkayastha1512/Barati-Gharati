// import { useState } from "react";
// import { View, StyleSheet } from "react-native";
// import {
//   Text,
//   TextInput,
//   Button,
//   TouchableRipple,
// } from "react-native-paper";
// import { Controller, useForm } from "react-hook-form";
// import { useNavigation } from "@react-navigation/native";
// // import { login } from "../../api/auth.api";
// // import { useAuthStore } from "../../store/authStore";
// import { Alert } from "react-native";

// type LoginForm = {
//   email: string;
//   password: string;
// };

// export default function LoginScreen() {
//   const navigation = useNavigation<any>();
//   // const { login: saveAuth } = useAuthStore();

//   const [showPassword, setShowPassword] = useState(false);

//   const {
//     control,
//     handleSubmit,
//     formState: { errors },
//   } = useForm<LoginForm>({
//     defaultValues: {
//       email: "",
//       password: "",
//     },
//   });
// const onSubmit = (data: LoginForm) => {
//   Alert.alert("Success", "Login Successful");

//   // TEMPORARY hardcoded vendor check — replace with real role from API later
//   if (data.email.trim().toLowerCase() === "vendor@test.com") {
//     navigation.replace("Vendor");
//     return;
//   }

//   navigation.replace("Couple");
// };

//   return (
//     <View style={styles.container}>
//       <Text variant="headlineMedium" style={styles.title}>
//         Welcome Back 👋
//       </Text>

//       <Text variant="bodyMedium" style={styles.subtitle}>
//         Login to continue
//       </Text>

//       {/* Email */}
//       <Controller
//         control={control}
//         name="email"
//         rules={{
//           required: "Email is required",
//           pattern: {
//             value: /\S+@\S+\.\S+/,
//             message: "Enter a valid email",
//           },
//         }}
//         render={({ field: { onChange, value } }) => (
//           <TextInput
//             label="Email"
//             mode="outlined"
//             value={value}
//             onChangeText={onChange}
//             keyboardType="email-address"
//             autoCapitalize="none"
//             error={!!errors.email}
//             style={styles.input}
//           />
//         )}
//       />

//       {errors.email && (
//         <Text style={styles.error}>
//           {errors.email.message}
//         </Text>
//       )}

//       {/* Password */}
//       <Controller
//         control={control}
//         name="password"
//         rules={{
//           required: "Password is required",
//           minLength: {
//             value: 6,
//             message: "Password must be at least 6 characters",
//           },
//         }}
//         render={({ field: { onChange, value } }) => (
//           <TextInput
//             label="Password"
//             mode="outlined"
//             value={value}
//             onChangeText={onChange}
//             secureTextEntry={!showPassword}
//             error={!!errors.password}
//             style={styles.input}
//             right={
//               <TextInput.Icon
//                 icon={showPassword ? "eye-off" : "eye"}
//                 onPress={() =>
//                   setShowPassword(!showPassword)
//                 }
//               />
//             }
//           />
//         )}
//       />

//       {errors.password && (
//         <Text style={styles.error}>
//           {errors.password.message}
//         </Text>
//       )}

//       <TouchableRipple
//   onPress={() => navigation.navigate("ForgotPassword")}
// >
//   <Text style={styles.forgot}>
//     Forgot Password?
//   </Text>
// </TouchableRipple>

//       <Button
//         mode="contained"
//         style={styles.button}
//         onPress={handleSubmit(onSubmit)}
//       >
//         Login
//       </Button>

//       <View style={styles.footer}>
//         <Text>Don't have an account? </Text>

//         <TouchableRipple
//           onPress={() => navigation.navigate("Register")}
//         >
//           <Text style={styles.register}>
//             Register
//           </Text>
//         </TouchableRipple>
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: "center",
//     padding: 20,
//     backgroundColor: "#FFF8F8",
//   },

//   title: {
//     color: "#C2185B",
//     fontWeight: "bold",
//     marginBottom: 8,
//   },

//   subtitle: {
//     color: "#666",
//     marginBottom: 30,
//   },

//   input: {
//     marginBottom: 10,
//   },

//   error: {
//     color: "red",
//     marginBottom: 10,
//     marginLeft: 4,
//   },

//   forgot: {
//     textAlign: "right",
//     color: "#C2185B",
//     marginBottom: 20,
//   },

//   button: {
//     borderRadius: 8,
//     paddingVertical: 5,
//   },

//   footer: {
//     flexDirection: "row",
//     justifyContent: "center",
//     marginTop: 25,
//   },

//   register: {
//     color: "#C2185B",
//     fontWeight: "bold",
//   },
// });
// //we have to replace it later on if (response.data.user.role === "vendor") {
//   //    navigation.replace("Vendor");
//   //  } else {
//   //    navigation.replace("Couple");
//   //  }

import { useState } from "react";
import { View, StyleSheet, Alert } from "react-native";
import { UserRole } from "../../types/user";
import {
  Text,
  TextInput,
  Button,
  TouchableRipple,
} from "react-native-paper";
import { Controller, useForm } from "react-hook-form";
import {
  StackActions,
  useNavigation,
} from "@react-navigation/native";
import { login } from "../../api/auth.api";
import { useAuthStore } from "../../store/authStore";

type LoginForm = {
  email: string;
  password: string;
};

export default function LoginScreen() {
  const navigation = useNavigation<any>();
  const { login: saveAuth } = useAuthStore();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

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

  const onSubmit = async (data: LoginForm) => {
    try {
      setLoading(true);

      const response = await login(data);

      await saveAuth(
        response.accessToken,
        response.user
      );

      Alert.alert(
        "Success",
        response.message
      );

      // if (response.user.role === "Vendor") {
      //   navigation.replace("Vendor");
      //   return;
      // }

      // if (response.user.role === "admin") {
      //   navigation.replace("Admin");
      //   return;
      // }

      // navigation.replace("Couple");
      const appNavigation =
        navigation.getParent() ?? navigation;

      if (response.user.role === UserRole.VENDOR) {
        appNavigation.dispatch(
          StackActions.replace("Vendor"),
        );
        return;
      }

      if (response.user.role === UserRole.ADMIN) {
        appNavigation.dispatch(
          StackActions.replace("Admin"),
        );
        return;
      }

      appNavigation.dispatch(
        StackActions.replace("Couple"),
      );
    } catch (error: any) {
  console.log(
    "ERROR =>",
    JSON.stringify(error?.response?.data, null, 2)
  );

  Alert.alert(
    "Error",
    error?.response?.data?.message ??
      "Something went wrong."
  );
}finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>
        Welcome Back 👋
      </Text>

      <Text variant="bodyMedium" style={styles.subtitle}>
        Login to continue
      </Text>

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

      <TouchableRipple
        onPress={() =>
          navigation.navigate("ForgotPassword")
        }
      >
        <Text style={styles.forgot}>
          Forgot Password?
        </Text>
      </TouchableRipple>

      <Button
        mode="contained"
        style={styles.button}
        loading={loading}
        disabled={loading}
        onPress={handleSubmit(onSubmit)}
      >
        Login
      </Button>

      <View style={styles.footer}>
        <Text>Don't have an account? </Text>

        <TouchableRipple
          onPress={() =>
            navigation.navigate("Register")
          }
        >
          <Text style={styles.register}>
            Register
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

  forgot: {
    textAlign: "right",
    color: "#C2185B",
    marginBottom: 20,
  },

  button: {
    borderRadius: 8,
    paddingVertical: 5,
  },

  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 25,
  },

  register: {
    color: "#C2185B",
    fontWeight: "bold",
  },
});
