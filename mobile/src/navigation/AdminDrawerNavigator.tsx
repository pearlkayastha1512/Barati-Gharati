import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import CustomDrawer from '../components/admin/CustomDrawer';
import DashboardScreen from '../screens/admin/DashboardScreen';
import VendorManagement from '../screens/admin/VendorManagement';
import CustomerManagement from '../screens/admin/CustomerManagement';
import ChatModeration from '../screens/admin/ChatModeration';

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
      <Drawer.Screen name="ChatModeration" component={ChatModeration} />
    </Drawer.Navigator>
  );
}
