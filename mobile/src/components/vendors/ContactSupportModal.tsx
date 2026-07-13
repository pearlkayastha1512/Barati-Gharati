import React from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  Linking,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { styles } from "./ContactSupportModal.styles";

type Props = {
  visible: boolean;
  onClose: () => void;
};

export default function ContactSupportModal({
  visible,
  onClose,
}: Props) {

  const handleCall = () => {
    Linking.openURL("tel:+919876543210");
  };

  const handleEmail = () => {
    Linking.openURL(
      "mailto:support@baratigharati.com"
    );
  };


  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
    >
      <View style={styles.overlay}>

        <View style={styles.container}>

          <View style={styles.header}>
            <Text style={styles.title}>
              Contact Support
            </Text>

            <TouchableOpacity onPress={onClose}>
              <MaterialIcons
                name="close"
                size={24}
                color="#777"
              />
            </TouchableOpacity>
          </View>


          <Text style={styles.subtitle}>
            Having trouble?
          </Text>


          <View style={styles.infoRow}>
            <MaterialIcons
              name="phone"
              size={22}
              color="#C2185B"
            />

            <Text style={styles.infoText}>
              +91 9876543210
            </Text>
          </View>



          <View style={styles.infoRow}>
            <MaterialIcons
              name="email"
              size={22}
              color="#C2185B"
            />

            <Text style={styles.infoText}>
              support@baratigharati.com
            </Text>
          </View>



          <View style={styles.infoRow}>
            <MaterialIcons
              name="schedule"
              size={22}
              color="#C2185B"
            />

            <Text style={styles.infoText}>
              Mon - Sat{"\n"}
              10:00 AM - 6:00 PM
            </Text>
          </View>



          <Text style={styles.message}>
            We usually respond within 24 hours.
          </Text>



          <TouchableOpacity
            style={styles.primaryButton}
            onPress={handleCall}
          >
            <MaterialIcons
              name="call"
              size={18}
              color="white"
            />

            <Text style={styles.primaryText}>
              Call Now
            </Text>

          </TouchableOpacity>



          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={handleEmail}
          >

            <MaterialIcons
              name="email"
              size={18}
              color="#C2185B"
            />

            <Text style={styles.secondaryText}>
              Send Email
            </Text>

          </TouchableOpacity>



          <TouchableOpacity
            style={styles.closeButton}
            onPress={onClose}
          >
            <Text style={styles.closeText}>
              Close
            </Text>
          </TouchableOpacity>


        </View>

      </View>
    </Modal>
  );
}