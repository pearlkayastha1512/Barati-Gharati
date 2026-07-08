import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Ionicons from "@expo/vector-icons/Ionicons";

import HomeScreen from "../screens/couple/HomeScreen";
import VendorStackNavigator from "./VendorStackNavigator";
import BookingScreen from "../screens/couple/BookingScreen";
import BudgetScreen from "../screens/couple/BudgetScreen";
import ProfileScreen from "../screens/couple/ProfileScreen";
import ChecklistScreen from "../screens/couple/ChecklistScreen"; // NEW
import SettingsScreen from "../screens/couple/SettingsScreen"; 
import NotificationsScreen from "../screens/couple/NotificationsScreen"; // NEW
import HelpSupportScreen from "../screens/couple/HelpSupportScreen"; // NEW
import WishlistScreen from "../screens/couple/WishlistScreen"; 
import MessagesScreen from "../screens/couple/MessagesScreen";
import ChatScreen from "../screens/couple/ChatScreen";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator(); // NEW

function CoupleTabs() {
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

          return <Ionicons name={iconName} size={size} color={color} />;
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

// NEW: outer stack — tabs are the default screen, Checklist opens on top of them
export default function CoupleNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="CoupleTabs" component={CoupleTabs} />
      <Stack.Screen name="Checklist" component={ChecklistScreen} />
      <Stack.Screen name="Messages" component={MessagesScreen} />
<Stack.Screen name="Chat" component={ChatScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} /> 
      <Stack.Screen name="HelpSupport" component={HelpSupportScreen} />
      <Stack.Screen name="Wishlist" component={WishlistScreen} />  
      
    </Stack.Navigator>
  );
}