// import { PaperProvider } from "react-native-paper";
// import AppNavigator from "./src/navigation/AppNavigator";

// export default function App() {
//   return (
//     <PaperProvider>
//       <AppNavigator />
//     </PaperProvider>
//   );
// }
import "react-native-gesture-handler";
import { PaperProvider } from "react-native-paper";
import AppNavigator from "./src/navigation/AppNavigator";

export default function App() {
  return (
    <PaperProvider>
      <AppNavigator />
    </PaperProvider>
  );
}
// import 'react-native-gesture-handler';
// import React from 'react';
// import { NavigationContainer } from '@react-navigation/native';
// import { PaperProvider } from 'react-native-paper';
// import AdminDrawerNavigator from './src/navigation/AdminDrawerNavigator';

// export default function App() {
//   return (
//     <PaperProvider>
//       <NavigationContainer>
//         <AdminDrawerNavigator />
//       </NavigationContainer>
//     </PaperProvider>
//   );
// }