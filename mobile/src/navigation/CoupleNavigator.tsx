import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import HomeScreen from "../screens/couple/HomeScreen";

const Tab = createBottomTabNavigator();

export default function CoupleNavigator() {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
      />
    </Tab.Navigator>
  );
}