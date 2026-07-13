import React, { useEffect, useState } from "react";
import {
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Switch,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

import { useVendorSettingsStore } from "../../store/vendorSettingsStore";
import {
  getMyVendorProfile,
  updateVendorProfile,
} from "../../api/vendor.api";

import { styles } from "./vendorSettingsStyles";
import { COLORS } from "../../constants/theme";

const GRADIENT_START = COLORS.gradientStart;
const GRADIENT_END = COLORS.gradientEnd;

export default function VendorSettingsScreen() {

  const navigation = useNavigation<any>();

  const {
    businessVisibility,
    acceptNewBookings,
    displayPricingPublicly,
    availabilityCalendarVisible,
    newBookingNotifications,
    paymentAlerts,
    customerMessageAlerts,
    marketingEmails,
    toggleSetting,
    submitPasswordChange,
    isChangingPassword,
  } = useVendorSettingsStore();

  const [vendorProfile,setVendorProfile] = useState<any>(null);

  const [ownerName,setOwnerName] = useState("");
  const [email,setEmail] = useState("");
  const [phone,setPhone] = useState("");

  const [currentPassword,setCurrentPassword] = useState("");
  const [newPassword,setNewPassword] = useState("");
  const [confirmPassword,setConfirmPassword] = useState("");

  const [saving,setSaving] = useState(false);


  useEffect(()=>{
    loadVendorProfile();
  },[]);


  const loadVendorProfile = async()=>{

    try{

      const response = await getMyVendorProfile();

      const data = response.data;

      setVendorProfile(data);

      setOwnerName(data?.businessName ?? "");
      setEmail(data?.user?.email ?? "");
      setPhone(data?.user?.phone ?? "");

    }
    catch(error){
      console.log("Vendor profile error",error);
    }

  };


  const handleSaveAccount = async()=>{

    try{

      setSaving(true);

      await updateVendorProfile({
        ownerName,
        email,
        phone,
        businessName: ownerName,
      });

      Alert.alert(
        "Success",
        "Business profile updated successfully"
      );

      loadVendorProfile();

    }
    catch(error){

      console.log(error);

      Alert.alert(
        "Error",
        "Unable to update profile"
      );

    }
    finally{
      setSaving(false);
    }

  };


  const handleChangePassword = async()=>{

    if(!currentPassword || !newPassword || !confirmPassword){
      Alert.alert(
        "Error",
        "Please fill all password fields"
      );
      return;
    }

    if(newPassword !== confirmPassword){
      Alert.alert(
        "Error",
        "Passwords do not match"
      );
      return;
    }


    const result = await submitPasswordChange(
      currentPassword,
      newPassword
    );


    Alert.alert(
      result.success ? "Success":"Error",
      result.success
      ? "Password changed successfully"
      : result.message
    );


    if(result.success){
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }

  };


  return(
    <SafeAreaView
      style={styles.safeArea}
      edges={["top"]}
    >

    <ScrollView
      contentContainerStyle={styles.scroll}
      showsVerticalScrollIndicator={false}
    >

    <LinearGradient
      colors={[GRADIENT_START,GRADIENT_END]}
      start={{x:0,y:0}}
      end={{x:1,y:1}}
      style={styles.heroCard}
    >

      <TouchableOpacity
        onPress={()=>navigation.goBack()}
        style={styles.backButton}
      >
        <MaterialCommunityIcons
          name="arrow-left"
          size={20}
          color="#fff"
        />
      </TouchableOpacity>


      <View style={styles.heroPill}>
        <MaterialCommunityIcons
          name="cog-outline"
          size={13}
          color="#fff"
        />
        <Text style={styles.heroPillText}>
          Vendor Settings
        </Text>
      </View>


      <Text style={styles.heroTitle}>
        {vendorProfile?.businessName ?? "Your Business"}
      </Text>


      <Text style={styles.heroSubtitle}>
        Manage your business preferences, notifications and security settings.
      </Text>

    </LinearGradient>



    {/* ACCOUNT */}

    <View style={styles.section}>

      <Text style={styles.sectionTitle}>
        Account
      </Text>

      <Text style={styles.sectionSubtitle}>
        Update your business and contact details.
      </Text>


      <TextInput
        style={styles.input}
        placeholder="Business Name"
        placeholderTextColor="#999"
        value={ownerName}
        onChangeText={setOwnerName}
      />


      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#999"
        value={email}
        editable={false}
      />


      <TextInput
        style={styles.input}
        placeholder="Phone"
        placeholderTextColor="#999"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
      />


      <TouchableOpacity
        style={[
          styles.primaryButton,
          {backgroundColor:COLORS.primary}
        ]}
        onPress={handleSaveAccount}
        disabled={saving}
      >

        <Text style={styles.primaryButtonText}>
          {saving ? "Saving..." : "Save Account"}
        </Text>

      </TouchableOpacity>

    </View>




    {/* PASSWORD */}

    <View style={styles.section}>

      <Text style={styles.sectionTitle}>
        Change Password
      </Text>


      <TextInput
        style={styles.input}
        placeholder="Current Password"
        placeholderTextColor="#999"
        secureTextEntry
        value={currentPassword}
        onChangeText={setCurrentPassword}
      />


      <TextInput
        style={styles.input}
        placeholder="New Password"
        placeholderTextColor="#999"
        secureTextEntry
        value={newPassword}
        onChangeText={setNewPassword}
      />


      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        placeholderTextColor="#999"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />


      <TouchableOpacity
        style={[
          styles.primaryButton,
          {backgroundColor:COLORS.primary}
        ]}
        onPress={handleChangePassword}
        disabled={isChangingPassword}
      >

        <Text style={styles.primaryButtonText}>
          {isChangingPassword
          ?"Changing..."
          :"Change Password"}
        </Text>

      </TouchableOpacity>

    </View>




    {/* BUSINESS SETTINGS */}

    <View style={styles.section}>

      <Text style={styles.sectionTitle}>
        Business Preferences
      </Text>


      <SettingToggle
        title="Business Visibility"
        subtitle="Show your business to customers."
        value={businessVisibility}
        onPress={()=>toggleSetting("businessVisibility")}
      />


      <SettingToggle
        title="Accept New Bookings"
        subtitle="Allow new booking requests."
        value={acceptNewBookings}
        onPress={()=>toggleSetting("acceptNewBookings")}
      />


      <SettingToggle
        title="Display Pricing Publicly"
        subtitle="Show service prices."
        value={displayPricingPublicly}
        onPress={()=>toggleSetting("displayPricingPublicly")}
      />


      <SettingToggle
        title="Availability Calendar"
        subtitle="Show available dates."
        value={availabilityCalendarVisible}
        onPress={()=>toggleSetting("availabilityCalendarVisible")}
      />

    </View>




    {/* NOTIFICATIONS */}

    <View style={styles.section}>

      <Text style={styles.sectionTitle}>
        Notifications
      </Text>


      <SettingToggle
        title="Booking Notifications"
        subtitle="Receive booking alerts."
        value={newBookingNotifications}
        onPress={()=>toggleSetting("newBookingNotifications")}
      />


      <SettingToggle
        title="Payment Alerts"
        subtitle="Payment updates."
        value={paymentAlerts}
        onPress={()=>toggleSetting("paymentAlerts")}
      />


      <SettingToggle
        title="Customer Messages"
        subtitle="Chat notifications."
        value={customerMessageAlerts}
        onPress={()=>toggleSetting("customerMessageAlerts")}
      />


      <SettingToggle
        title="Marketing Emails"
        subtitle="Offers and updates."
        value={marketingEmails}
        onPress={()=>toggleSetting("marketingEmails")}
      />

    </View>




    {/* DANGER */}

    <View style={styles.dangerSection}>

      <Text style={styles.dangerTitle}>
        Danger Zone
      </Text>

      <Text style={styles.dangerText}>
        Deactivating hides your business from customers.
      </Text>


      <TouchableOpacity
        style={styles.dangerButton}
        onPress={()=>
          Alert.alert(
            "Coming Soon",
            "Business deactivation will be available later"
          )
        }
      >

        <Text style={styles.dangerButtonText}>
          Deactivate Business
        </Text>

      </TouchableOpacity>

    </View>


    </ScrollView>

    </SafeAreaView>
  );

}



function SettingToggle({
  title,
  subtitle,
  value,
  onPress
}:any){

return(
<View style={styles.toggleRow}>

<View style={{flex:1}}>

<Text style={styles.toggleLabel}>
{title}
</Text>

<Text style={styles.toggleSubtext}>
{subtitle}
</Text>

</View>


<Switch
value={value}
onValueChange={onPress}
/>


</View>
);

}