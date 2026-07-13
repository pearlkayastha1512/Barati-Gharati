import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import VendorHomeScreen from "../screens/vendor/VendorHomeScreen";
import BookingsScreen from "../screens/vendor/BookingsScreen";
import ServicesScreen from "../screens/vendor/ServicesScreen";
import VendorMessagesScreen from "../screens/vendor/VendorMessagesScreen";
import NotificationsScreen from "../screens/vendor/NotificationsScreen";
import VendorProfileScreen from "../screens/vendor/VendorProfileScreen";

import PortfolioScreen from "../screens/vendor/PortfolioScreen";
import ReviewsScreen from "../screens/vendor/ReviewsScreen";
import VendorCalendarScreen from "../screens/vendor/VendorCalendarScreen";
import EarningsScreen from "../screens/vendor/VendorEarningsScreen";
import AnalyticsScreen from "../screens/vendor/VendorAnalyticsScreen";
import VendorSettingsScreen from "../screens/vendor/VendorSettingsScreen";
import VendorChatbotScreen from "../screens/vendor/VendorChatbotScreen";
import VendorEditProfileScreen from "../screens/vendor/VendorEditProfileScreen";

import { COLORS } from "../constants/theme";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function VendorTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: "gray",
        tabBarIcon: ({ color, size }) => {
          let iconName: keyof typeof MaterialCommunityIcons.glyphMap = "view-dashboard-outline";

          if (route.name === "Dashboard") iconName = "view-dashboard-outline";
          else if (route.name === "Bookings") iconName = "calendar-check-outline";
          else if (route.name === "Services") iconName = "briefcase-outline";
          else if (route.name === "Messages") iconName = "chat-outline";
          else if (route.name === "Profile") iconName = "account-outline";

          return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Dashboard" component={VendorHomeScreen} />
      <Tab.Screen name="Bookings" component={BookingsScreen} />
      <Tab.Screen name="Services" component={ServicesScreen} />
      <Tab.Screen name="Messages" component={VendorMessagesScreen} />
       <Tab.Screen name="Profile" component={VendorProfileScreen} /> 
    </Tab.Navigator>
  );
}

export default function VendorNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
  <Stack.Screen name="VendorTabs" component={VendorTabs} />

  <Stack.Screen
    name="VendorNotifications"
    component={NotificationsScreen}
  />
  <Stack.Screen
    name="VendorChatbot"
    component={VendorChatbotScreen}
  />

  <Stack.Screen name="Portfolio" component={PortfolioScreen} />
  <Stack.Screen name="Reviews" component={ReviewsScreen} />
  <Stack.Screen name="VendorCalendar" component={VendorCalendarScreen} />
  <Stack.Screen name="Earnings" component={EarningsScreen} />
  <Stack.Screen name="Analytics" component={AnalyticsScreen} />
  <Stack.Screen name="Settings" component={VendorSettingsScreen} />
  <Stack.Screen
  name="VendorEditProfile"
  component={VendorEditProfileScreen}
/>
</Stack.Navigator>
  );}