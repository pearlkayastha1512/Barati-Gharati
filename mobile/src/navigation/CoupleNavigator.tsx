import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "@expo/vector-icons/Ionicons";

import HomeScreen from "../screens/couple/HomeScreen";
import VendorStackNavigator from "./VendorStackNavigator";
import BookingScreen from "../screens/couple/BookingScreen";
import BudgetScreen from "../screens/couple/BudgetScreen";
import ProfileScreen from "../screens/couple/ProfileScreen";

const Tab = createBottomTabNavigator();

export default function CoupleNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,

        tabBarActiveTintColor: "#C2185B",
        tabBarInactiveTintColor: "gray",

        tabBarIcon: ({ color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = "home";

          if (route.name === "Home") iconName = "home";
          else if (route.name === "Vendors") iconName = "storefront";
          else if (route.name === "Bookings") iconName = "calendar";
          else if (route.name === "Budget") iconName = "wallet";
          else if (route.name === "Profile") iconName = "person";

          return (
            <Ionicons
              name={iconName}
              size={size}
              color={color}
            />
          );
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Vendors" component={VendorStackNavigator} />
      <Tab.Screen name="Bookings" component={BookingScreen} />
      <Tab.Screen name="Budget" component={BudgetScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}