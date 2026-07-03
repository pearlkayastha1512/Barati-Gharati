import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import SplashScreen from "../screens/splash/SplashScreen";
import OnboardingScreen from "../screens/onboarding/OnboardingScreen";

import AuthNavigator from "./AuthNavigator";
import CoupleNavigator from "./CoupleNavigator";
import VendorNavigator from "./VendorNavigator";

const Stack = createNativeStackNavigator();

export default function AppNavigator( ) {
   console.log("🔥 AppNavigator rendered");
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Splash" component={SplashScreen}
          listeners={{
    focus: () => console.log("🔥 Splash route focused"),
  }} />
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        <Stack.Screen name="Auth" component={AuthNavigator} />
        <Stack.Screen name="Couple" component={CoupleNavigator} />
        <Stack.Screen name="Vendor" component={VendorNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}