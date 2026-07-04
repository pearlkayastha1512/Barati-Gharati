<<<<<<< HEAD

import AppNavigator from "./src/navigation/AppNavigator";

export default function App() {
  return <AppNavigator />;
=======
import { PaperProvider } from "react-native-paper";
import AppNavigator from "./src/navigation/AppNavigator";

export default function App() {
  return (
    <PaperProvider>
      <AppNavigator />
    </PaperProvider>
  );
>>>>>>> 08d2d8c36759070f78a1b5cb46e23c24539348b1
}