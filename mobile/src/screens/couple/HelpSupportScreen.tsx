import React, { useState } from "react";
import { View, Text, ScrollView, TextInput, TouchableOpacity, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { ContactInfoRow } from "../../components/users/helps/ContactInfoRow";
import { styles } from "./styles/HelpSupportScreen.styles";

// TODO: replace with real values from a config/API once available
const CONTACT_INFO = {
  phone: "+91 98765 43210",
  email: "hello@wedplan.com",
  office: ["Connaught Place,", "New Delhi, India"],
  hours: ["Monday - Saturday", "9:00 AM – 7:00 PM"],
};

export default function HelpSupportScreen() {
  const navigation = useNavigation<any>();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (!name.trim() || !email.trim() || !message.trim()) {
      Alert.alert("Missing information", "Please fill in your name, email, and message.");
      return;
    }

    // TODO: call a real API here, e.g. sendSupportMessage({ name, email, phone, subject, message })
    Alert.alert("Message Sent", "Thanks for reaching out! Our team will get back to you soon.");
    setName("");
    setEmail("");
    setPhone("");
    setSubject("");
    setMessage("");
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={22} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Help & Support</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Send Message form */}
        <View style={styles.formCard}>
          <Text style={styles.formBadge}>SEND MESSAGE</Text>
          <Text style={styles.formTitle}>
            We'd Love To Hear{"\n"}
            <Text style={styles.formTitleAccent}>From You</Text>
          </Text>

          <View style={styles.fieldRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.fieldLabel}>Your Name</Text>
              <TextInput
                style={styles.fieldInput}
                placeholder="Your Name"
                placeholderTextColor="#bbb"
                value={name}
                onChangeText={setName}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.fieldLabel}>Email Address</Text>
              <TextInput
                style={styles.fieldInput}
                placeholder="Email Address"
                placeholderTextColor="#bbb"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
            </View>
          </View>

          <View style={styles.fieldRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.fieldLabel}>Phone Number</Text>
              <TextInput
                style={styles.fieldInput}
                placeholder="Phone Number"
                placeholderTextColor="#bbb"
                keyboardType="phone-pad"
                value={phone}
                onChangeText={setPhone}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.fieldLabel}>Subject</Text>
              <TextInput
                style={styles.fieldInput}
                placeholder="Subject"
                placeholderTextColor="#bbb"
                value={subject}
                onChangeText={setSubject}
              />
            </View>
          </View>

          <Text style={[styles.fieldLabel, { marginTop: 16 }]}>Message</Text>
          <TextInput
            style={styles.messageInput}
            placeholder="Tell us how we can help..."
            placeholderTextColor="#bbb"
            multiline
            value={message}
            onChangeText={setMessage}
          />

          <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
            <MaterialIcons name="send" size={18} color="#fff" />
            <Text style={styles.sendButtonText}>Send Message</Text>
          </TouchableOpacity>
        </View>

        {/* Contact Information */}
        <View style={styles.infoCard}>
          <Text style={styles.infoCardTitle}>Contact Information</Text>
          <Text style={styles.infoCardSubtitle}>
            Reach out to us anytime. Our wedding experts are happy to guide you through every step of your planning journey.
          </Text>

          <ContactInfoRow icon="call" label="Phone" lines={[CONTACT_INFO.phone]} />
          <ContactInfoRow icon="mail-outline" label="Email" lines={[CONTACT_INFO.email]} />
          <ContactInfoRow icon="location-on" label="Office" lines={CONTACT_INFO.office} />
          <ContactInfoRow icon="access-time" label="Business Hours" lines={CONTACT_INFO.hours} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}