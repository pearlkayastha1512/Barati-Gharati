import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import CustomDrawer from '../components/admin/CustomDrawer';
import DashboardScreen from '../screens/admin/DashboardScreen';
import VendorManagement from '../screens/admin/VendorManagement';
import CustomerManagement from '../screens/admin/CustomerManagement';
import Bookings from '../screens/admin/Bookings';
import Payments from '../screens/admin/Payments';
import Reviews from '../screens/admin/Reviews';
import Notifications from '../screens/admin/Notifications';
import Settings from '../screens/admin/Settings';

const Drawer = createDrawerNavigator();

export default function DrawerNavigator() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawer {...props} />}
      screenOptions={{ headerShown: false, drawerType: 'front' }}
    >
      <Drawer.Screen name="Dashboard" component={DashboardScreen} />
      <Drawer.Screen name="VendorManagement" component={VendorManagement} />
      <Drawer.Screen name="CustomerManagement" component={CustomerManagement} />
      <Drawer.Screen name="Bookings" component={Bookings} />
      <Drawer.Screen name="Payments" component={Payments} />
      <Drawer.Screen name="Reviews" component={Reviews} />
      <Drawer.Screen name="Notifications" component={Notifications} />
      <Drawer.Screen name="Settings" component={Settings} />
    </Drawer.Navigator>
  );
}