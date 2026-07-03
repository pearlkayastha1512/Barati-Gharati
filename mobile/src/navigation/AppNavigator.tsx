import { createNativeStackNavigator } from "@react-navigation/native-stack";

import SplashScreen from "../screens/splash/SplashScreen";
//import OnboardingScreen from "../screens/onboarding/OnboardingScreen";

import AuthNavigator from "./AuthNavigator";
import CoupleNavigator from "./CoupleNavigator";
import VendorNavigator from "./VendorNavigator";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Splash"
      screenOptions={{
        headerShown: false,
      }}
    >
      {/* Splash Screen */}
      <Stack.Screen
        name="Splash"
        component={SplashScreen}
      />

      {/* Onboarding
      <Stack.Screen
        name="Onboarding"
        component={OnboardingScreen}
      /> */}

      {/* Authentication */}
      <Stack.Screen
        name="Auth"
        component={AuthNavigator}
      />

      {/* Couple App */}
      <Stack.Screen
        name="Couple"
        component={CoupleNavigator}
      />

      {/* Vendor App */}
      <Stack.Screen
        name="Vendor"
        component={VendorNavigator}
      />
    </Stack.Navigator>
  );
}