import { createNativeStackNavigator } from "@react-navigation/native-stack";

import LoginScreen from "../screens/auth/LoginScreen";
import RegisterScreen from "../screens/auth/RegisterScreen";
import ForgotPasswordScreen from "../screens/auth/ForgotPasswordScreen";
import VerifyEmailScreen from "../screens/auth/VerifyEmailScreen";
import ResetPasswordScreen from "../screens/auth/ResetPasswordScreen";
import VendorRegistrationScreen from "../screens/vendor/VendorRegistration/VendorRegistrationScreen";

const Stack = createNativeStackNavigator();

export default function AuthNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="Login"
        component={LoginScreen}
      />

      <Stack.Screen
        name="Register"
        component={RegisterScreen}
      />

      <Stack.Screen
        name="ForgotPassword"
        component={ForgotPasswordScreen}
      />

      <Stack.Screen
        name="VerifyEmail"
        component={VerifyEmailScreen}
      />

      <Stack.Screen
        name="ResetPassword"
        component={ResetPasswordScreen}
      />

      <Stack.Screen
        name="VendorRegister"
        component={VendorRegistrationScreen}
      />
    </Stack.Navigator>
  );
}