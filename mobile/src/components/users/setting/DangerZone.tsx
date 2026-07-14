// import React from "react";
// import { View, Text, TouchableOpacity } from "react-native";
// import { MaterialIcons } from "@expo/vector-icons";
// import { styles } from "../../../screens/couple/styles/SettingsScreen.styles";

// type Props = {
//   onLogout: () => void;
//   onDeleteAccount: () => void;
// };

// export function DangerZone({ onLogout, onDeleteAccount }: Props) {
//   return (
//     <View style={styles.dangerCard}>
//       <Text style={styles.dangerTitle}>Danger Zone</Text>
//       <Text style={styles.dangerSubtitle}>These actions are irreversible.</Text>

//       <View style={styles.dangerButtonRow}>
//         <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
//           <MaterialIcons name="logout" size={16} color="#22B07D" />
//           <Text style={styles.logoutButtonText}>Logout</Text>
//         </TouchableOpacity>
//         <TouchableOpacity style={styles.deleteButton} onPress={onDeleteAccount}>
//           <MaterialIcons name="delete-outline" size={16} color="#fff" />
//           <Text style={styles.deleteButtonText}>Delete Account</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// }

import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

import { styles } from "../../../screens/couple/styles/SettingsScreen.styles";

type Props = {
  onLogout: () => void;
  onDeleteAccount: () => void;
};

export function DangerZone({
  onLogout,
  onDeleteAccount,
}: Props) {
  return (
    <View style={styles.dangerCard}>
      <Text style={styles.dangerTitle}>
        Danger Zone
      </Text>

      <Text style={styles.dangerSubtitle}>
        These actions are irreversible.
      </Text>

      <View style={styles.dangerButtonRow}>
        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.logoutButton}
          onPress={onLogout}
          accessibilityRole="button"
          accessibilityLabel="Logout"
        >
          <MaterialIcons
            name="logout"
            size={18}
            color="#6c2d45"
          />

          <Text style={styles.logoutButtonText}>
            Logout
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.deleteButton}
          onPress={onDeleteAccount}
          accessibilityRole="button"
          accessibilityLabel="Delete account"
        >
          <MaterialIcons
            name="delete-outline"
            size={18}
            color="#fff"
          />

          <Text style={styles.deleteButtonText}>
            Delete Account
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
