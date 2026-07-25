import React, { useState } from "react";
import { View, Text, ScrollView, TextInput, TouchableOpacity, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { ContactInfoRow } from "../../components/users/helps/ContactInfoRow";
import { styles } from "./styles/HelpSupportScreen.styles";

// TODO: replace with real values from a config/API once available
const CONTACT_INFO = {
  phone: "+91 98765 43210",
  email: "support@baratigharati.com",
  office: ["Office No. 2, Chamber 4, Udaigiri Tower, Kaushambi,", "Ghaziabad, Uttar Pradesh – 201010, India"],
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
          <MaterialIcons name="arrow-back" size={22} color="#3F1D2F" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Help & Support</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Hero */}
        <LinearGradient
          colors={["#fffef7", "#ffe6eb", "#ff8fa1", "#ff4d6d"]}
          locations={[0, 0.28, 0.68, 1]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.heroCard}
        >
          <View style={styles.heroBadge}>
            <MaterialIcons name="auto-awesome" size={14} color="#6C2D45" />
            <Text style={styles.heroBadgeText}>We're Here For You</Text>
          </View>

          <Text style={styles.heroTitle}>We'd Love To Hear{"\n"}From You</Text>
          <Text style={styles.heroSubtitle}>
            Questions, feedback, or need a hand planning? Send us a message and our wedding
            experts will get back to you shortly.
          </Text>
        </LinearGradient>

        {/* Send Message form */}
        <View style={styles.formCard}>
          <View style={styles.fieldRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.fieldLabel}>Your Name</Text>
              <TextInput
                style={styles.fieldInput}
                placeholder="Your Name"
                placeholderTextColor="#B78A9A"
                value={name}
                onChangeText={setName}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.fieldLabel}>Email Address</Text>
              <TextInput
                style={styles.fieldInput}
                placeholder="Email Address"
                placeholderTextColor="#B78A9A"
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
                placeholderTextColor="#B78A9A"
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
                placeholderTextColor="#B78A9A"
                value={subject}
                onChangeText={setSubject}
              />
            </View>
          </View>

          <Text style={[styles.fieldLabel, { marginTop: 16 }]}>Message</Text>
          <TextInput
            style={styles.messageInput}
            placeholder="Tell us how we can help..."
            placeholderTextColor="#B78A9A"
            multiline
            value={message}
            onChangeText={setMessage}
          />

          <TouchableOpacity style={styles.sendButton} onPress={handleSend} activeOpacity={0.9}>
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