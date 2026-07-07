import { createNativeStackNavigator } from "@react-navigation/native-stack";

import VendorListScreen from "../screens/couple/VendorListScreen";
import VendorDetailsScreen from "../screens/couple/VendorDetailsScreen";
import PackageDetailsScreen from "../screens/vendor/PackageDetailsScreen";
//import BecomeVendorScreen from "../screens/vendor/BecomeVendorScreen";

const Stack = createNativeStackNavigator();

export default function VendorStackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="VendorList" component={VendorListScreen} />

      <Stack.Screen name="VendorDetails" component={VendorDetailsScreen} />

      <Stack.Screen name="PackageDetails" component={PackageDetailsScreen} />

    </Stack.Navigator>
  );
}
