import { createNativeStackNavigator } from "@react-navigation/native-stack";

import VendorsScreen from "../screens/couple/VendorsScreen";
import VendorDetailsScreen from "../screens/vendor/VendorDetailsScreen";
import PackageDetailsScreen from "../screens/vendor/PackageDetailsScreen";

const Stack = createNativeStackNavigator();

export default function VendorStackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="VendorList"
        component={VendorsScreen}
      />

      <Stack.Screen
        name="VendorDetails"
        component={VendorDetailsScreen}
      />

      <Stack.Screen
        name="PackageDetails"
        component={PackageDetailsScreen}
      />
    </Stack.Navigator>
  );
}