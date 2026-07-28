import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import SplashScreen from "../screens/splash/SplashScreen";
import OnboardingScreen from "../screens/onboarding/OnboardingScreen";

import CoupleNavigator from "./CoupleNavigator";
import VendorNavigator from "./VendorNavigator";
import AuthNavigator from "./AuthNavigator";
import AdminDrawerNavigator from "./AdminDrawerNavigator";
import { usePushNotifications } from "../hooks/usePushNotifications";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  usePushNotifications();

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        <Stack.Screen name="Auth" component={AuthNavigator} />
        <Stack.Screen name="Couple" component={CoupleNavigator} />
        <Stack.Screen name="Vendor" component={VendorNavigator} />
        <Stack.Screen name="Admin" component={AdminDrawerNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}