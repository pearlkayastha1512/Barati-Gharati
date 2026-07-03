import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import VendorHomeScreen from "../screens/vendor/VendorHomeScreen";

const Tab = createBottomTabNavigator();

export default function VendorNavigator() {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Dashboard"
        component={VendorHomeScreen}
      />
    </Tab.Navigator>
  );
}